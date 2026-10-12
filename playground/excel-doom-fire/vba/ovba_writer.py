"""Pure-Python vbaProject.bin writer (MS-CFB v3 + MS-OVBA, source-only, no p-code).

Step-0 spike recipe for excel-doom-fire M2 (SPEC.md "VBA build recipe").
Excel's AppleScript dictionary has no VB-project import verb, so the .xlsm is built
offline: this module turns source text into a vbaProject.bin, XlsxWriter's
`add_vba_project` embeds it. `_VBA_PROJECT` carries version 0xFFFF (no performance
cache), so Excel compiles the module source on load.

The builder card may vendor this file into `vba/` for `vba/build_vba.py`; keep the
function signatures (`build_vba_project`, `compress`) stable.
"""
import struct

ENDOFCHAIN, FREESECT, FATSECT, NOSTREAM = 0xFFFFFFFE, 0xFFFFFFFF, 0xFFFFFFFD, 0xFFFFFFFF

# ---------------------------------------------------------------- MS-OVBA compression


def _compress_chunk(chunk: bytes) -> bytes:
    out = bytearray()
    pos = 0
    n = len(chunk)
    while pos < n:
        flag_at = len(out)
        out.append(0)
        flags = 0
        for bit in range(8):
            if pos >= n:
                break
            best_len, best_off, bit_count = 0, 0, 4
            if pos > 0:
                bit_count = max((pos - 1).bit_length(), 4)
                max_len = (0xFFFF >> bit_count) + 3
                for start in range(pos - 1, -1, -1):
                    ln = 0
                    while (ln < max_len and pos + ln < n
                           and chunk[start + ln] == chunk[pos + ln]):
                        ln += 1
                    if ln > best_len:
                        best_len, best_off = ln, pos - start
                        if ln == max_len:
                            break
            if best_len >= 3:
                token = ((best_off - 1) << (16 - bit_count)) | (best_len - 3)
                out += struct.pack("<H", token)
                flags |= 1 << bit
                pos += best_len
            else:
                out.append(chunk[pos])
                pos += 1
        out[flag_at] = flags
    return bytes(out)


def compress(data: bytes) -> bytes:
    """MS-OVBA 2.4.1 CompressedContainer."""
    out = bytearray(b"\x01")
    for i in range(0, max(len(data), 1), 4096):
        chunk = data[i:i + 4096]
        comp = _compress_chunk(chunk)
        if len(comp) > 4094:  # does not fit: raw chunk, padded to 4096
            out += struct.pack("<H", 0x3FFF) + chunk.ljust(4096, b"\x00")
        else:
            out += struct.pack("<H", 0xB000 | (len(comp) + 2 - 3)) + comp
    return bytes(out)


# ---------------------------------------------------------------- dir stream


def _rec(rid: int, payload: bytes) -> bytes:
    return struct.pack("<HI", rid, len(payload)) + payload


def build_dir(project_name, modules):
    d = bytearray()
    d += _rec(0x0001, struct.pack("<I", 1))
    d += _rec(0x0002, struct.pack("<I", 0x409))
    d += _rec(0x0014, struct.pack("<I", 0x409))
    d += _rec(0x0003, struct.pack("<H", 1252))
    d += _rec(0x0004, project_name.encode("cp1252"))
    d += _rec(0x0005, b"") + _rec(0x0040, b"")
    d += _rec(0x0006, b"") + _rec(0x003D, b"")
    d += _rec(0x0007, struct.pack("<I", 0))
    d += _rec(0x0008, struct.pack("<I", 0))
    # PROJECTVERSION: id, reserved size=4, major(4), minor(2)
    d += struct.pack("<HIIH", 0x0009, 4, 0x52671F51, 0x0020)
    d += _rec(0x000C, b"") + _rec(0x003C, b"")        # CONSTANTS
    # references: stdole + Office (copied from an Excel-written project)
    for name, libid in (
        ("stdole", b"*\\G{00020430-0000-0000-C000-000000000046}#2.0#0#"
                   b"C:\\WINDOWS\\system32\\stdole2.tlb#OLE Automation"),
        ("Office", b"*\\G{2DF8D04C-5BFA-101B-BDE5-00AA0044DE52}#2.0#0#"
                   b"C:\\Program Files\\Common Files\\Microsoft Shared\\OFFICE12\\MSO.DLL"
                   b"#Microsoft Office 12.0 Object Library"),
    ):
        d += _rec(0x0016, name.encode()) + _rec(0x003E, name.encode("utf-16-le"))
        body = struct.pack("<I", len(libid)) + libid + struct.pack("<IH", 0, 0)
        d += _rec(0x000D, body)
    d += _rec(0x000F, struct.pack("<H", len(modules)))
    d += _rec(0x0013, struct.pack("<H", 0xFFFF))
    for name, kind in modules:
        nb = name.encode("cp1252")
        d += _rec(0x0019, nb) + _rec(0x0047, name.encode("utf-16-le"))
        d += _rec(0x001A, nb) + _rec(0x0032, name.encode("utf-16-le"))
        d += _rec(0x001C, b"") + _rec(0x0048, b"")
        d += _rec(0x0031, struct.pack("<I", 0))                # no p-code: text at 0
        d += _rec(0x001E, struct.pack("<I", 0))
        d += _rec(0x002C, struct.pack("<H", 0xFFFF))
        d += _rec(0x0021 if kind == "std" else 0x0022, b"")
        d += _rec(0x002B, b"")
    d += _rec(0x0010, b"")
    return bytes(d)


# ---------------------------------------------------------------- PROJECT streams

_DOC_BASE = {
    "ThisWorkbook": "0{00020819-0000-0000-C000-000000000046}",
}
_SHEET_BASE = "0{00020820-0000-0000-C000-000000000046}"


def doc_module_source(name: str) -> str:
    base = _DOC_BASE.get(name, _SHEET_BASE)
    return (f'Attribute VB_Name = "{name}"\r\nAttribute VB_Base = "{base}"\r\n'
            "Attribute VB_GlobalNameSpace = False\r\nAttribute VB_Creatable = False\r\n"
            "Attribute VB_PredeclaredId = True\r\nAttribute VB_Exposed = True\r\n"
            "Attribute VB_TemplateDerived = False\r\nAttribute VB_Customizable = True\r\n")


def _project_text(doc_names, std_names):
    # ID / CMG / DPB / GC copied from an Excel-written, unprotected project.
    lines = ['ID="{8D807122-0657-42C8-BC6F-4B5FD08031C9}"']
    lines += [f"Document={n}/&H00000000" for n in doc_names]
    lines += [f"Module={n}" for n in std_names]
    lines += ['Name="VBAProject"', 'HelpContextID="0"', 'VersionCompatible32="393222000"',
              'CMG="DBD966ECE4F0E4F0E4F0E4F0"', 'DPB="5557E86E18E919E919E9"',
              'GC="CFCD72F0961011111111EE"', "", "[Host Extender Info]",
              "&H00000001={3832D640-CF90-11CF-8E43-00A0C911005A};VBE;&H00000000", "",
              "[Workspace]"]
    lines += [f"{n}=0, 0, 0, 0, C" for n in doc_names]
    lines += [f"{n}=110, 145, 994, 721, " for n in std_names]
    return ("\r\n".join(lines) + "\r\n").encode("cp1252")


def _projectwm(names):
    out = b""
    for n in names:
        out += n.encode("cp1252") + b"\x00" + n.encode("utf-16-le") + b"\x00\x00"
    return out + b"\x00\x00"


def build_vba_project(std_modules, doc_modules=("ThisWorkbook", "Sheet1")):
    """std_modules: {name: source_text_with_Attribute_VB_Name_line}. Returns bytes of
    vbaProject.bin. Source line endings are normalised to CRLF."""
    streams = {}
    mods = [(n, "doc") for n in doc_modules] + [(n, "std") for n in std_modules]
    streams["VBA/dir"] = compress(build_dir("VBAProject", mods))
    streams["VBA/_VBA_PROJECT"] = b"\xcc\x61\xff\xff\x00\x00\x00"
    for n in doc_modules:
        streams[f"VBA/{n}"] = compress(doc_module_source(n).encode("cp1252"))
    for n, src in std_modules.items():
        text = src.replace("\r\n", "\n").replace("\n", "\r\n")
        streams[f"VBA/{n}"] = compress(text.encode("cp1252"))
    streams["PROJECT"] = _project_text(doc_modules, list(std_modules))
    streams["PROJECTwm"] = _projectwm([n for n, _ in mods])
    return write_cfb(streams)


# ---------------------------------------------------------------- MS-CFB v3 writer


def _entry(name, typ, left, right, child, start, size):
    nb = name.encode("utf-16-le")
    return (nb.ljust(64, b"\x00") + struct.pack("<HBB", len(nb) + 2 if name else 0, typ, 1)
            + struct.pack("<III", left, right, child) + b"\x00" * 16 + struct.pack("<I", 0)
            + b"\x00" * 16 + struct.pack("<IQ", start, size))


def _bst(ids):
    """Balanced BST over already-sorted child ids -> (root, {id: (l, r)})."""
    links = {}

    def build(lo, hi):
        if lo >= hi:
            return NOSTREAM
        mid = (lo + hi) // 2
        links[ids[mid]] = (build(lo, mid), build(mid + 1, hi))
        return ids[mid]

    return build(0, len(ids)), links


def write_cfb(streams):
    S = 512
    # entries: 0 root, 1 VBA storage, then streams
    sorted_names = sorted(streams)
    root_children, vba_children = [], []
    ents = [("Root Entry", 5), ("VBA", 1)]
    for p in sorted_names:
        ents.append((p.split("/")[-1], 2))
    idx = {p: i + 2 for i, p in enumerate(sorted_names)}

    def key(i):
        n = ents[i][0]
        return (len(n), n.upper())

    for p in sorted_names:
        (vba_children if p.startswith("VBA/") else root_children).append(idx[p])
    root_children.append(1)
    root_children.sort(key=key)
    vba_children.sort(key=key)
    root_child, root_links = _bst(root_children)
    vba_child, vba_links = _bst(vba_children)
    links = {**root_links, **vba_links}

    small = [p for p in sorted_names if len(streams[p]) < 4096]
    big = [p for p in sorted_names if len(streams[p]) >= 4096]

    # mini stream
    mini = bytearray()
    minifat = []
    start = {}
    for p in small:
        data = streams[p]
        start[p] = len(mini) // 64
        nsec = -(-len(data) // 64)
        mini += data.ljust(nsec * 64, b"\x00")
        minifat += list(range(start[p] + 1, start[p] + nsec)) + [ENDOFCHAIN]
    mf_bytes = b"".join(struct.pack("<I", v) for v in minifat)
    mf_bytes = mf_bytes.ljust(-(-len(mf_bytes) // S) * S, b"\xff") if mf_bytes else b""

    # sector allocation (data sectors in order: big streams, mini container, minifat, dir)
    n_dir_sec = -(-len(ents) // 4)
    sectors = []  # list of (bytes)
    fat = []

    def alloc(data):
        nsec = -(-len(data) // S)
        first = len(fat)
        for k in range(nsec):
            fat.append(first + k + 1 if k < nsec - 1 else ENDOFCHAIN)
            sectors.append(data[k * S:(k + 1) * S].ljust(S, b"\x00"))
        return first if nsec else ENDOFCHAIN

    for p in big:
        start[p] = alloc(streams[p])
    mini_first = alloc(bytes(mini)) if mini else ENDOFCHAIN
    mf_first = alloc(mf_bytes) if mf_bytes else ENDOFCHAIN
    dir_first = len(fat)
    dir_pos = len(sectors)
    for _ in range(n_dir_sec):
        fat.append(len(fat) + 1)
        sectors.append(b"")
    fat[-1] = ENDOFCHAIN
    # FAT sectors
    n_fat = 1
    while n_fat * 128 < len(fat) + n_fat:
        n_fat += 1
    assert n_fat <= 109
    fat_first = len(fat)
    fat += [FATSECT] * n_fat
    fat += [FREESECT] * (n_fat * 128 - len(fat))

    # directory
    dbytes = bytearray()
    for i, (name, typ) in enumerate(ents):
        if i == 0:
            dbytes += _entry(name, 5, NOSTREAM, NOSTREAM, root_child,
                             mini_first, len(mini))
        elif i == 1:
            l, r = links.get(1, (NOSTREAM, NOSTREAM))
            dbytes += _entry(name, 1, l, r, vba_child, 0, 0)
        else:
            p = sorted_names[i - 2]
            l, r = links.get(i, (NOSTREAM, NOSTREAM))
            dbytes += _entry(name, 2, l, r, NOSTREAM, start[p], len(streams[p]))
    while len(dbytes) % S:
        dbytes += b"\x00" * 128
    # free entries must have NOSTREAM sibling ids
    for k in range(len(ents) * 128, len(dbytes), 128):
        dbytes[k + 68:k + 80] = b"\xff" * 12
    for k in range(n_dir_sec):
        sectors[dir_pos + k] = bytes(dbytes[k * S:(k + 1) * S])
    fat_bytes = b"".join(struct.pack("<I", v) for v in fat)
    for k in range(n_fat):
        sectors.append(fat_bytes[k * S:(k + 1) * S])

    hdr = bytearray(S)
    hdr[0:8] = bytes.fromhex("D0CF11E0A1B11AE1")
    struct.pack_into("<HHHHH", hdr, 24, 0x3E, 3, 0xFFFE, 9, 6)
    struct.pack_into("<IIIIII", hdr, 40, 0, n_fat, dir_first, 0, 4096, mf_first)
    struct.pack_into("<III", hdr, 64, len(mf_bytes) // S, ENDOFCHAIN, 0)
    for k in range(109):
        struct.pack_into("<I", hdr, 76 + 4 * k, fat_first + k if k < n_fat else FREESECT)
    return bytes(hdr) + b"".join(sectors)

"""Drive real Mac Excel from pytest (SPEC-107). No GUI clicks, no security-pref changes.

Recipe (SPEC.md D-16): Excel on macOS shows a modal macro-enable prompt when a .xlsm is
opened through AppleScript, which nothing unattended can dismiss. Workbooks that Excel
opens itself at launch from its startup folder do not prompt. So the lane

  1. refuses to run if any Excel process exists (never touches the user's session),
  2. snapshots the startup folder, COPIES (never symlinks) the workbook under test into it,
  3. launches Excel (`open -a`), waits for the workbook to appear,
  4. drives it with `osascript` (`run VB macro`), every call under a hard timeout,
  5. in `stop()` (always, via fixture finalizer): closes the workbook without saving,
     quits Excel (SIGTERM, then SIGKILL, of the Excel WE launched), removes only the file
     it copied (+ its `~$` lock file) and asserts the folder equals the snapshot.
"""
import ast
import os
import shutil
import subprocess
import time
from pathlib import Path

STARTUP = (Path.home() / "Library/Group Containers/UBF8T346G9.Office/"
           "User Content.localized/Startup.localized/Excel")
EXCEL_APP = Path("/Applications/Microsoft Excel.app")
STAGED_NAME = "doomfire_acceptance.xlsm"  # unique; never collides with user files
SHEET = "Fire"
GRID_ADDR = "A4:BH43"  # FireGrid, 40 rows x 60 cols (SPEC-103)
OSA_TIMEOUT = 20
LAUNCH_TIMEOUT = 90


class ExcelError(RuntimeError):
    pass


def excel_pids():
    r = subprocess.run(["pgrep", "-x", "Microsoft Excel"], capture_output=True, text=True)
    return [int(p) for p in r.stdout.split()]


def snapshot():
    return sorted(os.listdir(STARTUP))


def osa(script, timeout=OSA_TIMEOUT):
    """Run AppleScript with a hard timeout; returns stdout (AppleScript `-s s` literal)."""
    try:
        r = subprocess.run(["osascript", "-s", "s", "-e", script],
                           capture_output=True, text=True, timeout=timeout)
    except subprocess.TimeoutExpired as e:
        raise ExcelError(f"osascript timed out after {timeout}s: {script[:120]}") from e
    if r.returncode != 0:
        raise ExcelError(f"osascript failed ({r.returncode}): {r.stderr.strip()} :: {script[:120]}")
    return r.stdout.strip()


def _tell(body, timeout=OSA_TIMEOUT):
    return osa(f'tell application "Microsoft Excel"\n{body}\nend tell', timeout)


def parse_list(text):
    """AppleScript `-s s` list literal -> python (lists/ints/floats/strings)."""
    return ast.literal_eval(text.replace("{", "[").replace("}", "]"))


class ExcelSession:
    def __init__(self, xlsm):
        self.xlsm = Path(xlsm)
        self.staged = STARTUP / STAGED_NAME
        self.before = None
        self.started = False

    # -------------------------------------------------------------- lifecycle
    def start(self):
        if not EXCEL_APP.exists():
            raise ExcelError("Microsoft Excel.app not installed")
        if excel_pids():
            raise ExcelError("Excel is already running: quit it first. The excel lane "
                             "needs a fresh launch (startup-folder load) and never "
                             "touches a user's Excel session.")
        if not STARTUP.is_dir():
            raise ExcelError(f"startup folder missing: {STARTUP}")
        self.before = snapshot()
        try:
            shutil.copy2(self.xlsm, self.staged)  # copy, never symlink
            self.started = True
            subprocess.run(["open", "-a", str(EXCEL_APP)], check=True, timeout=30)
            self._wait_for_workbook()
            _tell("set display alerts to false", 15)
        except BaseException:
            self.stop(check=False)
            raise

    def _wait_for_workbook(self):
        deadline = time.monotonic() + LAUNCH_TIMEOUT
        last = None
        while time.monotonic() < deadline:
            try:
                names = parse_list(_tell("get name of every workbook", 10))
                if isinstance(names, str):
                    names = [names]
                if STAGED_NAME in names:
                    return
                last = names
            except (ExcelError, SyntaxError, ValueError) as e:
                last = str(e)
            time.sleep(1.5)
        raise ExcelError(f"{STAGED_NAME} did not open from the startup folder in "
                         f"{LAUNCH_TIMEOUT}s (last: {last})")

    def stop(self, check=True):
        """Idempotent teardown; always leaves the startup folder as it found it."""
        if not self.started and self.before is None:
            return
        try:
            if excel_pids():
                try:
                    _tell(f'close workbook "{STAGED_NAME}" saving no', 10)
                except ExcelError:
                    pass
                try:
                    _tell("quit", 10)
                except ExcelError:
                    pass
                self._wait_exit(15)
                if excel_pids():
                    subprocess.run(["pkill", "-TERM", "-x", "Microsoft Excel"])
                    self._wait_exit(10)
                if excel_pids():
                    subprocess.run(["pkill", "-KILL", "-x", "Microsoft Excel"])
                    self._wait_exit(5)
        finally:
            for name in (STAGED_NAME, "~$" + STAGED_NAME):
                p = STARTUP / name
                if name not in (self.before or []) and p.exists():
                    p.unlink()
            self.started = False
            after = snapshot()
            before, self.before = self.before, None
            if check and after != before:
                raise ExcelError(f"startup folder not restored: before={before} after={after}")
            if check and excel_pids():
                raise ExcelError("Excel still running after teardown")

    @staticmethod
    def _wait_exit(seconds):
        end = time.monotonic() + seconds
        while time.monotonic() < end and excel_pids():
            time.sleep(0.5)

    # -------------------------------------------------------------- actions
    def run(self, macro, *args, timeout=60):
        """`run VB macro` on a public macro of the staged workbook."""
        a = "".join(f" arg{i + 1} {int(v)}" for i, v in enumerate(args))
        return _tell(f"run VB macro \"'{STAGED_NAME}'!{macro}\"{a}", timeout)

    def grid(self):
        """FireGrid as 40 lists of 60 ints (row 0 = top)."""
        out = _tell(f'get value of range "{GRID_ADDR}" of worksheet "{SHEET}" '
                    f'of workbook "{STAGED_NAME}"', 30)
        g = parse_list(out)
        if len(g) != 40 or any(len(r) != 60 for r in g):
            raise ExcelError(f"unexpected grid shape {len(g)}x{len(g[0]) if g else 0}")
        return [[int(v) for v in row] for row in g]

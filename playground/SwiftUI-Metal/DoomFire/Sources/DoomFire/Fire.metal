//
//  Fire.metal
//  DoomFire
//
//  Created by Andrew Althage on 10/9/26.
//

#include <metal_stdlib>
using namespace metal;

// Must match FireSettings in FireRenderer.swift field-for-field (order and types).
struct FireSettings {
    int  wind;      // -1 left, 0 straight up, 1 right
    uint maxDecay;  // per-row decay is random in 0...maxDecay (original: 2)
    uint source;    // bottom-row intensity, 0...36 (0 = extinguished)
};

// PCG hash — cheap, stateless per-pixel randomness.
static uint pcg(uint v) {
    uint state = v * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

kernel void propagate(texture2d<uint, access::read>  src   [[texture(0)]],
                      texture2d<uint, access::write> dst   [[texture(1)]],
                      constant FireSettings&         s     [[buffer(0)]],
                      constant uint&                 frame [[buffer(1)]],
                      uint2                          gid   [[thread_position_in_grid]])
{
    uint w = dst.get_width(), h = dst.get_height();
    if (gid.x >= w || gid.y >= h) return;

    if (gid.y == h - 1) {                       // fire source row
        dst.write(uint4(s.source), gid);
        return;
    }

    uint decay = pcg(gid.x ^ pcg(gid.y ^ pcg(frame))) % (s.maxDecay + 1);
    uint sx = uint(int(gid.x) - int(decay) * s.wind + int(w)) % w;   // wrap horizontally
    uint below = src.read(uint2(sx, gid.y + 1)).r;
    dst.write(uint4(below > decay ? below - decay : 0), gid);
}

struct VOut { float4 position [[position]]; float2 uv; };

// One oversized triangle covers the screen; no vertex buffer needed.
vertex VOut fullscreen(uint vid [[vertex_id]]) {
    float2 uv = float2((vid << 1) & 2, vid & 2);
    return { float4(uv * float2(2, -2) + float2(-1, 1), 0, 1), uv };
}

constant uchar3 palette[37] = {
    {7,7,7},{31,7,7},{47,15,7},{71,15,7},{87,23,7},{103,31,7},{119,31,7},{143,39,7},
    {159,47,7},{175,63,7},{191,71,7},{199,71,7},{223,79,7},{223,87,7},{223,87,7},
    {215,95,7},{215,95,7},{215,103,15},{207,111,15},{207,119,15},{207,127,15},
    {207,135,23},{199,135,23},{199,143,23},{199,151,31},{191,159,31},{191,159,31},
    {191,167,39},{191,167,39},{191,175,47},{183,175,47},{183,183,47},{183,183,55},
    {207,207,111},{223,223,159},{239,239,199},{255,255,255}
};

fragment half4 colorize(VOut in [[stage_in]], texture2d<uint> fire [[texture(0)]]) {
    uint2 size = uint2(fire.get_width(), fire.get_height());
    uint2 p = min(uint2(in.uv * float2(size)), size - 1);   // nearest-neighbor = chunky pixels
    uint i = min(fire.read(p).r, 36u);
    return half4(half3(palette[i]) / 255.0h, 1);
}

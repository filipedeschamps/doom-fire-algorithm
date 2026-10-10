# Doom Fire in SwiftUI + Metal

The Doom fire effect running on the GPU with Metal, wrapped in a small SwiftUI app for macOS and iOS.

The fire itself lives in a local Swift package called `DoomFire` (in the `DoomFire/` folder). The app in `SwiftUI-Metal/` just puts the fire on screen and adds a few controls on top. If you want the fire in your own SwiftUI view, it's one line:

```swift
import DoomFire

FireView(settings: FireSettings(wind: 0, maxDecay: 3, source: 36))
```

## How it works

It's the same algorithm as the original JavaScript version, moved onto the GPU. Every frame, a Metal compute shader (`propagate` in `Fire.metal`) works out the next frame of fire. The fire values (0 to 36) are kept in two textures. Each frame reads from one and writes to the other, then they swap.

There's one change from the original. In JavaScript, each pixel pushes its value up to a randomly shifted spot in the row above. That's fine on the CPU, but on the GPU thousands of threads run at once and two of them could write to the same pixel. So here it's flipped: each pixel pulls its value from a randomly shifted spot in the row below. It looks the same, and every pixel only gets written once.

GPUs don't have `Math.random()`, so the randomness comes from a small hash function fed the pixel's position and the frame number. To draw, a fragment shader turns each fire value into a color from the original 37-color palette. It doesn't blend between pixels, so you get the chunky look. Each fire pixel is 4×4 points, and the grid resizes with the window.

## Controls

- **Wind:** make the flames lean left or right, or rise straight up.
- **Decay:** higher numbers burn out faster, so the flames are shorter.
- **Fire:** turn the fire down to 0 to put it out, or back up to 36 to relight it.

## Running it

Open `SwiftUI-Metal.xcodeproj` in Xcode and run it on your Mac, an iPhone or iPad, or a simulator. You can also build the package by itself by running `swift build` inside `DoomFire/`.

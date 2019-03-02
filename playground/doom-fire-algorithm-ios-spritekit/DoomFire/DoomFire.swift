//
//  DoomFire.swift
//  DoomFire
//
//  Created by Murilo Paixão on 31/01/19.
//  Copyright © 2019 Murilo Paixão. All rights reserved.
//

import Foundation
import CoreGraphics

class DoomFire {
  typealias Pixel = (position: CGPoint, intensity: Int)

  let width: Int
  let height: Int

  var size: Int {
    return width * height
  }

  var pixels: [Pixel] = []

  init(width: Int, height: Int) {
    self.width = width
    self.height = height

    for i in 0..<width {
      let pixel = (
        position: CGPoint(x: i % width, y: i / width),
        intensity: 36)

      pixels.append(pixel)
    }

    for i in width..<size {
      let pixel = (
        position: CGPoint(x: i % width, y: i / width),
        intensity: 0)

      pixels.append(pixel)
    }
  }

  func propagate() {
    (0..<width).reversed().forEach { column in
      (0..<height).reversed().forEach { row in
        let pixelIndex = column + (row * width)
        updateFireIntensity(atIndex: pixelIndex)
      }
    }
  }

  private func updateFireIntensity(atIndex pixelIndex: Int) {
    let belowPixelIndex = pixelIndex - width

    guard belowPixelIndex < size && belowPixelIndex > 0 else {
      return
    }

    let decay = Int(arc4random_uniform(2))
    let belowPixelFireIntensity = pixels[belowPixelIndex].intensity

    let newFireIntensity =
      belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0

    pixels[pixelIndex - decay].intensity = newFireIntensity
  }
}

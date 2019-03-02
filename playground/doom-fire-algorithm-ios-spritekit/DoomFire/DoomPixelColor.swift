//
//  DoomPixelColor.swift
//  DoomFire
//
//  Created by Murilo Paixão on 31/01/19.
//  Copyright © 2019 Murilo Paixão. All rights reserved.
//

import UIKit

struct DoomPixelColor {
  static let rgbas: [(red: CGFloat, green: CGFloat, blue: CGFloat, alpha: CGFloat)] = [
    (red: 7   / 255.0, green: 7   / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 31  / 255.0, green: 7   / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 47  / 255.0, green: 15  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 71  / 255.0, green: 15  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 87  / 255.0, green: 23  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 103 / 255.0, green: 31  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 119 / 255.0, green: 31  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 143 / 255.0, green: 39  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 159 / 255.0, green: 47  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 175 / 255.0, green: 63  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 191 / 255.0, green: 71  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 199 / 255.0, green: 71  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 223 / 255.0, green: 79  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 223 / 255.0, green: 87  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 223 / 255.0, green: 87  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 215 / 255.0, green: 95  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 215 / 255.0, green: 95  / 255.0, blue: 7   / 255.0, alpha: 1),
    (red: 215 / 255.0, green: 103 / 255.0, blue: 15  / 255.0, alpha: 1),
    (red: 207 / 255.0, green: 111 / 255.0, blue: 15  / 255.0, alpha: 1),
    (red: 207 / 255.0, green: 119 / 255.0, blue: 15  / 255.0, alpha: 1),
    (red: 207 / 255.0, green: 127 / 255.0, blue: 15  / 255.0, alpha: 1),
    (red: 207 / 255.0, green: 135 / 255.0, blue: 23  / 255.0, alpha: 1),
    (red: 199 / 255.0, green: 135 / 255.0, blue: 23  / 255.0, alpha: 1),
    (red: 199 / 255.0, green: 143 / 255.0, blue: 23  / 255.0, alpha: 1),
    (red: 199 / 255.0, green: 151 / 255.0, blue: 31  / 255.0, alpha: 1),
    (red: 191 / 255.0, green: 159 / 255.0, blue: 31  / 255.0, alpha: 1),
    (red: 191 / 255.0, green: 159 / 255.0, blue: 31  / 255.0, alpha: 1),
    (red: 191 / 255.0, green: 167 / 255.0, blue: 39  / 255.0, alpha: 1),
    (red: 191 / 255.0, green: 167 / 255.0, blue: 39  / 255.0, alpha: 1),
    (red: 191 / 255.0, green: 175 / 255.0, blue: 47  / 255.0, alpha: 1),
    (red: 183 / 255.0, green: 175 / 255.0, blue: 47  / 255.0, alpha: 1),
    (red: 183 / 255.0, green: 183 / 255.0, blue: 47  / 255.0, alpha: 1),
    (red: 183 / 255.0, green: 183 / 255.0, blue: 55  / 255.0, alpha: 1),
    (red: 207 / 255.0, green: 207 / 255.0, blue: 111 / 255.0, alpha: 1),
    (red: 223 / 255.0, green: 223 / 255.0, blue: 159 / 255.0, alpha: 1),
    (red: 239 / 255.0, green: 239 / 255.0, blue: 199 / 255.0, alpha: 1),
    (red: 255 / 255.0, green: 255 / 255.0, blue: 255 / 255.0, alpha: 1)
  ]

  static func pixelColor(forIntensity intensity: Int) -> UIColor {
    let rgba = rgbas[intensity]
    return UIColor(red: rgba.red, green: rgba.green, blue: rgba.blue, alpha: rgba.alpha)
  }
}

//
//  ColorValue.swift
//  DoomFire
//
//  Created by Adriano Rodrigues Vieira on 10/04/21.
//

import Foundation

struct ColorValue: Codable {
    let r: Int
    let g: Int
    let b: Int
    
    var doubleRed: Double {
        get {
            return Double(r) / 255.0
        }
    }
    
    var doubleGreen: Double {
        get {
            return Double(g) / 255.0
        }
    }
    
    var doubleBlue: Double {
        get {
            return Double(g) / 255.0
        }
    }
}

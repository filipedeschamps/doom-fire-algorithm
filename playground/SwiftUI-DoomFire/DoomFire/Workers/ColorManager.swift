//
//  ColorManager.swift
//  DoomFire
//
//  Created by Adriano Rodrigues Vieira on 09/04/21.
//

import SwiftUI


struct ColorManager {
    private var colors: [Color] = []
    
    init() {
        let jsonColors: [ColorValue] = Bundle.main.decode("colors.json")
        
        for jsonColor in jsonColors {
            let color = Color(red: jsonColor.doubleRed,
                              green: jsonColor.doubleGreen,
                              blue: jsonColor.doubleBlue)
            
            self.colors.append(color)
        }
    }
    
    func getColor(ofIndex index: Int) -> Color {
        if index > colors.count {
            fatalError("There is no color with index \(index)")
        }
        return colors[index]
    }

    func getRandomColor() -> Color {
        return colors.randomElement() ?? Color(UIColor.magenta)
    }
}




//
//  FireLogic.swift
//  DoomFire
//
//  Created by Adriano Rodrigues Vieira on 09/04/21.
//

import SwiftUI

class FireLogic: ObservableObject {    
    @Published var fireColors: [Color] = []
    
    private var firePixelArray: [Int] = []
    private let fireWidth: Int
    private let fireHeight: Int
    private let colorManager = ColorManager()

    init(width: Int, height: Int) {
        self.fireWidth = width
        self.fireHeight = height
        
        for _ in 0..<(fireWidth * fireHeight) {
            fireColors.append(Color.black)
        }
        
        createFireDataStructure() 
        createFireSource()
        
        Timer.scheduledTimer(withTimeInterval: 0.0001, repeats: true) { _ in
            self.calculateFirePropagation()
        }
    }

    private func createFireDataStructure() {
        for index in 0..<fireWidth * fireHeight {
            firePixelArray.insert(0, at: index)
        }
    }

    private func createFireSource() {
        for column in 0..<fireWidth {
            let overflowPixelIndex = fireWidth * fireHeight
            let pixelIndex = (overflowPixelIndex - fireWidth) + column
                                
            firePixelArray[pixelIndex] = 36
        }
    }

    private func calculateFirePropagation() {
        for column in 0..<fireWidth {
            for row in 0..<fireHeight {
                let pixelIndex = column + (fireWidth * row)
                
                updateFireIntensityPerPixel(currentPixelIndex: pixelIndex)
            }
        }
    }

    private func updateFireIntensityPerPixel(currentPixelIndex: Int) {
        let belowPixelIndex = currentPixelIndex + fireWidth
        
        if belowPixelIndex >= fireWidth * fireHeight {
            return
        }
        
        let decay = Int.random(in: 0...2)
        let belowPixelFireIntensity = firePixelArray[belowPixelIndex]
            
        let newFireIntensity = belowPixelFireIntensity - decay >= 0 ? (belowPixelFireIntensity - decay) : 0
                    
        firePixelArray[currentPixelIndex] = newFireIntensity
        fireColors[currentPixelIndex] = colorManager.getColor(ofIndex: newFireIntensity)
    }
}

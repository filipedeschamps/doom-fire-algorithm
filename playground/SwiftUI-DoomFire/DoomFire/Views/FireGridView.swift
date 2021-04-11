//
//  GridExample.swift
//  DoomFire
//
//  Created by Adriano Rodrigues Vieira on 10/04/21.
//

import SwiftUI

struct FireGridView: View {
    @ObservedObject var fireLogic: FireLogic
    
    let width: Int
    let height: Int
    
    
    init(width: Int, height: Int) {
        self.width = width
        self.height = height
        fireLogic = FireLogic(width: width, height: height)
    }
    
    var layout: [GridItem] {
        var tempLayouts = [GridItem]()
        for _ in 0..<width {
            tempLayouts.append(GridItem(.adaptive(minimum: 0)))
        }
        return tempLayouts
    }
    
    var body: some View {
        ScrollView(showsIndicators: false) {
            LazyVGrid(columns: layout, spacing: 0) {
                ForEach(0..<width * height) { index in
                    Rectangle()
                        .frame(width: 10, height: 10, alignment: .center)
                        .foregroundColor(fireLogic.fireColors[index])                        
                }
            }.drawingGroup()
        }
    }
}

struct FireGridView_Previews: PreviewProvider {
    static var previews: some View {
        FireGridView(width: 50, height: 50)
    }
}

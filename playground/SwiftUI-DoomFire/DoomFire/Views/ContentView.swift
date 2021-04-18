//
//  ContentView.swift
//  DoomFire
//
//  Created by Adriano Rodrigues Vieira on 08/04/21.
//

import SwiftUI

struct ContentView: View {
    let width = 50
    let height = 50
    
    var body: some View {
        ZStack {
            Color.black
                .ignoresSafeArea()
            VStack {
                Image("color-doom-logo")
                    .resizable()
                    .frame(height: 180)
                    .padding()                    
                
                FireGridView(width: width, height: height)
            }
        }
                
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

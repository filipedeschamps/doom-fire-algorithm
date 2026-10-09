//
//  ContentView.swift
//  SwiftUI-Metal
//
//  Created by Andrew Althage on 10/9/26.
//

import DoomFire
import SwiftUI

struct ContentView: View {
    @State private var settings = FireSettings()

    var body: some View {
        FireView(settings: settings)
            .ignoresSafeArea()
            .overlay(alignment: .bottom) {
                HStack {
                    Picker("Wind", selection: $settings.wind) {
                        Text("←").tag(Int32(-1))
                        Text("↑").tag(Int32(0))
                        Text("→").tag(Int32(1))
                    }
                    .pickerStyle(.segmented)
                    .fixedSize()
                    Stepper("Decay \(settings.maxDecay)", value: $settings.maxDecay, in: 1...6)
                    Slider(value: Binding(
                        get: { Double(settings.source) },
                        set: { settings.source = UInt32($0) }),
                           in: 0...36, step: 1) {
                        Text("Fire")
                    } minimumValueLabel: {
                        Image(systemName: "flame")
                    } maximumValueLabel: {
                        Image(systemName: "flame.fill")
                    }
                    .frame(minWidth: 160)
                }
                .padding()
                .glassEffect()
                .padding()
            }
    }
}

#Preview {
    ContentView()
}

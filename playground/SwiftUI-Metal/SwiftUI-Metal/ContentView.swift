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
            .overlay(alignment: .top) {
                ViewThatFits(in: .horizontal) {
                    HStack {
                        wind
                        decay
                        fire
                    }
                    .padding()
                    .glassEffect()

                    VStack(spacing: 12) {
                        HStack {
                            wind
                            Spacer()
                            decay
                        }
                        fire
                    }
                    .padding()
                    .glassEffect(.regular, in: .rect(cornerRadius: 24))
                }
                .padding()
            }
    }

    private var wind: some View {
        Picker("Wind", selection: $settings.wind) {
            Text("←").tag(Int32(-1))
            Text("↑").tag(Int32(0))
            Text("→").tag(Int32(1))
        }
        .pickerStyle(.segmented)
        .fixedSize()
    }

    private var decay: some View {
        Stepper("Decay \(settings.maxDecay)", value: $settings.maxDecay, in: 1...6)
            .fixedSize()
    }

    private var fire: some View {
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
}

#Preview {
    ContentView()
}

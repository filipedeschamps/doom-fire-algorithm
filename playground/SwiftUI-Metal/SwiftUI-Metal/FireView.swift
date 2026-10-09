//
//  FireView.swift
//  SwiftUI-Metal
//
//  Created by Andrew Althage on 10/9/26.
//
import SwiftUI
import MetalKit

#if os(macOS)
typealias PlatformViewRepresentable = NSViewRepresentable
#else
typealias PlatformViewRepresentable = UIViewRepresentable
#endif

struct FireView: PlatformViewRepresentable {
    var settings: FireSettings
    
    func makeCoordinator() -> FireRenderer { FireRenderer() }

    private func makeView(context: Context) -> MTKView {
        let view = MTKView(frame: .zero, device: context.coordinator.device)
        view.colorPixelFormat = .bgra8Unorm
        view.preferredFramesPerSecond = 30   // sim speed is tied to frame rate
        view.delegate = context.coordinator
        return view
    }

    #if os(macOS)
    func makeNSView(context: Context) -> MTKView { makeView(context: context) }
    func updateNSView(_ view: MTKView, context: Context) { context.coordinator.settings = settings }
    #else
    func makeUIView(context: Context) -> MTKView { makeView(context: context) }
    func updateUIView(_ view: MTKView, context: Context) { context.coordinator.settings = settings }
    #endif
}

//
//  FireView.swift
//  DoomFire
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

/// A Metal-backed view that runs the Doom fire simulation on the GPU.
public struct FireView: PlatformViewRepresentable {
    public var settings: FireSettings

    public init(settings: FireSettings = FireSettings()) {
        self.settings = settings
    }

    public func makeCoordinator() -> FireRenderer { FireRenderer() }

    private func makeView(context: Context) -> MTKView {
        let view = MTKView(frame: .zero, device: context.coordinator.device)
        view.colorPixelFormat = .bgra8Unorm
        view.preferredFramesPerSecond = 30   // sim speed is tied to frame rate
        view.delegate = context.coordinator
        return view
    }

    #if os(macOS)
    public func makeNSView(context: Context) -> MTKView { makeView(context: context) }
    public func updateNSView(_ view: MTKView, context: Context) { context.coordinator.settings = settings }
    #else
    public func makeUIView(context: Context) -> MTKView { makeView(context: context) }
    public func updateUIView(_ view: MTKView, context: Context) { context.coordinator.settings = settings }
    #endif
}

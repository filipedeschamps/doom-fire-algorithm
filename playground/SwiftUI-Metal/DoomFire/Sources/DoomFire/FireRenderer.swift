//
//  FireRenderer.swift
//  DoomFire
//
//  Created by Andrew Althage on 10/9/26.
//

import MetalKit

/// Mirrors `FireSettings` in Fire.metal — keep field order and types in sync.
public struct FireSettings: Equatable, Sendable {
    public var wind: Int32 = -1        // -1 left (like the original), 0 straight up, 1 right
    public var maxDecay: UInt32 = 2    // higher = shorter flames
    public var source: UInt32 = 36     // fire source intensity, 0 (extinguished)...36

    public init(wind: Int32 = -1, maxDecay: UInt32 = 2, source: UInt32 = 36) {
        self.wind = wind
        self.maxDecay = maxDecay
        self.source = source
    }
}

/// Drives the simulation; public only because it is `FireView`'s coordinator.
@MainActor
public final class FireRenderer: NSObject, MTKViewDelegate {
    var settings = FireSettings()
    var pixelSize: CGFloat = 4

    let device: MTLDevice
    private let queue: MTLCommandQueue
    private let propagate: MTLComputePipelineState
    private let colorize: MTLRenderPipelineState
    private var textures: [MTLTexture] = []
    private var current = 0
    private var frame: UInt32 = 0

    override init() {
        // Demo code: a device without Metal or a missing shader is a programmer error.
        device = MTLCreateSystemDefaultDevice()!
        queue = device.makeCommandQueue()!
        let library = try! device.makeDefaultLibrary(bundle: .module)

        propagate = try! device.makeComputePipelineState(function: library.makeFunction(name: "propagate")!)

        let desc = MTLRenderPipelineDescriptor()
        desc.vertexFunction = library.makeFunction(name: "fullscreen")
        desc.fragmentFunction = library.makeFunction(name: "colorize")
        desc.colorAttachments[0].pixelFormat = .bgra8Unorm   // must match MTKView.colorPixelFormat
        colorize = try! device.makeRenderPipelineState(descriptor: desc)
        super.init()
    }

    public func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {
        let width = max(Int(size.width / pixelSize), 1)
        let height = max(Int(size.height / pixelSize), 1)
        let desc = MTLTextureDescriptor.texture2DDescriptor(
            pixelFormat: .r8Uint, width: width, height: height, mipmapped: false)
        desc.usage = [.shaderRead, .shaderWrite, .renderTarget]
        desc.storageMode = .private
        textures = (0..<2).map { _ in device.makeTexture(descriptor: desc)! }

        // New textures aren't guaranteed to be zeroed; clear them with empty render passes.
        let cmd = queue.makeCommandBuffer()!
        for texture in textures {
            let pass = MTLRenderPassDescriptor()
            pass.colorAttachments[0].texture = texture
            pass.colorAttachments[0].loadAction = .clear
            pass.colorAttachments[0].storeAction = .store
            pass.colorAttachments[0].clearColor = MTLClearColor()
            cmd.makeRenderCommandEncoder(descriptor: pass)!.endEncoding()
        }
        cmd.commit()
    }

    public func draw(in view: MTKView) {
        guard textures.count == 2,
              let drawable = view.currentDrawable,
              let pass = view.currentRenderPassDescriptor,
              let cmd = queue.makeCommandBuffer() else { return }

        let src = textures[current], dst = textures[1 - current]
        frame &+= 1

        let compute = cmd.makeComputeCommandEncoder()!
        compute.setComputePipelineState(propagate)
        compute.setTexture(src, index: 0)
        compute.setTexture(dst, index: 1)
        compute.setBytes(&settings, length: MemoryLayout<FireSettings>.stride, index: 0)
        compute.setBytes(&frame, length: MemoryLayout<UInt32>.stride, index: 1)
        compute.dispatchThreads(MTLSize(width: dst.width, height: dst.height, depth: 1),
                                threadsPerThreadgroup: MTLSize(width: 16, height: 16, depth: 1))
        compute.endEncoding()
        
        let render = cmd.makeRenderCommandEncoder(descriptor: pass)!
        render.setRenderPipelineState(colorize)
        render.setFragmentTexture(dst, index: 0)
        render.drawPrimitives(type: .triangle, vertexStart: 0, vertexCount: 3)
        render.endEncoding()

        cmd.present(drawable)
        cmd.commit()
        current = 1 - current
    }
}

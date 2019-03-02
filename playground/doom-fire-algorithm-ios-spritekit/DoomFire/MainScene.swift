//
//  MainScene.swift
//  DoomFire
//
//  Created by Murilo Paixão on 31/01/19.
//  Copyright © 2019 Murilo Paixão. All rights reserved.
//

import SpriteKit

class MainScene: SKScene {
  var doomFire: DoomFire!
  var nodes: [SKShapeNode]!

  let nodeSize = 7

  override func didMove(to view: SKView) {
    super.didMove(to: view)

    doomFire = DoomFire(
      width: Int(view.frame.width) / nodeSize + (nodeSize / 2),
      height: Int(view.frame.height) / nodeSize + (nodeSize / 2))

    nodes = doomFire.pixels.map { pixel in
      let node = self.makeNode(fromPixel: pixel)
      self.addChild(node)

      return node
    }

    let propagateFire = SKAction.run {
      self.doomFire.propagate()

      self.nodes.enumerated().forEach { index, node in
        node.fillColor = DoomPixelColor.pixelColor(
          forIntensity: self.doomFire.pixels[index].intensity)
      }
    }

    let propagateFireWithDelay = SKAction.sequence([
      propagateFire,
      SKAction.wait(forDuration: 0.1)
    ])

    run(SKAction.repeatForever(propagateFireWithDelay))
  }

  private func makeNode(fromPixel pixel: DoomFire.Pixel) -> SKShapeNode {
    let node = SKShapeNode(rectOf: CGSize(width: nodeSize, height: nodeSize))
    node.strokeColor = .clear
    node.fillColor = DoomPixelColor.pixelColor(forIntensity: pixel.intensity)
    node.position = CGPoint(
      x: Int(pixel.position.x) * nodeSize + (nodeSize / 2),
      y: Int(pixel.position.y) * nodeSize + (nodeSize / 2))
    return node
  }
}

//
//  ViewController.swift
//  DoomFire
//
//  Created by Murilo Paixão on 31/01/19.
//  Copyright © 2019 Murilo Paixão. All rights reserved.
//

import UIKit
import SpriteKit

class ViewController: UIViewController {

  override func viewDidLoad() {
    super.viewDidLoad()

    let skView = SKView(frame: view.bounds)
    skView.showsFPS = true
    skView.showsNodeCount = true

    view.addSubview(skView)

    let scene = MainScene(size: skView.frame.size)
    skView.presentScene(scene)
  }
}

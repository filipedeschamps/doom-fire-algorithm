// swift-tools-version: 6.4
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "DoomFire",
    platforms: [
        .macOS(.v26),
        .iOS(.v26),
    ],
    products: [
        .library(
            name: "DoomFire",
            targets: ["DoomFire"]
        ),
    ],
    targets: [
        .target(
            name: "DoomFire",
            // SwiftPM compiles .metal resources into default.metallib inside Bundle.module.
            resources: [.process("Fire.metal")],
            swiftSettings: [
                .enableUpcomingFeature("ApproachableConcurrency"),
            ],
        ),
    ]
)

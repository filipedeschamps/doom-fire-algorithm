//
//  Extensions.swift
//  DoomFire
//
//  Created by Adriano Rodrigues Vieira on 10/04/21.
//

import Foundation

extension Bundle {
    func decode<T: Codable>(_ filename: String) -> T {
        guard let url = self.url(forResource: filename, withExtension: nil) else {
            fatalError("Failed to locate \(filename) in bundle.")
        }
        
        guard let data = try? Data(contentsOf: url) else {
            fatalError("Failed to load file \(filename) from bundle.")
        }
        
        let decoder = JSONDecoder()
        let formatter = DateFormatter()
        formatter.dateFormat = "y-MM-dd"
        decoder.dateDecodingStrategy = .formatted(formatter)
        
        guard let loaded = try? decoder.decode(T.self, from: data) else {
            fatalError("Failed to decode \(filename) from bundle.")
        }
        
        return loaded
    }
}

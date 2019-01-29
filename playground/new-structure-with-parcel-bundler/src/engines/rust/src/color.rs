
pub struct Color {
    r: u32,
    g: u32,
    b: u32,
}

pub fn get_color(index: usize) -> String {
    let fireColorsPalette: Vec<Color> = vec![
        Color { r: 7, g: 7, b: 7 },
        Color { r: 31, g: 7, b: 7 },
        Color { r: 47, g: 15, b: 7 },
        Color { r: 71, g: 15, b: 7 },
        Color { r: 87, g: 23, b: 7 },
        Color { r: 103, g: 31, b: 7 },
        Color { r: 119, g: 31, b: 7 },
        Color { r: 143, g: 39, b: 7 },
        Color { r: 159, g: 47, b: 7 },
        Color { r: 175, g: 63, b: 7 },
        Color { r: 191, g: 71, b: 7 },
        Color { r: 199, g: 71, b: 7 },
        Color { r: 223, g: 79, b: 7 },
        Color { r: 223, g: 87, b: 7 },
        Color { r: 223, g: 87, b: 7 },
        Color { r: 215, g: 95, b: 7 },
        Color { r: 215, g: 95, b: 7 },
        Color { r: 215, g: 103, b: 15 },
        Color { r: 207, g: 111, b: 15 },
        Color { r: 207, g: 119, b: 15 },
        Color { r: 207, g: 127, b: 15 },
        Color { r: 207, g: 135, b: 23 },
        Color { r: 199, g: 135, b: 23 },
        Color { r: 199, g: 143, b: 23 },
        Color { r: 199, g: 151, b: 31 },
        Color { r: 191, g: 159, b: 31 },
        Color { r: 191, g: 159, b: 31 },
        Color { r: 191, g: 167, b: 39 },
        Color { r: 191, g: 167, b: 39 },
        Color { r: 191, g: 175, b: 47 },
        Color { r: 183, g: 175, b: 47 },
        Color { r: 183, g: 183, b: 47 },
        Color { r: 183, g: 183, b: 55 },
        Color { r: 207, g: 207, b: 111 },
        Color { r: 223, g: 223, b: 159 },
        Color { r: 239, g: 239, b: 199 },
        Color { r: 255, g: 255, b: 255 },
    ];
    return format!(
        "{}, {}, {}",
        fireColorsPalette[index].r,
        fireColorsPalette[index].g,
        fireColorsPalette[index].b
    );
}

extern crate termion;

pub struct State {
    pub width: u16,
    pub height: u16,
    pub number_of_pixels: u16,
    pub fire_pixels_vec: Vec<u16>,
}

impl State {
    pub fn new() -> State {
        let (mut width, mut height): (u16, u16) = termion::terminal_size().unwrap();

        width -= 1;
        height -= 1;

        let number_of_pixels = width * height;

        State {
            width,
            height,
            number_of_pixels,
            fire_pixels_vec: vec![0; number_of_pixels as usize],
        }
    }

    pub fn change_pixel_intensity(&mut self, index: usize, intensity: u16) {
        self.fire_pixels_vec[index] = intensity;
    }
}

extern crate termion;

mod palette;
mod state;
mod utils;

use crate::state::State;
use math::round;
use rand::{thread_rng, Rng};
use std::io::{Write, Read, stdout};
use termion::{async_stdin};
use termion::raw::IntoRawMode;

fn create_fire_source(state: &mut State) {
    for column in 0..state.width {
        let pixel_index = column + state.number_of_pixels - state.width;
        let intensity = 36;

        state.change_pixel_intensity(pixel_index as usize, intensity);
    }
}

fn render_fire(state: &mut State) {
    let mut stdout = stdout().into_raw_mode().unwrap();

    for row in 0..state.height {
        for column in 0..state.width {
            let pixel_index = column + (state.width * row);

            let pixel_intensity_index = state.fire_pixels_vec[pixel_index as usize];

            writeln!(
                stdout,
                "{}{}{} ",
                termion::cursor::Goto(column+1, row+1),
                termion::cursor::Hide,
                palette::get_bg_color(pixel_intensity_index as usize)
            ).unwrap();
        }
    }
}

fn generate_decay() -> u16 {
    let mut rng = thread_rng();
    let random_number: f64 = rng.gen();

    let decay = round::floor(random_number * 3.0, 0) as u16;

    return decay;
}

fn calculate_new_intensity(below_intensity: u16, decay: u16) -> u16 {
    let new_intensity = below_intensity as i16 - decay as i16;

    if new_intensity >= 0 {
        return new_intensity as u16;
    }

    return 0;
}

fn calculate_pixel_decay_index(current_pixel: u16, decay: u16) -> u16 {
    let new_intensity = current_pixel as i16 - decay as i16;

    if new_intensity >= 0 {
        return new_intensity as u16;
    }

    return 0;
}

fn update_fire_intensity_per_pixel(current_pixel: u16, state: &mut State) {
    let below_pixel_index = current_pixel + state.width;

    if below_pixel_index >= state.width * state.height {
        return;
    }

    let decay = generate_decay();
    let below_pixel_intensity = state.fire_pixels_vec[below_pixel_index as usize];

    let pixel_decay_index = calculate_pixel_decay_index(current_pixel, decay);
    let new_intensity = calculate_new_intensity(below_pixel_intensity, decay); 

    state.change_pixel_intensity(pixel_decay_index as usize, new_intensity);
}

fn calculate_fire_propagation(state: &mut State) {
    for column in 0..state.width {
        for row in 0..state.height {
            let pixel_index = column + (state.width * row);

            update_fire_intensity_per_pixel(pixel_index, state);
        }
    }
}

fn main() {
    let mut stdin = async_stdin().bytes();
    let mut stdout = stdout().into_raw_mode().unwrap();

    writeln!(
        stdout,
        "{}{}press q to exit",
        termion::clear::All,
        termion::cursor::Goto(1, 1)
    ).unwrap();

    stdout.flush().unwrap();

    let mut state = State::new(); 

    create_fire_source(&mut state);
    render_fire(&mut state);

    loop {
        let key = stdin.next();

        if let Some(Ok(b'q')) = key {
            break;
        }

        utils::wait(50);

        calculate_fire_propagation(&mut state);
        render_fire(&mut state);
    }

    writeln!(
        stdout,
        "{}{}{}",
        termion::clear::All,
        termion::cursor::Goto(1, 1),
        termion::cursor::Show
    ).unwrap();
}

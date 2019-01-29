// Macroed crates
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate lazy_static;

// Regular crates
extern crate wasm_bindgen;

// Namespace definition
use wasm_bindgen::prelude::*;
use std::sync::Mutex;
use std::iter::FromIterator;

// Local modules
mod color;

// console.log polyfill
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
    #[wasm_bindgen(js_namespace = Math)]
    fn floor(a: f32) -> u32;
    #[wasm_bindgen(js_namespace = Math)]
    fn random() -> f32;
}

// Strucs
#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub firePixelsArray: Vec<u32>,
    pub fireWidth: u32,
    pub fireHeight: u32,
    pub debug: bool,
    pub renderTargetId: String,
}

// Initial states
lazy_static! {
    static ref CONFIG: Mutex<Config> = Mutex::new(Config {
        firePixelsArray: vec![],
        fireWidth: 0,
        fireHeight: 0,
        debug: false,
        renderTargetId: "".to_string(),
    });
}

// Methods
#[wasm_bindgen]
pub fn main(config: &JsValue) -> Vec<u32> {
    create_state(config.into_serde().unwrap());
    calculate_fire_propagation();
    let CONFIG_STATE = CONFIG.lock().unwrap();
    return Vec::from_iter(CONFIG_STATE.firePixelsArray.iter().cloned());
}

pub fn create_state(config: Config) {
    let mut CONFIG_REF = CONFIG.lock().unwrap();
    CONFIG_REF.fireWidth = config.fireWidth;
    CONFIG_REF.fireHeight = config.fireHeight;
    CONFIG_REF.debug = config.debug;
    if CONFIG_REF.firePixelsArray.len() as u32 != config.fireWidth * config.fireHeight {
        log(&"Created a new data structure".to_string());
        CONFIG_REF.firePixelsArray = create_fire_data_structure(config.fireWidth, config.fireHeight);
    }
}

#[wasm_bindgen]
pub fn render_fire_html() {
    let mut CONFIG_STATE = CONFIG.lock().unwrap();

    let mut html = "<table cellpadding=0 cellspacing=0>".to_string();
    for row in 0..CONFIG_STATE.fireHeight {
        html = format!("{}{}", html, "<tr>");
        for column in 0..CONFIG_STATE.fireWidth {
            let pixel_index = column + (CONFIG_STATE.fireWidth * row);
            let pixel_intensity_index = CONFIG_STATE.firePixelsArray[pixel_index as usize];
            if CONFIG_STATE.debug == true {
                html = format!("{}{}{}{}", html, "<td><div>", pixel_intensity_index, "</div></td>");
            } else {
                let current_color_string = color::get_color(pixel_intensity_index as usize);
                html = format!(
                    "{}{}{}{}",
                    html,
                    "<td class='pixel' style='background-color: rgb(",
                    current_color_string,
                    ")'></td>"
                )
            }
        }
        html = format!("{}{}", html, "</tr>");
    }

    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    document
        .get_element_by_id("fireCanvas")
        .expect("should have the desired div")
        .set_inner_html(&html);
}


pub fn create_fire_data_structure (width: u32, height: u32) -> Vec<u32> {
    let len =  width * height;
    let mut pixels = vec![0; len as usize];
    let overflow_pixel_index = (width * height) - width;
    for column in 0..width {
        let pixel_index = overflow_pixel_index + column;
        pixels[pixel_index as usize] = 36;
    }
    return pixels;
}

fn generate_decay() -> u32 {
    return floor(random() * 3.0);
}

pub fn calculate_fire_propagation () {
    let mut CONFIG_STATE = CONFIG.lock().unwrap();
    let width = CONFIG_STATE.fireWidth;
    let height = CONFIG_STATE.fireHeight;
    let area = width * height;
    for column in 0..width {
        for row in 0..height {
            let pixel_index = column + (width * row);
            let below_pixel = pixel_index + width;
            if below_pixel < area {
                let decay: u32 = generate_decay();
                let below_pixel_fire_intensity = CONFIG_STATE.firePixelsArray[below_pixel as usize];
                let mut new_fire_intensity = 0;
                if (below_pixel_fire_intensity - decay) >= 0 {
                    new_fire_intensity = below_pixel_fire_intensity - decay;
                }
                if (pixel_index - decay) <= area && new_fire_intensity >= 0 && new_fire_intensity <= 36 {
                    CONFIG_STATE.firePixelsArray[(pixel_index - decay) as usize] = new_fire_intensity;
                }
            }
        }
    }
}

    
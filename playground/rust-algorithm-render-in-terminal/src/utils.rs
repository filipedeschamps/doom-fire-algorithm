use std::{thread, time};

pub fn wait(millis: u64) {
    let duration = time::Duration::from_millis(millis);
    thread::sleep(duration);
}


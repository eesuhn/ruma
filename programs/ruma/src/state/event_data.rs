use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct EventData {
    pub name: String,
    pub is_public: bool,
    pub needs_approval: bool,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub location: Option<String>,
    pub about: Option<String>,
    pub image: Option<String>,
    pub capacity: Option<i32>,
}

impl EventData {
    pub fn min_space() -> usize {
        let mut space = EventData::DISCRIMINATOR.len();

        // name, is_public, needs_approval, start_date, end_date, start_time, end_time, location, about, image, capacity
        space += 4 + 1 + 1 + (1 + 4) * 7 + (1 + 4);

        space
    }
}

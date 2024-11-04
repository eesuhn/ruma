use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct EventData {
    pub name: String,
    pub is_public: bool,
    pub needs_approval: bool,
    pub capacity: Option<i32>,
    pub start_timestamp: Option<i64>,
    pub end_timestamp: Option<i64>,
    pub location: Option<String>,
    pub about: Option<String>,
    pub image: Option<String>,
}

impl EventData {
    // discriminator, name, is_public, needs_approval, capacity, start_timestamp, end_timestamp, location, about, image
    pub const MIN_SPACE: usize =
        EventData::DISCRIMINATOR.len() + 4 + 1 + 1 + (1 + 4) + ((1 + 8) * 2) + ((1 + 4) * 3);
}

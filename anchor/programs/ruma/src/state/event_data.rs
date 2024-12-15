use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct EventData {
    pub bump: u8,
    pub is_public: bool,
    pub needs_approval: bool,
    pub name: String,
    pub image: String,
    pub capacity: Option<i32>,
    pub start_timestamp: Option<i64>,
    pub end_timestamp: Option<i64>,
    pub location: Option<String>,
    pub about: Option<String>,
}

impl EventData {
    // discriminator, is_public, needs_approval, name, image, capacity, start_timestamp, end_timestamp, location, about
    pub const MIN_SPACE: usize = EventData::DISCRIMINATOR.len()
        + 1
        + 1
        + 1
        + 4
        + 4
        + (1 + 4)
        + (1 + 8)
        + (1 + 8)
        + (1 + 4)
        + (1 + 4);
}

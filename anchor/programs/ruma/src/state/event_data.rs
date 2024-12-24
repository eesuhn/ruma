use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct EventData {
    pub bump: u8,                     // 1
    pub is_public: bool,              // 1
    pub needs_approval: bool,         // 1
    pub name: String,                 // 4
    pub image: String,                // 4
    pub capacity: Option<i32>,        // 1 + 4
    pub start_timestamp: Option<i64>, // 1 + 8
    pub end_timestamp: Option<i64>,   // 1 + 8
    pub location: Option<String>,     // 1 + 4
    pub about: Option<String>,        // 1 + 4
}

impl EventData {
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

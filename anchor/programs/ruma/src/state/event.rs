use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct Event {
    pub bump: u8,               // 1
    pub data: Pubkey,           // 32
    pub badge: Option<Pubkey>,  // 1 + 32
    pub attendees: Vec<Pubkey>, // 4
}

impl Event {
    pub const MIN_SPACE: usize = Event::DISCRIMINATOR.len() + 1 + 32 + 32 + (1 + 32) + 4;
}

use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct Event {
    pub bump: u8,
    pub data: Pubkey,
    pub badge: Option<Pubkey>,
    pub attendees: Vec<Pubkey>,
}

impl Event {
    // discriminator, bump, data, badge, attendees
    pub const MIN_SPACE: usize = Event::DISCRIMINATOR.len() + 1 + 32 + (1 + 32) + 4;
}

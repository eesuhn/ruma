use crate::state::*;
use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct Event {
    pub bump: u8,
    pub badge: Pubkey,
    pub organizer: User,
    pub data: EventData,
    pub attendees: Vec<Attendee>,
}

impl Event {
    // discriminator, badge, bump, organizer, data, attendees
    pub const MIN_SPACE: usize =
        Event::DISCRIMINATOR.len() + 32 + 1 + User::MIN_SPACE + EventData::MIN_SPACE + 4;
}

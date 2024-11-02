use crate::state::*;
use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct Event {
    pub bump: u8,
    pub organizer: User,
    pub data: EventData,
    pub badge: Pubkey,
    pub attendees: Vec<Attendee>,
}

impl Event {
    // discriminator, bump, organizer, data, badge, attendees
    pub const MIN_SPACE: usize =
        Event::DISCRIMINATOR.len() + 1 + User::MIN_SPACE + EventData::MIN_SPACE + 32 + 4;
}

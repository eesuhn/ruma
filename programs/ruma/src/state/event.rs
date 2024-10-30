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
    pub fn min_space() -> usize {
        let mut space = Event::DISCRIMINATOR.len();

        // bump, organizer, data, badge, attendees
        space += 1 + User::min_space() + EventData::min_space() + 32 + 4;

        space
    }
}

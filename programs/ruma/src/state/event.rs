use crate::state::*;
use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct Event {
    pub organizer: User,
    pub data: EventData,
    pub badge: Pubkey,
    pub attendees: Vec<Attendee>,
}

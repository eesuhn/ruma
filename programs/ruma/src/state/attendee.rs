use anchor_lang::{prelude::*, Discriminator};
use num_derive::*;

#[account]
pub struct Attendee {
    pub bump: u8,
    pub status: AttendeeStatus,
}

impl Attendee {
    // discriminator, status
    pub const MIN_SPACE: usize = Attendee::DISCRIMINATOR.len() + 1 + (1 + 1);
}

#[derive(
    AnchorSerialize, AnchorDeserialize, FromPrimitive, ToPrimitive, Copy, Clone, PartialEq, Eq,
)]
pub enum AttendeeStatus {
    Pending,
    Approved,
    Rejected,
}

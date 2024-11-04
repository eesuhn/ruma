use crate::state::*;
use anchor_lang::{prelude::*, Discriminator};
use num_derive::*;

#[account]
pub struct Attendee {
    pub status: AttendeeStatus,
    pub user: User,
}

impl Attendee {
    // discriminator, status, user
    pub const MIN_SPACE: usize = Attendee::DISCRIMINATOR.len() + (1 + 1) + User::MIN_SPACE;
}

#[derive(
    AnchorSerialize, AnchorDeserialize, FromPrimitive, ToPrimitive, Copy, Clone, PartialEq, Eq,
)]
pub enum AttendeeStatus {
    Pending,
    Approved,
    Rejected,
}

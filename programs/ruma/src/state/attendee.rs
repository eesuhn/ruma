use crate::state::*;
use anchor_lang::{prelude::*, Discriminator};
use num_derive::*;

#[account]
pub struct Attendee {
    pub user: User,
    pub status: AttendeeStatus,
}

impl Attendee {
    // discriminator, user, status
    pub const MIN_SPACE: usize = Attendee::DISCRIMINATOR.len() + User::MIN_SPACE + (1 + 1);
}

#[derive(
    AnchorSerialize, AnchorDeserialize, FromPrimitive, ToPrimitive, Copy, Clone, PartialEq, Eq,
)]
pub enum AttendeeStatus {
    Pending,
    Approved,
    Rejected,
}

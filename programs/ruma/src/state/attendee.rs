use crate::state::*;
use anchor_lang::{prelude::*, Discriminator};
use num_derive::*;

#[account]
pub struct Attendee {
    pub user: User,
    pub status: AttendeeStatus,
}

impl Attendee {
    pub fn min_space() -> usize {
        let mut space = Attendee::DISCRIMINATOR.len();

        // user, status
        space += User::min_space() + (1 + 1);

        space
    }
}

#[derive(
    AnchorSerialize, AnchorDeserialize, FromPrimitive, ToPrimitive, Copy, Clone, PartialEq, Eq,
)]
pub enum AttendeeStatus {
    Pending,
    Approved,
    Rejected,
}

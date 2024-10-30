use anchor_lang::{prelude::*, Discriminator};
use crate::state::*;

#[account]
pub struct Attendee {
    pub user: User,
    pub qr_hash: String,
}

impl Attendee {
    pub fn min_space() -> usize {
        let mut space = Attendee::DISCRIMINATOR.len();

        // user, qr_hash
        space += User::min_space() + 4;

        space
    }
}

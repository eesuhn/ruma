use crate::state::*;
use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct User {
    pub bump: u8,
    pub pubkey: Pubkey,
    pub data: UserData,
    pub badges: Vec<Pubkey>,
}

impl User {
    pub fn min_space() -> usize {
        let mut space = User::DISCRIMINATOR.len();

        // bump, pubkey, data, badges
        space += 1 + 32 + UserData::min_space() + 4;

        space
    }
}

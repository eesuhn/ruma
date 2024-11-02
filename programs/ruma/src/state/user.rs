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
    // discriminator, bump, pubkey, data, badges
    pub const MIN_SPACE: usize = User::DISCRIMINATOR.len() + 1 + 32 + UserData::MIN_SPACE + 4;
}

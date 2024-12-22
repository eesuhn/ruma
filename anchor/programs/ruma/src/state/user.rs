use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct User {
    pub bump: u8,
    pub data: Pubkey,
    pub badges: Vec<Pubkey>,
}

impl User {
    // discriminator, bump, pubkey, data, badges
    pub const MIN_SPACE: usize = User::DISCRIMINATOR.len() + 1 + 32 + 4;
}

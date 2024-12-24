use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct User {
    pub bump: u8,            // 1
    pub data: Pubkey,        // 32
    pub badges: Vec<Pubkey>, // 4
}

impl User {
    pub const MIN_SPACE: usize = User::DISCRIMINATOR.len() + 1 + 32 + 4;
}

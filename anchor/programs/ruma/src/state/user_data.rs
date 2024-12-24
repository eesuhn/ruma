use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct UserData {
    pub bump: u8,      // 1
    pub name: String,  // 4
    pub image: String, // 4
}

impl UserData {
    pub const MIN_SPACE: usize = UserData::DISCRIMINATOR.len() + 1 + 4 + 4;
}

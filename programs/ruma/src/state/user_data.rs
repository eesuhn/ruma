use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct UserData {
    pub bump: u8,
    pub name: String,
    pub image: String,
}

impl UserData {
    // discriminator, bump, name, image
    pub const MIN_SPACE: usize = UserData::DISCRIMINATOR.len() + 1 + 4 + 4;
}

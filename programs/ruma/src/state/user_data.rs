use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct UserData {
    pub name: String,
    pub image: String,
}

impl UserData {
    // discriminator, name, image
    pub const MIN_SPACE: usize = UserData::DISCRIMINATOR.len() + 4 * 2;
}

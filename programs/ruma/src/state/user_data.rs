use anchor_lang::{prelude::*, Discriminator};

#[account]
pub struct UserData {
    pub name: String,
    pub image: String,
}

impl UserData {
    pub fn min_space() -> usize {
        let mut space = UserData::DISCRIMINATOR.len();

        // name, image
        space += 4 * 2;

        space
    }
}

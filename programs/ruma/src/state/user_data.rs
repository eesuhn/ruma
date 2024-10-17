use anchor_lang::prelude::*;

#[account]
pub struct UserData {
    pub name: String,
    pub image: String,
}

use crate::state::*;
use anchor_lang::prelude::*;

#[account]
pub struct User {
    pub pubkey: Pubkey,
    pub data: UserData,
    pub badges: Vec<Pubkey>,
}

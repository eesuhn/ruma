use anchor_lang::prelude::*;
use crate::state::*;

#[account]
pub struct Attendee {
    pub user: User,
    pub qr_hash: String,
}

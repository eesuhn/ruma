use anchor_lang::prelude::*;

#[constant]
pub const RUMA_WALLET: Pubkey = pubkey!("RUMAAgFQxafzGWmfPhcBSL6AeGfw77gFZrSvDdkRUMk");
pub const USER_SEED: &[u8] = b"user";
pub const USER_DATA_SEED: &[u8] = b"user_data";
pub const EVENT_SEED: &[u8] = b"event";
pub const EVENT_DATA_SEED: &[u8] = b"event_data";
pub const ATTENDEE_SEED: &[u8] = b"attendee";
pub const MAX_USER_NAME_LEN: usize = 32;
pub const MAX_EVENT_NAME_LEN: usize = 128;

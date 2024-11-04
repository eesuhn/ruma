use anchor_lang::prelude::*;

#[constant]
pub const RUMA_WALLET: Pubkey = pubkey!("RUMAAgFQxafzGWmfPhcBSL6AeGfw77gFZrSvDdkRUMk");
pub const ATTENDEE_SEED: &str = "attendee";
pub const EVENT_SEED: &str = "event";
pub const EVENT_DATA_SEED: &str = "event_data";
pub const USER_SEED: &str = "user";
pub const USER_DATA_SEED: &str = "user_data";
pub const MAX_USER_NAME_LEN: usize = 32;
pub const MAX_EVENT_NAME_LEN: usize = 128;

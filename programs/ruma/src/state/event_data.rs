use anchor_lang::prelude::*;

#[account]
pub struct EventData {
    pub name: String,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub location: Option<String>,
    pub about: Option<String>,
    pub image: Option<String>,
    pub is_public: bool,
    pub needs_approval: bool,
    pub capacity: Option<i8>,
}

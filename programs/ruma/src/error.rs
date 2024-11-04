use anchor_lang::prelude::*;

#[error_code]
pub enum RumaError {
    #[msg("User name is required")]
    UserNameRequired,
    #[msg("User name can not be longer than 32 characters")]
    UserNameTooLong,
    #[msg("Event name is required")]
    EventNameRequired,
    #[msg("Event name can not be longer than 128 characters")]
    EventNameTooLong,
}

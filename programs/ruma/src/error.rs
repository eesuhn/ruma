use anchor_lang::prelude::*;

#[error_code]
pub enum RumaError {
    #[msg("User name can not be longer than 32 characters")]
    UserNameTooLong,
    #[msg("Event name can not be longer than 128 characters")]
    EventNameTooLong,
}

use anchor_lang::prelude::*;

#[error_code]
pub enum RumaError {
    #[msg("User name is required")]
    UserNameRequired,
    #[msg("User name can not be longer than 32 characters")]
    UserNameTooLong,
    #[msg("User image is required")]
    UserImageRequired,
    #[msg("User image can not be longer than 200 characters")]
    UserImageTooLong,
    #[msg("Event name is required")]
    EventNameRequired,
    #[msg("Event name can not be longer than 128 characters")]
    EventNameTooLong,
    #[msg("Image is required")]
    EventImageRequired,
    #[msg("Image can not be longer than 200 characters")]
    EventImageTooLong,
    #[msg("Badge name is required")]
    BadgeNameRequired,
    #[msg("Badge name can not be longer than 32 characters")]
    BadgeNameTooLong,
    #[msg("Badge symbol is required")]
    BadgeSymbolRequired,
    #[msg("Badge symbol can not be longer than 10 characters")]
    BadgeSymbolTooLong,
    #[msg("Badge URI is required")]
    BadgeUriRequired,
    #[msg("Badge URI can not be longer than 200 characters")]
    BadgeUriTooLong,
    #[msg("Signer not authorized")]
    UnauthorizedMasterWallet,
    #[msg("Event capacity has reached maximum")]
    EventCapacityMaxReached,
    #[msg("Attendee is not approved for this event")]
    AttendeeNotApproved,
}

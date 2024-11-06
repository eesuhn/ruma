use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;
use state::*;

declare_id!("RUMAjHRSEoL4TQB5SZ8KJnxMUui7QzmzzznZU7qPXgn");

#[program]
pub mod ruma {
    use super::*;

    pub fn create_profile(ctx: Context<CreateProfile>, user_data: UserData) -> Result<()> {
        instructions::create_profile(ctx, user_data)
    }

    pub fn create_event(
        ctx: Context<CreateEvent>,
        event_data: EventData,
        badge_name: String,
        badge_symbol: String,
        badge_uri: String,
    ) -> Result<()> {
        instructions::create_event(ctx, event_data, badge_name, badge_symbol, badge_uri)
    }

    pub fn register_for_event(ctx: Context<RegisterForEvent>, name: String) -> Result<()> {
        instructions::register_for_event(ctx, name)
    }

    pub fn change_attendee_status(
        ctx: Context<ChangeAttendeeStatus>,
        status: AttendeeStatus,
        name: String,
    ) -> Result<()> {
        instructions::change_attendee_status(ctx, status, name)
    }

    pub fn check_into_event(ctx: Context<CheckIntoEvent>, edition: u64) -> Result<()> {
        instructions::check_into_event(ctx, edition)
    }
}

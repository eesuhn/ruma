use anchor_lang::prelude::*;
declare_id!("E2iAM2RNDLgMAY5jBsr2WiTqL6umZ4wkZhBBvmEBGWJ5");

#[program]
pub mod ruma {
    use super::*;

    pub fn create_profile(ctx: Context<CreateProfile>) -> Result<()> {
        Ok(())
    }

    pub fn create_event(ctx: Context<CreateEvent>) -> Result<()> {
        Ok(())
    }

    pub fn register_for_event(ctx: Context<RegisterForEvent>) -> Result<()> {
        Ok(())
    }

    pub fn approve_attendee(ctx: Context<ApproveAttendee>) -> Result<()> {
        Ok(())
    }

    pub fn reject_attendee(ctx: Context<RejectAttendee>) -> Result<()> {
        Ok(())
    }

    pub fn check_into_event(ctx: Context<CheckIntoEvent>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateProfile {}

#[derive(Accounts)]
pub struct CreateEvent {}

#[derive(Accounts)]
pub struct RegisterForEvent {}

#[derive(Accounts)]
pub struct ApproveAttendee {}

#[derive(Accounts)]
pub struct RejectAttendee {}

#[derive(Accounts)]
pub struct CheckIntoEvent {}

#[account]
pub struct User {
    pub pubkey: Pubkey,
    pub data: UserData,
    pub badges: Vec<Pubkey>,
}

#[account]
pub struct UserData {
    name: String,
    image: String,
}

#[account]
pub struct Event {
    organizer: User,
    data: EventData,
    badge: Pubkey,
    attendees: Vec<Attendee>,
}

#[account]
pub struct EventData {
    name: String,
    start_date: Option<String>,
    end_date: Option<String>,
    start_time: Option<String>,
    end_time: Option<String>,
    location: Option<String>,
    about: Option<String>,
    image: Option<String>,
    is_public: bool,
    needs_approval: bool,
    capacity: Option<i8>,
}

#[account]
pub struct Attendee {
    user: User,
    qr_hash: String,
}

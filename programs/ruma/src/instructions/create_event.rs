use crate::{constants::*, error::*, state::*};
use anchor_lang::prelude::*;

pub fn create_event(
    ctx: Context<CreateEvent>,
    is_public: bool,
    needs_approval: bool,
    name: String,
    image: String,
    capacity: Option<i32>,
    start_timestamp: Option<i64>,
    end_timestamp: Option<i64>,
    location: Option<String>,
    about: Option<String>,
) -> Result<()> {
    require!(!name.is_empty(), RumaError::EventNameRequired);
    require!(
        name.len() <= MAX_EVENT_NAME_LEN,
        RumaError::EventNameTooLong
    );
    require!(!image.is_empty(), RumaError::ImageRequired);

    let event_data = &mut ctx.accounts.event_data;

    event_data.bump = ctx.bumps.event_data;
    event_data.is_public = is_public;
    event_data.needs_approval = needs_approval;
    event_data.name = name;
    event_data.image = image;
    event_data.capacity = capacity;
    event_data.start_timestamp = start_timestamp;
    event_data.end_timestamp = end_timestamp;
    event_data.location = location;
    event_data.about = about;

    let event = &mut ctx.accounts.event;

    event.bump = ctx.bumps.event;
    event.data = ctx.accounts.event_data.key();
    event.badge = None;
    event.attendees = Vec::new();

    Ok(())
}

#[derive(Accounts)]
#[instruction(
    _is_public: bool,
    _needs_approval: bool,
    name: String,
    image: String,
    _capacity: Option<i32>,
    _start_timestamp: Option<i64>,
    _end_timestamp: Option<i64>,
    location: Option<String>,
    about: Option<String>,
)]
pub struct CreateEvent<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        seeds = [USER_SEED, payer.key().as_ref()],
        bump = organizer.bump,
    )]
    pub organizer: Account<'info, User>,
    #[account(
        init,
        space = Event::MIN_SPACE,
        seeds = [EVENT_SEED, organizer.key().as_ref(), name.as_bytes()],
        bump,
        payer = payer,
    )]
    pub event: Account<'info, Event>,
    #[account(
        init,
        space = EventData::MIN_SPACE + name.len() + image.len() + location.map(|s| s.len()).unwrap_or(0) + about.map(|s| s.len()).unwrap_or(0),
        seeds = [EVENT_DATA_SEED, organizer.key().as_ref(), name.as_bytes()],
        bump,
        payer = payer,
    )]
    pub event_data: Account<'info, EventData>,
    pub system_program: Program<'info, System>,
}

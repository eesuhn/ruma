use crate::constants::*;
use crate::error::*;
use crate::state::*;
use anchor_lang::prelude::*;

pub fn register_for_event(ctx: Context<RegisterForEvent>, name: String) -> Result<()> {
    require!(!name.is_empty(), RumaError::EventNameRequired);
    require!(name.len() <= 128, RumaError::EventNameTooLong);

    let event = &mut ctx.accounts.event;

    event.attendees.push(Attendee {
        user: (*ctx.accounts.attendee).clone(),
        status: AttendeeStatus::Pending,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct RegisterForEvent<'info> {
    #[account(
        mut,
        address = RUMA_WALLET
    )]
    pub payer: Signer<'info>,
    pub organizer: Account<'info, User>,
    pub attendee: Account<'info, User>,
    #[account(
        mut,
        seeds = [EVENT_SEED.as_bytes(), organizer.key().as_ref(), name.as_bytes()],
        bump = event.bump,
        realloc = event.to_account_info().data_len() + Attendee::MIN_SPACE,
        realloc::payer = payer,
        realloc::zero = false,
    )]
    pub event: Account<'info, Event>,
    pub system_program: Program<'info, System>,
}

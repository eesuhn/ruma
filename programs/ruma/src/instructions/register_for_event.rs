use crate::{constants::*, error::*, state::*};
use anchor_lang::prelude::*;

pub fn register_for_event(ctx: Context<RegisterForEvent>, name: String) -> Result<()> {
    require!(!name.is_empty(), RumaError::EventNameRequired);
    require!(
        name.len() <= MAX_EVENT_NAME_LEN,
        RumaError::EventNameTooLong
    );

    let attendee = &mut ctx.accounts.attendee;

    attendee.bump = ctx.bumps.attendee;
    attendee.status = AttendeeStatus::Pending;

    let event = &mut ctx.accounts.event;

    event.attendees.push(ctx.accounts.attendee.key());

    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct RegisterForEvent<'info> {
    #[account(
        mut,
        address = RUMA_WALLET @ RumaError::UnauthorizedMasterWallet
    )]
    pub payer: Signer<'info>,
    pub organizer: Account<'info, User>,
    pub user: Account<'info, User>,
    #[account(
        mut,
        seeds = [EVENT_SEED, organizer.key().as_ref(), name.as_bytes()],
        bump = event.bump,
        realloc = event.to_account_info().data_len() + attendee.key().to_bytes().len(),
        realloc::payer = payer,
        realloc::zero = false,
    )]
    pub event: Account<'info, Event>,
    #[account(
        init,
        space = Attendee::MIN_SPACE,
        seeds = [ATTENDEE_SEED, user.key().as_ref(), event.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub attendee: Account<'info, Attendee>,
    pub system_program: Program<'info, System>,
}

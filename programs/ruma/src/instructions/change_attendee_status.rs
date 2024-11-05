use crate::constants::*;
use crate::error::*;
use crate::state::*;
use anchor_lang::prelude::*;

pub fn change_attendee_status(
    ctx: Context<ChangeAttendeeStatus>,
    status: AttendeeStatus,
    _name: String,
) -> Result<()> {
    let event = &mut ctx.accounts.event;

    if let Some(attendee) = event
        .attendees
        .iter_mut()
        .find(|a| a.user.pubkey == ctx.accounts.attendee.key())
    {
        attendee.status = status;
    } else {
        return Err(error!(RumaError::AttendeeNotFound));
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct ChangeAttendeeStatus<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        seeds = [USER_DATA_SEED.as_bytes(), payer.key.as_ref()],
        bump = organizer.bump
    )]
    pub organizer: Account<'info, User>,
    pub attendee: Account<'info, User>,
    #[account(
        mut,
        seeds = [EVENT_SEED.as_bytes(), organizer.key().as_ref(), name.as_bytes()],
        bump = event.bump,
    )]
    pub event: Account<'info, Event>,
    pub system_program: Program<'info, System>,
}

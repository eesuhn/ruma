use crate::{constants::*, error::*, state::*};
use anchor_lang::prelude::*;

pub fn change_attendee_status(
    ctx: Context<ChangeAttendeeStatus>,
    status: AttendeeStatus,
) -> Result<()> {
    let attendee = &mut ctx.accounts.attendee;

    attendee.status = status;

    Ok(())
}

#[derive(Accounts)]
pub struct ChangeAttendeeStatus<'info> {
    #[account(
        mut,
        address = RUMA_WALLET @ RumaError::UnauthorizedMasterWallet
    )]
    pub payer: Signer<'info>,
    pub user: Account<'info, User>,
    pub event: Account<'info, Event>,
    #[account(
        mut,
        seeds = [ATTENDEE_SEED, user.key().as_ref(), event.key().as_ref()],
        bump = attendee.bump,
    )]
    pub attendee: Account<'info, Attendee>,
    pub system_program: Program<'info, System>,
}

use anchor_lang::prelude::*;

pub fn approve_attendee(ctx: Context<ApproveAttendee>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct ApproveAttendee {}

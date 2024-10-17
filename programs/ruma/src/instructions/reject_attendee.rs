use anchor_lang::prelude::*;

pub fn reject_attendee(ctx: Context<RejectAttendee>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct RejectAttendee {}

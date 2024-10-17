use anchor_lang::prelude::*;

pub fn check_into_event(ctx: Context<CheckIntoEvent>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct CheckIntoEvent {}

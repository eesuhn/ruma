use anchor_lang::prelude::*;

pub fn create_event(ctx: Context<CreateEvent>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct CreateEvent {}

use anchor_lang::prelude::*;

pub fn register_for_event(ctx: Context<RegisterForEvent>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct RegisterForEvent {}

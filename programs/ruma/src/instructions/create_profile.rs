use anchor_lang::prelude::*;

pub fn create_profile(ctx: Context<CreateProfile>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct CreateProfile {}

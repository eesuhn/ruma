use crate::constants::*;
use crate::error::RumaError;
use crate::state::*;
use anchor_lang::prelude::*;

pub fn create_profile(
    ctx: Context<CreateProfile>,
    pubkey: Pubkey,
    name: String,
    image: String,
) -> Result<()> {
    require!(name.len() <= 32, RumaError::UserNameTooLong);

    let user = &mut ctx.accounts.user;

    user.bump = ctx.bumps.user;
    user.pubkey = pubkey;
    user.data = UserData { name, image };
    user.badges = Vec::new();

    Ok(())
}

#[derive(Accounts)]
#[instruction(pubkey: Pubkey, name: String, image: String)]
pub struct CreateProfile<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        space = User::min_space() + name.len() + image.len(),
        seeds = [USER_DATA_SEED.as_bytes(), pubkey.as_ref()],
        bump,
        payer = payer,
    )]
    pub user: Account<'info, User>,
    pub system_program: Program<'info, System>,
}

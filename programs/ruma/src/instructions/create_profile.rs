use crate::constants::*;
use crate::error::RumaError;
use crate::state::*;
use anchor_lang::prelude::*;

pub fn create_profile(ctx: Context<CreateProfile>, name: String, image: String) -> Result<()> {
    require!(!name.is_empty(), RumaError::UserNameRequired);
    require!(name.len() <= MAX_USER_NAME_LEN, RumaError::UserNameTooLong);

    let user = &mut ctx.accounts.user;

    user.bump = ctx.bumps.user;
    user.pubkey = ctx.accounts.payer.key();
    user.data = UserData { name, image };
    user.badges = Vec::new();

    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String, image: String)]
pub struct CreateProfile<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        space = User::MIN_SPACE + name.len() + image.len(),
        seeds = [USER_DATA_SEED.as_bytes(), payer.key.as_ref()],
        bump,
        payer = payer,
    )]
    pub user: Account<'info, User>,
    pub system_program: Program<'info, System>,
}

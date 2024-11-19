use crate::{constants::*, error::*, state::*};
use anchor_lang::prelude::*;

pub fn create_profile(ctx: Context<CreateProfile>, name: String, image: String) -> Result<()> {
    require!(!name.is_empty(), RumaError::UserNameRequired);
    require!(
        name.len() <= MAX_USER_NAME_LENGTH,
        RumaError::UserNameTooLong
    );
    require!(!image.is_empty(), RumaError::UserImageRequired);
    require!(
        image.len() <= MAX_USER_IMAGE_LENGTH,
        RumaError::UserImageTooLong
    );

    let user_data = &mut ctx.accounts.user_data;

    user_data.bump = ctx.bumps.user_data;
    user_data.name = name;
    user_data.image = image;

    let user = &mut ctx.accounts.user;

    user.bump = ctx.bumps.user;
    user.data = ctx.accounts.user_data.key();
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
        space = User::MIN_SPACE,
        seeds = [USER_SEED, payer.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub user: Account<'info, User>,
    #[account(
        init,
        space = UserData::MIN_SPACE + name.len() + image.len(),
        seeds = [USER_DATA_SEED, user.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub user_data: Account<'info, UserData>,
    pub system_program: Program<'info, System>,
}

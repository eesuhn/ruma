use crate::{constants::*, error::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        mint_new_edition_from_master_edition_via_token, MasterEditionAccount, Metadata,
        MetadataAccount, MintNewEditionFromMasterEditionViaToken,
    },
    token_interface::{Mint, TokenAccount, TokenInterface},
};

pub fn check_into_event(ctx: Context<CheckIntoEvent>, edition: u64) -> Result<()> {
    mint_new_edition_from_master_edition_via_token(
        CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            MintNewEditionFromMasterEditionViaToken {
                new_metadata: ctx.accounts.new_metadata.to_account_info(),
                new_edition: ctx.accounts.new_edition.to_account_info(),
                master_edition: ctx.accounts.master_edition.to_account_info(),
                new_mint: ctx.accounts.new_mint.to_account_info(),
                edition_mark_pda: ctx.accounts.edition_mark_pda.to_account_info(),
                new_mint_authority: ctx.accounts.organizer.to_account_info(),
                payer: ctx.accounts.payer.to_account_info(),
                token_account_owner: ctx.accounts.user.to_account_info(),
                token_account: ctx.accounts.token_account.to_account_info(),
                new_metadata_update_authority: ctx.accounts.organizer.to_account_info(),
                metadata: ctx.accounts.metadata.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
                metadata_mint: ctx.accounts.metadata_mint.to_account_info(),
            },
        ),
        edition,
    )?;

    ctx.accounts
        .user
        .badges
        .push(ctx.accounts.new_edition.key());

    Ok(())
}

#[derive(Accounts)]
pub struct CheckIntoEvent<'info> {
    #[account(
        mut,
        address = RUMA_WALLET @ RumaError::UnauthorizedMasterWallet
    )]
    pub payer: Signer<'info>,
    pub organizer: Account<'info, User>,
    #[account(mut)]
    pub user: Account<'info, User>,
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer.key(),
        mint::freeze_authority = payer.key(),
        mint::token_program = token_program,
    )]
    pub new_mint: InterfaceAccount<'info, Mint>,
    pub new_metadata: Account<'info, MetadataAccount>,
    /// CHECK: initialized by Metaplex Token Metadata program
    pub new_edition: UncheckedAccount<'info>,
    /// CHECK: initialized by Metaplex Token Metadata program
    pub edition_mark_pda: UncheckedAccount<'info>,
    pub metadata_mint: InterfaceAccount<'info, Mint>,
    pub metadata: Account<'info, MetadataAccount>,
    pub master_edition: Account<'info, MasterEditionAccount>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = new_mint,
        associated_token::authority = payer,
        associated_token::token_program = token_program,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

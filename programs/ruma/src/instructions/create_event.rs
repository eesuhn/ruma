use crate::constants::*;
use crate::error::RumaError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_master_edition_v3, create_metadata_accounts_v3, mpl_token_metadata::types::DataV2,
        CreateMasterEditionV3, CreateMetadataAccountsV3, Metadata,
    },
    token_interface::{mint_to, Mint, MintTo, TokenAccount, TokenInterface},
};

pub fn create_event(
    ctx: Context<CreateEvent>,
    name: String,
    is_public: bool,
    needs_approval: bool,
    capacity: Option<i32>,
    start_timestamp: Option<i64>,
    end_timestamp: Option<i64>,
    location: Option<String>,
    about: Option<String>,
    image: Option<String>,
    badge_name: String,
    badge_symbol: String,
    badge_uri: String,
) -> Result<()> {
    require!(!name.is_empty(), RumaError::EventNameRequired);
    require!(name.len() <= 128, RumaError::EventNameTooLong);

    let event = &mut ctx.accounts.event;

    event.bump = ctx.bumps.event;
    event.organizer = (*ctx.accounts.organizer).clone();
    event.data = EventData {
        name,
        is_public,
        needs_approval,
        capacity,
        start_timestamp,
        end_timestamp,
        location,
        about,
        image,
    };
    event.attendees = Vec::new();

    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.associated_token_account.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        ),
        1,
    )?;

    create_metadata_accounts_v3(
        CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.payer.to_account_info(),
                update_authority: ctx.accounts.payer.to_account_info(),
                payer: ctx.accounts.payer.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        ),
        DataV2 {
            name: badge_name,
            symbol: badge_symbol,
            uri: badge_uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        },
        true,
        true,
        None,
    )?;

    create_master_edition_v3(
        CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMasterEditionV3 {
                edition: ctx.accounts.edition.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                update_authority: ctx.accounts.payer.to_account_info(),
                mint_authority: ctx.accounts.payer.to_account_info(),
                payer: ctx.accounts.payer.to_account_info(),
                metadata: ctx.accounts.metadata.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        ),
        capacity.map(|c| c as u64),
    )?;

    event.badge = ctx.accounts.edition.key();

    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String, location: Option<String>, about: Option<String>, image: Option<String>)]
pub struct CreateEvent<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        owner = crate::ID,
    )]
    pub organizer: Account<'info, User>,
    #[account(
        init,
        space = Event::MIN_SPACE + name.len() + location.as_ref().map(|s| s.len()).unwrap_or(0) + about.as_ref().map(|s| s.len()).unwrap_or(0) + image.as_ref().map(|s| s.len()).unwrap_or(0),
        seeds = [EVENT_SEED.as_bytes(), organizer.key().as_ref(), name.as_bytes()],
        bump,
        payer = payer,
    )]
    pub event: Account<'info, Event>,
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer.key(),
        mint::freeze_authority = payer.key(),
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub associated_token_account: InterfaceAccount<'info, TokenAccount>,
    /// CHECK: initialized by Metaplex Token Metadata program
    pub metadata: UncheckedAccount<'info>,
    /// CHECK: initialized by Metaplex Token Metadata program
    pub edition: UncheckedAccount<'info>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

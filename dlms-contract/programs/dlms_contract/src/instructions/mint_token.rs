use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};

use crate::constants::*;
use crate::states::SystemState;

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct MintToken<'info> {
    #[account(mut)]
    pub system_state: Account<'info, SystemState>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    /// CHECK: We only derive this PDA in the backend and sign with seeds
    #[account(seeds = [b"mint"], bump)]
    pub mint_authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub to: Account<'info, TokenAccount>, // User's ATA

    pub token_program: Program<'info, Token>,
}

pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
    msg!("Minting {} tokens to {}", amount, ctx.accounts.to.key());

    // Fixed: Access the bump directly as a field
    let bump = ctx.bumps.mint_authority;
    
    // Create the seeds array with the correct format for Solana signer seeds
    let mint_seeds = &[b"mint" as &[u8], &[bump]];
    
    // Create a longer-lived binding for the signer seeds
    let signer_seeds = &[&mint_seeds[..]];
    
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        },
        signer_seeds,
    );

    token::mint_to(cpi_ctx, amount)?;

    msg!("Successfully minted tokens");
    Ok(())
}
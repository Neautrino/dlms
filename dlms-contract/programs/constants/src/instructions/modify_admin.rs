use anchor_lang::prelude::*;
use crate::error::ErrorCode;
use crate::states::SystemState;
use crate::constants::*;


#[derive(Accounts)]
pub struct ModifyAdmin<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [INITIALIZE.as_bytes()],
        bump,
    )]
    pub system_state: Account<'info, SystemState>,
}

pub fn add_admin(ctx: Context<ModifyAdmin>, new_admin: Pubkey) -> Result<()> {
    let state = &mut ctx.accounts.system_state;

    require!(
        state.authority == ctx.accounts.authority.key(),
        ErrorCode::NotAuthorized
    );

    require!(
        !state.admins.contains(&new_admin),
        ErrorCode::AdminAlreadyExists
    );

    require!(state.admins.len() < 10, ErrorCode::AdminLimitReached);

    state.admins.push(new_admin);

    Ok(())
}

pub fn remove_admin(ctx: Context<ModifyAdmin>, admin_to_remove: Pubkey) -> Result<()> {
    let state = &mut ctx.accounts.system_state;

    require!(
        state.authority == ctx.accounts.authority.key(),
        ErrorCode::NotAuthorized
    );

    let initial_len = state.admins.len();
    state.admins.retain(|admin| *admin != admin_to_remove);

    require!(state.admins.len() < initial_len, ErrorCode::AdminNotFound);

    Ok(())
}

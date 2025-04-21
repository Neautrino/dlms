use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::ErrorCode;
use crate::states::{SystemState, UserAccount};

#[derive(Accounts)]
pub struct DeleteUser<'info> {
    #[account(mut)]
    pub system_state: Account<'info, SystemState>,

    #[account(
        mut,
        seeds = [USER_STATE.as_bytes(), authority.key().as_ref()],
        bump,
        close = authority,
        constraint = user_account.authority == authority.key() @ ErrorCode::NotAuthorized,
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn delete_user(ctx: Context<DeleteUser>) -> Result<()> {
    let system_state = &mut ctx.accounts.system_state;
    let user_account = &ctx.accounts.user_account;

    match user_account.role {
        crate::states::UserRole::Labour => {
            system_state.labour_count = system_state.labour_count.saturating_sub(1);
        }
        crate::states::UserRole::Manager => {
            system_state.manager_count = system_state.manager_count.saturating_sub(1);
        }
    }

    Ok(())
}

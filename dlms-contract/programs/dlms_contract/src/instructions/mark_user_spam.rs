 use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::ErrorCode;
use crate::states::{UserAccount, SystemState};

#[derive(Accounts)]
pub struct MarkUserAsSpam<'info> {
    #[account(mut, has_one = authority)]
    pub system_state: Account<'info, SystemState>,

    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    
    #[account()]
    pub authority: Signer<'info>,
}

pub fn mark_user_as_spam(ctx: Context<MarkUserAsSpam>, isSpam: bool) -> Result<()> {
    let system_state = &ctx.accounts.system_state;
    let authority = &ctx.accounts.authority;
    let user_account = &mut ctx.accounts.user_account;

    // Check if caller is an admin
    require!(
        system_state.admins.contains(&authority.key()),
        ErrorCode::NotAuthorized
    );

    user_account.spam = isSpam;

    Ok(())
}

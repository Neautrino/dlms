use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::ErrorCode;
use crate::states::{SystemState, UserAccount, UserRole};

#[derive(Accounts)]
pub struct RegisterUser<'info> {
    #[account(mut)]
    pub system_state: Account<'info, SystemState>,

    #[account(
        init,
        payer = authority,
        space = 8 + UserAccount::INIT_SPACE,
        seeds = [USER_STATE.as_bytes(), authority.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn register_user(
    ctx: Context<RegisterUser>,
    name: String,
    metadata_uri: String,
    role: UserRole,
) -> Result<()> {
    let system_state = &mut ctx.accounts.system_state;
    let user_account = &mut ctx.accounts.user_account;

    user_account.authority = ctx.accounts.authority.key();
    user_account.name = name;
    user_account.metadata_uri = metadata_uri;
    user_account.active = true;
    user_account.verified = false;
    user_account.rating = 0;
    user_account.rating_count = 0;
    user_account.timestamp = Clock::get()?.unix_timestamp;
    user_account.index = system_state.labour_count + system_state.manager_count;
    user_account.spam = false;

    match role {
        UserRole::Labour => {
            system_state.labour_count += 1;
            user_account.role = UserRole::Labour;
        }
        UserRole::Manager => {
            system_state.manager_count += 1;
            user_account.role = UserRole::Manager;
        }
        _ => return Err(error!(ErrorCode::InvalidRole)),
    };

    Ok(())
}

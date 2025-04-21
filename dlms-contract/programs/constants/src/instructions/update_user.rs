use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::ErrorCode;
use crate::states::UserAccount;

#[derive(Accounts)]
pub struct UpdateUser<'info> {
    #[account(
        mut,
        seeds = [USER_STATE.as_bytes(), authority.key().as_ref()],
        bump,
        constraint = user_account.authority == authority.key() @ ErrorCode::NotAuthorized
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn update_user(
    ctx: Context<UpdateUser>,
    name: String,
    metadata_uri: String,
    active: Option<bool>,
) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;

    user_account.name = name;
    user_account.metadata_uri = metadata_uri;

    if let Some(active_status) = active {
        user_account.active = active_status;
    }

    user_account.timestamp = Clock::get()?.unix_timestamp;

    Ok(())
}

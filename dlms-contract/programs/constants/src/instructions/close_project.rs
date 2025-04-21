use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::constants::*;
use crate::error::ErrorCode;
use crate::states::{Project, ProjectStatus, UserAccount};

#[derive(Accounts)]
pub struct CloseProject<'info> {
    #[account(
        seeds = [USER_STATE.as_bytes(), authority.key().as_ref()],
        bump,
        constraint = manager_account.authority == authority.key() @ ErrorCode::NotAuthorized
    )]
    pub manager_account: Account<'info, UserAccount>, // Using UserAccount instead of ManagerAccount

    #[account(
        mut,
        seeds = [PROJECT_SEED.as_bytes(), manager_account.key().as_ref(), &project.index.to_le_bytes()],
        bump,
        constraint = project.manager == manager_account.key() @ ErrorCode::InvalidManager
    )]
    pub project: Account<'info, Project>,

    #[account(
        mut,
        seeds = [ESCROW_SEED.as_bytes(), project.key().as_ref()],
        bump,
        constraint = escrow_account.key() == project.escrow_account @ ErrorCode::InvalidEscrowAccount
    )]
    pub escrow_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = manager_token_account.owner == manager_account.authority @ ErrorCode::WrongOwner
    )]
    pub manager_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn close_project(ctx: Context<CloseProject>, status: ProjectStatus) -> Result<()> {
    // Can only close completed or canceled projects
    require!(
        status == ProjectStatus::Completed || status == ProjectStatus::Cancelled,
        ErrorCode::WrongProjectStatus
    );

    // Return any remaining escrow to manager
    if ctx.accounts.escrow_account.amount > 0 {
        let bump = ctx.bumps.escrow_account;

        let seeds = &[
            ESCROW_SEED.as_bytes(),
            ctx.accounts.project.to_account_info().key.as_ref(),
            &[bump],
        ];
        let signer = &[&seeds[..]];

        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.escrow_account.to_account_info(),
                to: ctx.accounts.manager_token_account.to_account_info(),
                authority: ctx.accounts.project.to_account_info(),
            },
            signer,
        );
        token::transfer(transfer_ctx, ctx.accounts.escrow_account.amount)?;
    }

    // Mark project as closed or cancelled
    ctx.accounts.project.status = status; // or ProjectStatus::Cancelled, based on your requirements

    Ok(())
}

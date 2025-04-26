use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::constants::*;
use crate::error::ErrorCode;
use crate::states::{Assignment, Project, UserAccount,
    WorkVerification,
};

#[derive(Accounts)]
pub struct ApproveWorkDay<'info> {
    #[account(
        seeds = [USER_STATE.as_bytes(), authority.key().as_ref()],
        bump ,
        constraint = manager_account.authority == authority.key() @ ErrorCode::NotAuthorized
    )]
    pub manager_account: Account<'info, UserAccount>,

    #[account(
        mut,
        seeds = [PROJECT_SEED.as_bytes(), manager_account.key().as_ref(), &project.index.to_le_bytes()],
        bump ,
        constraint = project.manager == manager_account.key() @ ErrorCode::InvalidManager
    )]
    pub project: Account<'info, Project>,

    #[account(
        constraint = labour_account.key() == work_verification.labour @ ErrorCode::InvalidLabour
    )]
    pub labour_account: Account<'info, UserAccount>,

    #[account(
        mut,
        seeds = [ASSIGNMENT.as_bytes(), labour_account.key().as_ref(), project.key().as_ref()],
        bump,
        constraint = assignment.labour == labour_account.key() @ ErrorCode::InvalidLabour,
        constraint = assignment.project == project.key() @ ErrorCode::InvalidProject
    )]
    pub assignment: Account<'info, Assignment>,

    #[account(
        mut,
        seeds = [ WORK_VERIFICATION.as_bytes(), labour_account.key().as_ref(), project.key().as_ref(), &(assignment.days_worked + 1).to_le_bytes()],
        bump,
        constraint = work_verification.project == project.key() @ ErrorCode::InvalidProject,
        constraint = work_verification.labour == labour_account.key() @ ErrorCode::InvalidLabour
    )]
    pub work_verification: Account<'info, WorkVerification>,

    #[account(
        mut,
        seeds = [ESCROW_SEED.as_bytes(), project.key().as_ref()],
        bump,
        constraint = escrow_account.key() == project.escrow_account @ ErrorCode::InvalidEscrowAccount
    )]
    pub escrow_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = labour_token_account.owner == labour_account.authority @ ErrorCode::WrongOwner
    )]
    pub labour_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn approve_work_day(ctx: Context<ApproveWorkDay>) -> Result<()> {
    require!(
        !ctx.accounts.work_verification.manager_verified,
        ErrorCode::AlreadyVerified
    );

    // Verify the work
    let work_verification = &mut ctx.accounts.work_verification;
    work_verification.manager_verified = true;
    work_verification.timestamp = Clock::get()?.unix_timestamp;

    require!(
        work_verification.day_number == ctx.accounts.assignment.days_worked + 1,
        ErrorCode::InvalidDaySequence
    );

    // Process payment if both parties have verified
    if work_verification.labour_verified && work_verification.manager_verified {
        // Calculate tokens to release from escrow
        let payment_amount = ctx.accounts.project.daily_rate;

        let manager_key = ctx.accounts.manager_account.key();
        let project_index_bytes = ctx.accounts.project.index.to_le_bytes();

        msg!("Project address: {}", ctx.accounts.project.key());
        msg!("Escrow address: {}", ctx.accounts.escrow_account.key());
        msg!("Escrow owner: {}", ctx.accounts.escrow_account.owner);
        msg!("Payment amount: {}", payment_amount);

        // Make sure we're using the correct seeds and bump for the project PDA
        let project_seeds = &[
            PROJECT_SEED.as_bytes(),
            manager_key.as_ref(),
            &ctx.accounts.project.index.to_le_bytes(),
            &[ctx.bumps.project],
        ];

        // Create the signer seeds array
        let signer = &[&project_seeds[..]];

        // Transfer payment from escrow to labour
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.escrow_account.to_account_info(),
                to: ctx.accounts.labour_token_account.to_account_info(),
                authority: ctx.accounts.project.to_account_info(), // Project is the authority
            },
            signer,
        );

        // Execute the transfer
        token::transfer(transfer_ctx, payment_amount)?;

        // Update verification record
        work_verification.payment_processed = true;

        // Update assignment
        ctx.accounts.assignment.days_paid += 1;

        ctx.accounts.assignment.days_worked += 1;
    }

    Ok(())
}

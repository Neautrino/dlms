use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use crate::constants::*;
use crate::error::ErrorCode;
use crate::states::{Project, ProjectStatus, SystemState, UserAccount, UserRole};

#[derive(Accounts)]
pub struct CreateProject<'info> {
    #[account(mut)]
    pub system_state: Account<'info, SystemState>,

    #[account(
        mut,
        seeds = [USER_STATE.as_bytes(), authority.key().as_ref()],
        bump,
        constraint = manager_account.authority == authority.key() @ ErrorCode::NotAuthorized,
        constraint = manager_account.role == UserRole::Manager @ ErrorCode::NotAuthorized
    )]
    pub manager_account: Account<'info, UserAccount>,

    #[account(
        init,
        payer = authority,
        space = 8 + Project::INIT_SPACE,
        seeds = [PROJECT_SEED.as_bytes(), manager_account.key().as_ref(), &system_state.project_count.to_le_bytes()],
        bump
    )]
    pub project: Account<'info, Project>,

    #[account(
        init,
        payer = authority,
        token::mint = mint,
        token::authority = project,
        seeds = [ESCROW_SEED.as_bytes(), project.key().as_ref()],
        bump
    )]
    pub escrow_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = manager_token_account.owner == authority.key() @ ErrorCode::WrongOwner
    )]
    pub manager_token_account: Account<'info, TokenAccount>,

    #[account(
        constraint = mint.key() == system_state.mint @ ErrorCode::MintMismatch
    )]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_project(
    ctx: Context<CreateProject>,
    title: String,
    metadata_uri: String,
    daily_rate: u64,
    duration_days: u16,
    max_labourers: u8,
) -> Result<()> {
    msg!("Starting create_project...");

    require!(daily_rate > 0, ErrorCode::InvalidDailyRate);
    msg!("Checked: daily_rate > 0");

    require!(duration_days > 0, ErrorCode::InvalidDuration);
    msg!("Checked: duration_days > 0");

    require!(max_labourers > 0, ErrorCode::InvalidLabourerCount);
    msg!("Checked: max_labourers > 0");

    let escrow_amount = daily_rate
        .checked_mul(max_labourers as u64)
        .ok_or_else(|| {
            msg!("Overflow on daily_rate * max_labourers");
            ErrorCode::CalculationError
        })?
        .checked_mul(duration_days as u64)
        .ok_or_else(|| {
            msg!("Overflow on result * duration_days");
            ErrorCode::CalculationError
        })?;

    msg!("Calculated escrow_amount: {}", escrow_amount);

    require!(
        ctx.accounts.manager_token_account.amount >= escrow_amount,
        ErrorCode::InsufficientFunds
    );
    msg!("Sufficient funds confirmed");

    msg!("Transferring tokens to escrow...");
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.manager_token_account.to_account_info(),
            to: ctx.accounts.escrow_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        },
    );
    token::transfer(cpi_ctx, escrow_amount)?;
    msg!("Token transfer complete");

    let project = &mut ctx.accounts.project;
    let system_state = &mut ctx.accounts.system_state;

    project.manager = ctx.accounts.manager_account.key();
    project.title = title;
    project.metadata_uri = metadata_uri;
    project.daily_rate = daily_rate;
    project.duration_days = duration_days;
    project.max_labourers = max_labourers;
    project.labour_count = 0;
    project.status = ProjectStatus::Open;
    project.escrow_account = ctx.accounts.escrow_account.key();
    project.timestamp = Clock::get()?.unix_timestamp;
    project.index = system_state.project_count;

    system_state.project_count += 1;

    msg!("Project created with index: {}", project.index);
    msg!("create_project finished successfully");

    Ok(())
}

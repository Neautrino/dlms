use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::ErrorCode;
use crate::states::{Project, ProjectStatus, UserAccount, UserRole, Application, ApplicationStatus, WorkVerification, Assignment};

#[derive(Accounts)]
pub struct VerifyWorkDay<'info> {
    #[account(
        seeds = [USER_STATE.as_bytes(), authority.key().as_ref()],
        bump ,
        constraint = labour_account.authority == authority.key() @ ErrorCode::NotAuthorized,
        constraint = labour_account.active @ ErrorCode::LabourNotActive
    )]
    pub labour_account: Account<'info, UserAccount>,
    
    #[account(
        mut,
        constraint = project.status == ProjectStatus::Open @ ErrorCode::ProjectNotOpen
    )]
    pub project: Account<'info, Project>,
    
    #[account(
        mut,
        seeds = [ASSIGNMENT.as_bytes(), labour_account.key().as_ref(), project.key().as_ref()],
        bump,
        constraint = assignment.labour == labour_account.key() @ ErrorCode::InvalidLabour,
        constraint = assignment.project == project.key() @ ErrorCode::InvalidProject
    )]
    pub assignment: Account<'info, Assignment>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + WorkVerification::INIT_SPACE,
        seeds = [ WORK_VERIFICATION.as_bytes(), labour_account.key().as_ref(), project.key().as_ref(), &(assignment.days_worked + 1).to_le_bytes()],
        bump
    )]
    pub work_verification: Account<'info, WorkVerification>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

 pub fn verify_work_day(
        ctx: Context<VerifyWorkDay>,
        day_number: u16,
        work_metadata_uri: String
    ) -> Result<()> {
        require!(
            ctx.accounts.project.status == ProjectStatus::InProgress ||
            ctx.accounts.project.status == ProjectStatus::Open,
            ErrorCode::ProjectNotActive
        );
        
        require!(
            ctx.accounts.assignment.active,
            ErrorCode::AssignmentNotActive
        );
        
        require!(
            day_number == ctx.accounts.assignment.days_worked + 1,
            ErrorCode::InvalidDayNumber
        );
        
        // Create work verification
        let work_verification = &mut ctx.accounts.work_verification;
        work_verification.project = ctx.accounts.project.key();
        work_verification.labour = ctx.accounts.labour_account.key();
        work_verification.day_number = day_number;
        work_verification.manager_verified = false;
        work_verification.labour_verified = true;
        work_verification.metadata_uri = work_metadata_uri;
        work_verification.timestamp = Clock::get()?.unix_timestamp;
        work_verification.payment_processed = false;
        
        
        Ok(())
    }
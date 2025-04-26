 use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::ErrorCode;
use crate::states::{Project, ProjectStatus, UserAccount, UserRole, Application, Assignment, ApplicationStatus};

#[derive(Accounts)]
pub struct ApproveApplication<'info> {
    #[account(
        mut,
        seeds = [APPLICATION.as_bytes(), labour_account.key().as_ref(), project.key().as_ref()],
        bump ,
        constraint = application.status == ApplicationStatus::Pending @ ErrorCode::ApplicationNotPending
    )]
    pub application: Account<'info, Application>,
    
    #[account(
        constraint = application.labour == labour_account.key() @ ErrorCode::InvalidLabour
    )]
    pub labour_account: Account<'info, UserAccount>,
    
    #[account(
        mut,
        constraint = application.project == project.key() @ ErrorCode::InvalidProject,
        constraint = project.manager == manager_account.key() @ ErrorCode::InvalidManager,
        seeds = [PROJECT_SEED.as_bytes(), manager_account.key().as_ref(), &project.index.to_le_bytes()],
        bump 
    )]
    pub project: Account<'info, Project>,
    
    #[account(
        seeds = [USER_STATE.as_bytes(), authority.key().as_ref()],
        bump ,
        constraint = manager_account.authority == authority.key() @ ErrorCode::NotAuthorized
    )]
    pub manager_account: Account<'info, UserAccount>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + Assignment::INIT_SPACE,
        seeds = [ASSIGNMENT.as_bytes(), labour_account.key().as_ref(), project.key().as_ref()],
        bump
    )]
    pub assignment: Account<'info, Assignment>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn approve_application(
        ctx: Context<ApproveApplication>
    ) -> Result<()> {
        require!(
            ctx.accounts.project.status == ProjectStatus::Open,
            ErrorCode::ProjectNotOpen
        );
        
        require!(
            ctx.accounts.project.labour_count < ctx.accounts.project.max_labourers,
            ErrorCode::ProjectFull
        );
        
        let application = &mut ctx.accounts.application;
        let project = &mut ctx.accounts.project;
        
        application.status = ApplicationStatus::Pending;
        application.timestamp = Clock::get()?.unix_timestamp;
        
        // Create labour's assignment to the project
        let assignment = &mut ctx.accounts.assignment;
        assignment.labour = ctx.accounts.labour_account.key();
        assignment.project = project.key();
        assignment.days_worked = 0;
        assignment.days_paid = 0;
        assignment.active = true;
        assignment.timestamp = Clock::get()?.unix_timestamp;
        
        // Update project labour count
        project.labour_count += 1;
        if project.labour_count == project.max_labourers {
            project.status = ProjectStatus::InProgress;
        }
        
        Ok(())
    }
 use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::ErrorCode;
use crate::states::{Project, ProjectStatus, UserAccount, Application, ApplicationStatus};


 #[derive(Accounts)]
pub struct ApplyToProject<'info> {
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
        init,
        payer = authority,
        space = 8 + Application::INIT_SPACE,
        seeds = [ APPLICATION.as_bytes(), labour_account.key().as_ref(), project.key().as_ref()],
        bump
    )]
    pub application: Account<'info, Application>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}
 
 pub fn apply_to_project(
        ctx: Context<ApplyToProject>,
        description: String
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
        
        application.labour = ctx.accounts.labour_account.key();
        application.project = ctx.accounts.project.key();
        application.description = description;
        application.status = ApplicationStatus::Pending;
        application.timestamp = Clock::get()?.unix_timestamp;
        
        Ok(())
    }
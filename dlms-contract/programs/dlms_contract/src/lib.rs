use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod states;

pub use error::*;
pub use instructions::*;
pub use states::*;

declare_id!("D3EyaiLex4rCbjeiag5de5YSHmqqzL6H1DmLEsvMy4yG");

#[program]
pub mod dlms_contract {
    use super::*;

    pub fn initialize_system(ctx: Context<InitializeSystem>, mint: Pubkey) -> Result<()> {
        instructions::initialize_system(ctx, mint)
    }

    pub fn add_admin(ctx: Context<ModifyAdmin>, new_admin: Pubkey) -> Result<()> {
        instructions::add_admin(ctx, new_admin)
    }

    pub fn remove_admin(ctx: Context<ModifyAdmin>, admin_to_remove: Pubkey) -> Result<()> {
        instructions::remove_admin(ctx, admin_to_remove)
    }

    pub fn register_user(
        ctx: Context<RegisterUser>,
        name: String,
        metadata_url: String,
        role: UserRole,
    ) -> Result<()> {
        instructions::register_user(ctx, name, metadata_url, role)
    }

    pub fn update_user(
        ctx: Context<UpdateUser>,
        name: String,
        metadata_uri: String,
        active: Option<bool>,
    ) -> Result<()> {
        instructions::update_user(ctx, name, metadata_uri, active)
    }

    pub fn delete_user(ctx: Context<DeleteUser>) -> Result<()> {
        instructions::delete_user(ctx)
    }

    pub fn create_project(
        ctx: Context<CreateProject>,
        title: String,
        metadata_uri: String,
        daily_rate: u64,
        duration_days: u16,
        max_labourers: u8,
    ) -> Result<()> {
        instructions::create_project(ctx, title, metadata_uri, daily_rate, duration_days, max_labourers)
    }

    pub fn close_project(
        ctx: Context<CloseProject>, 
        status: ProjectStatus
    ) -> Result<()> {
        instructions::close_project(ctx, status)
    }

    pub fn rate_user(
        ctx: Context<RateUser>,
        rating: u8,
        context: String,
    ) -> Result<()> {
        instructions::rate_user(ctx, rating, context)
    }

    pub fn apply_to_project(
        ctx: Context<ApplyToProject>,
        description: String,
    ) -> Result<()> {
        instructions::apply_to_project(ctx, description)
    }

    pub fn approve_application(
        ctx: Context<ApproveApplication>
    ) -> Result<()> {
        instructions::approve_application(ctx)
    }

    pub fn verify_work_day(
        ctx: Context<VerifyWorkDay>,
        day_number: u16,
        work_metadata_uri: String
    ) -> Result<()> {
        instructions::verify_work_day(ctx, day_number, work_metadata_uri)
    }

    pub fn approve_work_day(
        ctx: Context<ApproveWorkDay>
    ) -> Result<()> {
        instructions::approve_work_day(ctx)
    }

    pub fn mark_user_as_spam(
        ctx: Context<MarkUserAsSpam>,
        isSpam: bool
    ) -> Result<()> {
        instructions::mark_user_as_spam(ctx, isSpam)
    }

    pub fn verify_user(
        ctx: Context<VerifyUser>
    ) -> Result<()> {
        instructions::verify_user(ctx)
    }

    pub fn mint_token(
        ctx: Context<MintToken>, 
        amount: u64
    ) -> Result<()> {
        instructions::mint_token(ctx, amount)
    }
}

use anchor_lang::prelude::*;
use crate::states::*;
use crate::constants::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct RateUser<'info> {
    #[account(
        mut,
        seeds = [USER_STATE.as_bytes(), user_account.authority.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(
        init,
        payer = authority,
        space = 8 + Review::INIT_SPACE,
        seeds = [REVIEW.as_bytes(), authority.key().as_ref(), user_account.key().as_ref()],
        bump
    )]
    pub review: Account<'info, Review>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
pub fn rate_user(
    ctx: Context<RateUser>,
    rating: u8,
    context: String,
) -> Result<()> {
    require!(rating >= 1 && rating <= 5, ErrorCode::InvalidRating);

    let user = &mut ctx.accounts.user_account;

    // Update rating
    let total_rating = user.rating.checked_mul(user.rating_count).unwrap_or(0) + rating as u32;
    user.rating_count += 1;
    user.rating = total_rating / user.rating_count;

    // Save review
    let review = &mut ctx.accounts.review;
    review.reviewer = ctx.accounts.authority.key();
    review.reviewee = user.key();
    review.rating = rating;
    review.context = context;
    review.timestamp = Clock::get()?.unix_timestamp;
    review.review_type = match user.role {
        UserRole::Labour => ReviewType::LabourReview,
        UserRole::Manager => ReviewType::ManagerReview,
    };

    Ok(())
}

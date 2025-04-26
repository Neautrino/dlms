use anchor_lang::prelude::*;
use crate::constants::*;
use crate::states::SystemState;

#[derive(Accounts)]
pub struct InitializeSystem<'info> {
    #[account(
        init,
        seeds = [INITIALIZE.as_bytes()],
        bump,
        payer = authority,
        space = 8 + SystemState::INIT_SPACE,
    )]
    pub system_state: Account<'info, SystemState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn initialize_system(ctx: Context<InitializeSystem>, mint: Pubkey) -> Result<()> {
    let system_state = &mut ctx.accounts.system_state;
    system_state.authority = ctx.accounts.authority.key();
    system_state.mint = mint;
    system_state.labour_count = 0;
    system_state.manager_count = 0;
    system_state.project_count = 0;

    Ok(())
}

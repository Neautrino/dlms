use anchor_lang::prelude::*;

// Seed constants
pub const INITIALIZE: &str = "System";
pub const USER_STATE: &str = "User";
pub const PROJECT_SEED: &str = "Project";
pub const ESCROW_SEED: &str = "Escrow";
pub const APPLICATION: &str = "Application";
pub const ASSIGNMENT: &str = "Assignment";
pub const WORK_VERIFICATION: &str = "Verify";

// Limits
pub const MAX_ADMINS: usize = 10;
pub const MAX_NAME_LENGTH: usize = 100;
pub const MAX_SKILLS: usize = 20;

// Misc
pub const MAX_METADATA_URL_LENGTH: usize = 200;

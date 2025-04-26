use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct SystemState {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub labour_count: u32,
    pub manager_count: u32,
    pub project_count: u32,
    #[max_len(10)]
    pub admins: Vec<Pubkey>,
}

#[account]
#[derive(InitSpace)]
pub struct UserAccount {
    pub authority: Pubkey,
    #[max_len(50)]
    pub name: String,
    #[max_len(250)]
    pub metadata_uri: String,
    pub active: bool,
    pub verified: bool,
    pub rating: u32,
    pub rating_count: u32,
    pub timestamp: i64,
    pub index: u32,
    pub role: UserRole,
    pub spam: bool,
}

#[account]
#[derive(InitSpace)]
pub struct Project {
    pub manager: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(250)]
    pub metadata_uri: String,
    pub daily_rate: u64,
    pub duration_days: u16,
    pub max_labourers: u8,
    pub labour_count: u8,
    pub status: ProjectStatus,
    pub escrow_account: Pubkey,
    pub timestamp: i64,
    pub index: u32,
}

#[account]
#[derive(InitSpace)]
pub struct Review {
    pub reviewer: Pubkey,
    pub reviewee: Pubkey,
    pub rating: u8,
    #[max_len(250)]
    pub context: String,
    pub timestamp: i64,
    pub review_type: ReviewType,
}

#[account]
#[derive(InitSpace)]
pub struct Application {
    pub labour: Pubkey,
    pub project: Pubkey,
    #[max_len(250)]
    pub description: String,
    pub status: ApplicationStatus,
    pub timestamp: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Assignment {
    pub labour: Pubkey,
    pub project: Pubkey,
    pub days_worked: u16,
    pub days_paid: u16,
    pub active: bool,
    pub timestamp: i64,
}

#[account]
#[derive(InitSpace)]
pub struct WorkVerification {
    pub project: Pubkey,
    pub labour: Pubkey,
    pub day_number: u16,
    pub manager_verified: bool,
    pub labour_verified: bool,
    #[max_len(250)]
    pub metadata_uri: String,
    pub timestamp: i64,
    pub payment_processed: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq)]
pub enum UserRole {
    Labour,
    Manager,
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Clone, PartialEq, Eq)]
pub enum ProjectStatus {
    Open,
    InProgress,
    Completed,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, InitSpace, Eq)]
pub enum ApplicationStatus {
    Pending,
    Accepted,
    Rejected,
    Withdrawn,
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Clone, PartialEq, Eq)]
pub enum ReviewType {
    LabourReview,
    ManagerReview,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum AccountType {
    Labour,
    Manager,
}

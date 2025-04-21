use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action")]
    NotAuthorized,

    #[msg("Admin already exists.")]
    AdminAlreadyExists,

    #[msg("Admin not found.")]
    AdminNotFound,

    #[msg("Cannot add more than 10 admins.")]
    AdminLimitReached,

    #[msg("Invalid role. Must be 'labour' or 'manager'.")]
    InvalidRole,

    #[msg("Invalid daily rate")]
    InvalidDailyRate,

    #[msg("Invalid duration")]
    InvalidDuration,

    #[msg("Invalid labourer count")]
    InvalidLabourerCount,

    #[msg("Calculation error")]
    CalculationError,

    #[msg("Insufficient funds")]
    InsufficientFunds,

    #[msg("Wrong token account owner")]
    WrongOwner,

    #[msg("Project is not open")]
    ProjectNotOpen,

    #[msg("Project is full")]
    ProjectFull,

    #[msg("Labour is not active")]
    LabourNotActive,

    #[msg("Application is not pending")]
    ApplicationNotPending,

    #[msg("Invalid project")]
    InvalidProject,

    #[msg("Working day not matching")]
    InvalidDaySequence,

    #[msg("Invalid labour")]
    InvalidLabour,

    #[msg("Invalid manager")]
    InvalidManager,

    #[msg("Wrong Project Status")]
    WrongProjectStatus,

    #[msg("Project is not active")]
    ProjectNotActive,

    #[msg("Project is still active")]
    ProjectStillActive,

    #[msg("Assignment is not active")]
    AssignmentNotActive,

    #[msg("Invalid day number")]
    InvalidDayNumber,

    #[msg("Work already verified")]
    AlreadyVerified,

    #[msg("Invalid rating value (must be 1-5)")]
    InvalidRating,

    #[msg("Invalid escrow account")]
    InvalidEscrowAccount,

    #[msg("Invalid token mint provided.")]
    InvalidTokenMint,

    #[msg("The mint account does not match the system's configured mint.")]
    MintMismatch,
}

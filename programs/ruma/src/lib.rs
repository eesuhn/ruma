use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

declare_id!("E2iAM2RNDLgMAY5jBsr2WiTqL6umZ4wkZhBBvmEBGWJ5");

#[program]
pub mod ruma {
    use super::*;
}

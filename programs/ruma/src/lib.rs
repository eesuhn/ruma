use anchor_lang::prelude::*;

declare_id!("7CNQHU6f1cxCUjkhqCMPN8aEFofREEsVUFsCA72gV6fj");

#[program]
pub mod ruma {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

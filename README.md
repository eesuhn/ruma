## Setting Up Locally

1. Setting up Solana local node with [SETUP.md](./docs/SETUP.md)

2. For client side, navigate to `client/` and run:

   ```bash
   bun install
   ```

3. Make a copy of `.env.example`:

   ```bash
   cp .env.example .env.development
   ```

   > For `NEXT_PUBLIC_RUMA_WALLET`, copy the content from `ruma-wallet.json`

4. Run the client:

   ```bash
   bun run dev
   ```

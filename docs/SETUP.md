## Getting started...

> [!WARNING]
> <i>Remember to `bun install`...</i>

### Setting up Solana in `anchor/`

1. Install [Solana CLI](https://solana.com/docs/intro/installation) v1.18.17:

   > Install with `sh -c "$(curl -sSfL https://release.solana.com/v1.18.17/install)"`

2. Set cluster to local network:

   ```bash
   solana config set -u l
   ```

3. In `anchor/` directory, create a custom keypair file `ruma-wallet.json`, and paste in the secret key:

   ```bash
   touch ruma-wallet.json  # Contact the team for secret key
   ```

   > Or generate a new keypair with `solana-keygen new -o ruma-wallet.json`

4. Create folder `tests/fixtures`

   ```bash
   mkdir -p tests/fixtures
   ```

5. Create a dump of Metaplex Token Metadata:

   ```bash
   solana program dump metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s tests/fixtures/mpl_token_metadata.so -u m
   ```

### Deploying Anchor to local network

1. In `anchor/` directory, start local validator with Token Metadata program, then leave it running:

   ```bash
   solana-test-validator --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s tests/fixtures/mpl_token_metadata.so -r
   ```

   > If you ran this command before, you only need to run
   >
   > ```bash
   > bun run local
   > ```

2. In a new terminal, create an `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   > For example:
   >
   > ```env
   > ANCHOR_PROVIDER_URL=http://127.0.0.1:8899/
   > ANCHOR_WALLET="ruma-wallet.json"
   > ```

3. Configure wallet to `ruma-wallet.json`, and airdrop some tokens:

   ```bash
   solana config set -k ruma-wallet.json
   solana airdrop 100
   ```

4. Build the program, and sync the program IDs:

   ```bash
   anchor build
   ```

   ```bash
   anchor keys sync
   ```

5. Deploy the program to the local network:

   ```bash
   anchor deploy -p ruma --program-keypair target/deploy/ruma-keypair.json
   ```

6. Run tests for Solana program:

   ```bash
   bun test endToEnd
   ```

   > In case of errors, try:
   > 1. Restarting the local validator by running `bun run local`
   > 2. Run `solana config set -k ruma-wallet.json` again

7. In `anchor/`, run this command to sync IDL and program types:

   ```bash
   bun run sync
   ```

   > You need to run this command every time you update the IDL or program types.

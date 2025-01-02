## Setting up `anchor/` for devnet deployment

> [!IMPORTANT]
> Navigate to `client/` before running any of the following commands. <br>
> Remember to run `bun i` to install all the dependencies.

#### 1. Install [Solana CLI v.18.17](https://github.com/solana-labs/solana/releases/tag/v1.18.17)

Install with `sh -c "$(curl -sSfL https://release.solana.com/v1.18.17/install)"`.

#### 2. Set cluster to devnet

```bash
solana config set -u d
```

#### 3. Storing the wallet private keypair

```bash
touch ruma-wallet.json  # Paste the private keypair in this file
```

#### 4. Create `tests/fixtures` directory

```bash
mkdir -p tests/fixtures
```

#### 5. Create Metaplex token metadata

```bash
solana program dump metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s tests/fixtures/mpl_token_metadata.so -u m
```

#### 6. Configure Solana wallet to `ruma-wallet.json`

```bash
solana config set -k ruma-wallet.json
```

#### 7. Update the `.env` file

```bash
cp .env.example .env
```

Replace the values in the `.env` file with your own.

- `ANCHOR_PROVIDER_URL` is the RPC URL of Solana network.
  - For devnet deployment, acquire the RPC URL from online providers. <br> Or use `https://api.devnet.solana.com` by default.
- `ANCHOR_WALLET` is the private keypair of Solana wallet.<br> In this case, it is `"ruma-wallet.json"`.

#### 8. Sync program keys, and build the program

```bash
anchor keys sync
```

```bash
anchor build
```

#### 9. Deploy the program

```bash
anchor deploy -p ruma --provider.cluster d --program-keypair target/deploy/ruma-keypair.json
```

> [!IMPORTANT]
> Save your program ID somewhere. You will need it to deserialize the program IDL.

#### 10. Deserialize the program IDL

```bash
anchor idl init -f target/idl/ruma.json --provider.cluster d [PROGRAM_ID]
```

> Replace `[PROGRAM_ID]` with the program ID you saved in the previous step.

#### 11. Sync the program IDL to `client/`

```bash
bun run sync
```

<p align="center">
    <img src="./docs/banner.png" alt="screenshot" width="380" />
</p>

RUMA — **Solana**-powered dApp that redefines event hosting by creating NFT memories for attendees

![Next.js][next] ![Anchor][anchor] ![Rust][rust] ![Shadcn][shadcn] ![Bun][bun]

- Host events directly on chain
- Provide attendees with unique digital mementos
- Streamline authentication with NFT badges

*Check out our demo video!* <br>
[RUMA - Demo](https://youtu.be/x05mT8t_vkM)

### Setting Up Locally

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

### Contributors

[ChiefWoods](https://github.com/ChiefWoods)
• [eesuhn](https://github.com/eesuhn)
• [Karweiii](https://github.com/Karweiii)

<!-- LINKS -->
[next]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[anchor]: https://img.shields.io/badge/anchor-1f44f2?style=for-the-badge&logo=solana&logoColor=white
[rust]: https://img.shields.io/badge/rust-8b3103?style=for-the-badge&logo=rust&logoColor=white
[shadcn]: https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcn/ui&logoColor=white
[bun]: https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=fff&style=for-the-badge

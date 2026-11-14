# miyagi.study

Landing page for **Miyagi**, built at SanD Hacks 2026 (UC San Diego). Miyagi turns any tutorial into an auto-graded lab.

- Live at https://miyagi.study, served by GitHub Pages from `main` (root).
- `CNAME` holds the custom domain. Don't delete it, or Pages drops the domain.
- One static page, `index.html`. The bonsai (`tree-full.svg`) and wordmark (`wordmark.svg`) from the Miyagi brand kit are inlined so the load animation can grow the tree part by part. Favicons, `og-image.png` and `fonts/GoogleSansFlex.woff2` (SIL OFL, see `fonts/OFL.txt`) come from the same kit.
- Follow the kit's `BRAND.md`: paper background, ink buttons, green only means passed, no gradients or glows.

## Download button

The button finds the newest GitHub release in this repo and links to its first `.dmg`, `.zip` or `.pkg` asset. To ship a build, publish a release here and attach the Mac build. Until a release exists, the button says the build isn't posted yet.

## DNS (at Porkbun, the registrar)

| Type | Host | Value |
|---|---|---|
| A | `@` | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| AAAA | `@` | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 |
| CNAME | `www` | adrian-erlikhman.github.io |

The domain was registered free through GoDaddy Registry's MLH offer (Best Domain Name from GoDaddy Registry track).

# miyagi.study

Landing page for **Miyagi**, built at SanD Hacks 2026 (UC San Diego). Miyagi turns any tutorial into a graded lab: the video waits at each step until your own code, terminal or training run passes that step's check.

- Live at https://miyagi.study, served by GitHub Pages from `main` (root).
- `CNAME` holds the custom domain. Don't delete it, or Pages drops the domain.
- The page is one static file, `index.html`. Colors are tokens at the top of its `<style>` block.

## DNS (at Porkbun, the registrar)

| Type | Host | Value |
|---|---|---|
| A | `@` | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| AAAA | `@` | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 |
| CNAME | `www` | adrian-erlikhman.github.io |

The domain was registered free through GoDaddy Registry's MLH offer (Best Domain Name from GoDaddy Registry track).

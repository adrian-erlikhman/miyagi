# miyagi.study

Landing page for **Miyagi**, built at SanD Hacks 2026 (UC San Diego). Miyagi turns any tutorial into an auto-graded lab.

- Live at https://miyagi.study, served by GitHub Pages from `main` (root).
- `CNAME` holds the custom domain. Don't delete it, or Pages drops the domain.
- One static page, `index.html`. The bonsai (`tree-full.svg`) and wordmark (`wordmark.svg`) from the Miyagi brand kit are inlined. With WebGL, a three.js scene (loaded from jsDelivr, pinned to three@0.160.0) builds a 3D bonsai from that SVG's shapes. Without WebGL, or with reduced motion on, the flat logo page shows instead. Favicons, `og-image.png` and `fonts/GoogleSansFlex.woff2` (SIL OFL, see `fonts/OFL.txt`) come from the same kit.
- Follow the kit's `BRAND.md`: paper background, ink buttons, green only means passed, no gradients or glows.

## The way in: break the board

With 3D on, the page opens blank: just the dots and a wooden board ("Break the board."). The tree is hidden behind it. A click, tap, space, or the first scroll or swipe breaks it. It cracks along a jagged line, the halves and splinters fly, and there's a short synthesized crack sound. As it breaks, the whole bonsai grows in where the board was (about 1 s: pot, trunk, branches, then the pads pop), turning to face you. Scrolling stays locked until the break is done (1.35 s, timed by the clock).

Then scrolling tells the story: the tree steps right while "Watching isn't learning." and "miyagi waits until your code works." light up on the left (centered under the tree on phones), then it rises over the wordmark, "Wax on, wax off." and the downloads. The caption timing is `CAP_AT` (shares of the scroll); the camera path is `camGoal()`.

The board shows every time the page opens, including a plain visit to https://miyagi.study/ and a reload (the page always starts at the top, `history.scrollRestoration = 'manual'`). Only a link with a `#hash` skips it; then the tree grows in on load. Browsers without WebGL, or with reduced motion on, never get the board.

## See it work

Under the ending, a five-step player shows the real app: `demo/01-ask.webp` … `demo/05-passed.webp` (1600×1000). They were made from the app's own screenshots in the team repo (`app/agents/shots/`: `launcher-03-results`, `drawer-08-stage`, `cards-offtrack-stage`, `diagrams-heatmap`, `cards-success`). To refresh one, replace its file at the same size. Each `<img>` sets where its slow zoom lands (`--ox`, `--oy`, `--z`).

## Demo video

The final screen has a "Watch the demo" button that plays the video in a pop-up. Set `DEMO_URL` in `index.html` (search for `var DEMO_URL`) to a YouTube, Loom or Vimeo link, or an `.mp4` file in this repo. While it's empty, the button says the demo is coming soon.

## Download buttons

Mac and Windows are two equal buttons side by side (`a[data-dl="mac"]` and `a[data-dl="win"]`, each with a note in `[data-dl-note]`). There's no OS detection and no "also on" link (Adrian, Sat 7:30 PM). Both link straight to fixed release assets in this repo, with no API call. After a click, the button's note shows its first-open tip (right-click › Open on Mac; More info › Run anyway on Windows).

- Mac: release `mac`, asset `Miyagi-Mac.zip` (Apple silicon, macOS 13+), from CI's `mac-zip` artifact, posted by the Windows sync agent. `var MAC_READY = true` keeps the button on; set it to `false` only to pull the Mac build.
- Windows: release `windows`, asset `Miyagi-Windows-Setup.exe` (Windows 10 and 11), rebuilt and re-uploaded by the Windows sync agent when the app changes.

## DNS (at Porkbun, the registrar)

| Type | Host | Value |
|---|---|---|
| A | `@` | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| AAAA | `@` | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 |
| CNAME | `www` | adrian-erlikhman.github.io |

The domain was registered free through GoDaddy Registry's MLH offer (Best Domain Name from GoDaddy Registry track).

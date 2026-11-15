# miyagi.study

Landing page for **Miyagi**, built at SanD Hacks 2026 (UC San Diego). Miyagi turns any tutorial into an auto-graded lab.

- Live at https://miyagi.study, served by GitHub Pages from `main` (root).
- `CNAME` holds the custom domain. Don't delete it, or Pages drops the domain.
- One static page, `index.html`. The bonsai (`tree-full.svg`) and wordmark (`wordmark.svg`) from the Miyagi brand kit are inlined. With WebGL, a three.js scene (loaded from jsDelivr, pinned to three@0.160.0) builds a 3D bonsai from that SVG's shapes. On top of the SVG's shapes it adds detail made in code: a tiling bark texture (color and bump) on every limb, surface roots at the base and twigs under each pad that grow in with the tree, leaf tufts that are each turned and tinted a little differently with lighter new growth on top, gravel and moss on the soil, and a clay speckle on the pot. Without WebGL, or with reduced motion on, the flat logo page shows instead. Favicons, `og-image.png` and `fonts/GoogleSansFlex.woff2` (SIL OFL, see `fonts/OFL.txt`) come from the same kit.
- Follow the kit's `BRAND.md`: paper background, ink buttons, green only means passed, no gradients or glows.

## The way in: break the board

With 3D on, the page opens blank: just the dots and a wooden board ("Break the board."). The tree is hidden behind it. A click, tap, space, or the first scroll or swipe breaks it. It cracks along a jagged line, the halves and splinters fly, and there's a short synthesized crack sound. As it breaks, the pot lands where the board was and the bonsai grows in front of you: the trunk rises, each branch reaches out when the trunk gets to it, then the pads pop, while the camera rises and pulls back and the tree turns to face you. It takes about 2.7 s from the hit (`GROW_AT`, `GROW_S` in `index.html`). Scrolling stays locked until the tree has fully grown, timed by the clock.

Then scrolling tells the story: the tree steps right while "Watching isn't learning." and "miyagi waits until your code works." light up on the left (the word "miyagi" turns the logo's pad green, `#1f9b45`, as it lights) (centered under the tree on phones), then it rises over the wordmark, "Wax on, wax off." and the downloads. The caption timing is `CAP_AT` (shares of the scroll); the camera path is `camGoal()`.

The board shows every time the page opens, including a plain visit to https://miyagi.study/ and a reload (the page always starts at the top, `history.scrollRestoration = 'manual'`). Only a link with a `#hash` skips it; then the tree grows in on load. Browsers without WebGL, or with reduced motion on, never get the board.

## See it work

On desktop (wider than 760px) the section runs the **real app** live: `live/` is the overlay's browser stage, built from the team repo (michae6345-crypto/sandhacks-tutor, `app/`), shown in a same-origin iframe of `/live/?scenario=full&clean` at its native 1600×1000 and scaled to the column with a CSS transform. Windows visitors get `&os=win` so the app shows Windows keys. The iframe is only created when the section is within 250px of the viewport, so the page doesn't load it up front.

Under it, an eight-step tour, one step at a time: ask → it picks the best tutorial → the video becomes steps → the video waits for your code → off track → Explain / Diagram / Hint / Show me → fix it → pass and play on. Each step drives the app, then holds while its bar fills (`hold` in `STEPS`) and a white ring marks the part of the app it's about (`focus`, found by text in the app's DOM; the rest of the stage dims a little). Then the next step starts by itself. Visitors can use ‹ › (or the arrow keys), click any bar to jump, pause, or click the stage and use the app themselves (Ctrl K / ⌘K); a real click or key in the stage stops the tour and Play picks it up again. The tour drives the app the way a person would: real key events, typing into its launcher, clicking its own buttons; the app's scripted mock engine answers. Going back, or jumping ahead, reloads the stage and replays up to that step quickly: the page runs the iframe's `setTimeout` on its own clock (`speed`). All of it is the `"See it work", live` script in `index.html`; the step text is `STEPS`.

The current build is from `origin/main` 7c41376 (Sat Nov 14, 8:34 PM). To refresh it with a newer app:

```bash
git -C repo fetch origin
git -C repo worktree add ../stage-src origin/main --detach
cd ../stage-src/app && npm ci --ignore-scripts
npx vite build --config vite.web.config.ts --outDir "<path to miyagi-site>/live" --emptyOutDir --base ./
git -C <repo> worktree remove ../stage-src --force
```

If the app's flow or wording changes, check that the tour still finds what it waits for and rings (`waitText(...)` and `focus` in `STEPS`: "full course", "Step 4 of", "Step 5 of", "Chapters", the `aspect-video` player, "Loss is flat at 0.25", the Explain / Diagram / Hint / Show me buttons, the "Fix it" button, "Good. Now the next one.").

On phones, with reduced motion, or if the iframe fails to load, a five-step player of screenshots shows instead: `demo/01-ask.webp` … `demo/05-passed.webp` (1600×1000, under 150 KB each), captured from the same build in headless Chrome. To refresh one, replace its file at the same size. Each `<img>` sets where its slow zoom lands (`--ox`, `--oy`, `--z`).

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

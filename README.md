# miyagi.study

Landing page for **Miyagi**, built at SanD Hacks 2026 (UC San Diego). Miyagi turns any tutorial into an auto-graded lab.

- Live at https://miyagi.study, served by GitHub Pages from `main` (root).
- `CNAME` holds the custom domain. Don't delete it, or Pages drops the domain.
- One static page, `index.html`. The bonsai (`tree-full.svg`) and wordmark (`wordmark.svg`) from the Miyagi brand kit are inlined. With WebGL, a three.js scene (loaded from jsDelivr, pinned to three@0.160.0) builds a 3D bonsai from that SVG's shapes. On top of the SVG's shapes it adds detail made in code: a tiling bark texture (color and bump) on every limb, surface roots at the base and twigs under each pad that grow in with the tree, leaf tufts that are each turned and tinted a little differently with lighter new growth on top, gravel and moss on the soil, and a clay speckle on the pot. Without WebGL, or with reduced motion on, the flat logo page shows instead. Favicons, `og-image.png` and `fonts/GoogleSansFlex.woff2` (SIL OFL, see `fonts/OFL.txt`) come from the same kit.
- Follow the kit's `BRAND.md`: paper background, ink buttons, green only means passed, no gradients or glows.

## The opening

With 3D on, the page opens on the bonsai growing in: the pot lands, the trunk rises, each branch reaches out when the trunk gets to it, then the pads pop, while the camera rises and pulls back and the tree turns to face you (about 2.5 s, `GROW_AT` and `GROW_S` in `index.html`). Browsers without WebGL, or with reduced motion on, get the flat logo page instead.

Then scrolling tells the story: the tree steps right while "watching isn't learning." and "miyagi waits until you've done it." light up on the left (the word "miyagi" turns the logo's pad green, `#1f9b45`, as it lights; centered under the tree on phones), then it rises over the wordmark, "wax on, wax off." and the downloads. The caption timing is `CAP_AT` (shares of the scroll); the camera path is `camGoal()`.

Site copy is lowercase, like the wordmark.

## See it work

A pinned scroll story built on real screen recordings of miyagi on a Mac (Nov 20). The section is 1500vh tall and its frame sticks while you scroll, and scrolling scrubs the footage forward and back. One camera zooms to where the action is, one callout at a time points at what matters, and clicks leave a ring. Sound is opt-in (the toggle bottom-right), synthesized with Web Audio.

The footage is `story/miyagi.mp4` (1920×1056, 24 fps, a keyframe every second so seeking is quick), cut by `devpost/video/real/build_cut.py` in the team folder from two takes. Take A (Nov 19) is the video way: ask, pick a real tutorial, the lesson opens beside VS Code, and the video waits for your checks. Take B (Nov 15) is a lesson from scratch: the loss is stuck, miyagi says why, points at the line and hints, you fix it, and it learns (0.82 → 0.0009). In the `"See it work"` script in `index.html`, `CAM` is the camera, `NOTE_D` the callouts, `EV` the clicks and sounds, and `PACE` how much scroll each stretch of footage gets. All of them are written in each take's own seconds through `A(t)` and `B(t)`.

Seeking needs HTTP Range, which GitHub Pages serves. Python's `http.server` doesn't, so preview locally with `devpost/video/real/serve_site.py`.

Phones (under 1024px) and reduced motion get the steps as cards, with frames from the same footage: `story/1.webp` … `story/5.webp`. `story/poster.jpg` shows until the video loads.

## See it work button

The demo video is gone (Nov 20). Under the downloads, a "see it work" button scrolls down to the "see it work." story (`[data-see]` → `#see-it`).

## Download buttons

Mac and Windows are two equal buttons side by side (`a[data-dl="mac"]` and `a[data-dl="win"]`, each with a note in `[data-dl-note]`). There's no OS detection and no "also on" link (Adrian, Sat 7:30 PM).

Since Nov 20 the downloads are behind a code. The first click opens a code field under the buttons (`form[data-code]`). The release links aren't in the page as plain text: each one is sealed with the code (PBKDF2-SHA256, then AES-GCM) in `SEALED` in `index.html`, so a wrong code can't open it. The code is case- and space-insensitive and isn't stored in this repo. A right code is kept in that browser's localStorage (`miyagi-code`), so later clicks download straight away. To change the code or a link, re-seal both links with the seal script (kept outside this public repo) and paste its output into `SEALED`. After a download starts, the button's note shows its first-open tip (right-click › Open on Mac; More info › Run anyway on Windows).

The code keeps casual visitors out. It doesn't lock the files themselves: the releases on this public repo can still be reached from GitHub.

- Mac: release `mac`, asset `Miyagi-Mac.zip` (Apple silicon, macOS 13+), from CI's `mac-zip` artifact, posted by the Windows sync agent. `var MAC_READY = true` keeps the button on; set it to `false` only to pull the Mac build.
- Windows: release `windows`, asset `Miyagi-Windows-Setup.exe` (Windows 10 and 11), rebuilt and re-uploaded by the Windows sync agent when the app changes.

## DNS (at Porkbun, the registrar)

| Type | Host | Value |
|---|---|---|
| A | `@` | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| AAAA | `@` | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 |
| CNAME | `www` | adrian-erlikhman.github.io |

The domain was registered free through GoDaddy Registry's MLH offer (Best Domain Name from GoDaddy Registry track).

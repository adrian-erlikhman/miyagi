# miyagi.study

Landing page for **Miyagi**, built at SanD Hacks 2026 (UC San Diego). Miyagi turns any tutorial into an auto-graded lab.

- Live at https://miyagi.study, served by GitHub Pages from `main` (root).
- `CNAME` holds the custom domain. Don't delete it, or Pages drops the domain.
- One static page, `index.html`. The bonsai (`tree-full.svg`) and wordmark (`wordmark.svg`) from the Miyagi brand kit are inlined. With WebGL, a three.js scene (loaded from jsDelivr, pinned to three@0.160.0) builds a 3D bonsai from that SVG's shapes. On top of the SVG's shapes it adds detail made in code: a tiling bark texture (color and bump) on every limb, surface roots at the base and twigs under each pad that grow in with the tree, leaf tufts that are each turned and tinted a little differently with lighter new growth on top, gravel and moss on the soil, and a clay speckle on the pot. Without WebGL, or with reduced motion on, the flat logo page shows instead. Favicons, `og-image.png` and `fonts/GoogleSansFlex.woff2` (SIL OFL, see `fonts/OFL.txt`) come from the same kit.
- Follow the kit's `BRAND.md`: paper background, ink buttons, green only means passed, no gradients or glows.

## The opening

With 3D on, the page opens on the bonsai growing in: the pot lands, the trunk rises, each branch reaches out when the trunk gets to it, then the pads pop, while the camera rises and pulls back and the tree turns to face you (about 2.5 s, `GROW_AT` and `GROW_S` in `index.html`). Browsers without WebGL, or with reduced motion on, get the flat logo page instead.

Then scrolling tells the story: the tree steps right while "watching isn't learning." and "miyagi waits until your code works." light up on the left (the word "miyagi" turns the logo's pad green, `#1f9b45`, as it lights; centered under the tree on phones), then it rises over the wordmark, "wax on, wax off." and the downloads. The caption timing is `CAP_AT` (shares of the scroll); the camera path is `camGoal()`.

Site copy is lowercase, like the wordmark.

## See it work

A pinned scroll story, the way the Hivemind site tells its steps. The section is 720vh tall and its frame sticks while you scroll; `p` (0 to 1) is how far through it you are, eased a little, and the whole desktop is drawn from `p`, so it scrubs forward and back with the scroll. On the left, six steps (ask → it builds the lesson → where to type → not yet → a hint → watch it learn) light up in turn; clicking one scrolls there. On the right, a macOS desktop drawn in HTML at 1600×1000 and scaled to fit: VS Code with `nn.py`, the miyagi island, launcher, drawer with the plan and checks, the Not yet and hint cards, the live network panel and the terminal.

The lesson is the neural net from the demo (a 1-4-4-1 net learning sin(x) in NumPy). Its numbers come from really running that code: with zero weights the loss stays at 0.4900; with `np.random.randn` weights (seed 0) it falls from 0.8187 to 0.0009 by epoch 18,000, and the network panel draws the weights that run learned (blue positive, brown negative). Everything is in the `"See it work"` script in `index.html`: the step text is `STEPS`, the code is `HEAD`/`NET`/`FIX`/`REST`, and `draw(p)` holds the timeline.

Phones (under 1024px) and reduced motion get the same six steps as cards with real frames from the Mac app: `walk/1-ask.webp` … `walk/6-learns.webp` (1200×800), made from the Devpost gallery images.

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

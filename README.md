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

A pinned scroll story, the way the Hivemind site tells its steps. The section is 720vh tall and its frame sticks while you scroll; `p` (0 to 1) is how far through it you are, eased a little, and the whole desktop is drawn from `p`, so it scrubs forward and back with the scroll. On the left, six steps (ask → it builds the lesson → where to type → not yet → a hint → watch it learn) light up in turn; clicking one scrolls there. On the right, a macOS desktop drawn in HTML at 1600×1000 and scaled to fit: VS Code with `nn.py`, the miyagi island, launcher, drawer with the plan and checks, the Not yet and hint cards, the live network panel and the terminal.

The lesson is the neural net from the demo (a 1-4-4-1 net learning sin(x) in NumPy). Its numbers come from really running that code: with zero weights the loss stays at 0.4900; with `np.random.randn` weights (seed 0) it falls from 0.8187 to 0.0009 by epoch 18,000, and the network panel draws the weights that run learned (blue positive, brown negative). Everything is in the `"See it work"` script in `index.html`: the step text is `STEPS`, the code is `HEAD`/`NET`/`FIX`/`REST`, and `draw(p)` holds the timeline.

Phones get the same animated story (Nov 21). Held upright (`TALL` in the script: the frame is taller than wide), the screen runs full width between two dark bands, the camera crops it closer (`PCAM`, the same moves as `CAM` with a few shots aimed elsewhere), and each callout sits in the band above or below the screen with its line to the spot. On its side, a small screen gets smaller callouts (`.small`). Only reduced motion gets the steps as cards, with real frames from the Mac app: `walk/1-ask.webp` … `walk/6-learns.webp` (1200×800), made from the Devpost gallery images.

## See it work button

The demo video is gone (Nov 20). Under the downloads, a "see it work" button scrolls down to the "see it work." story (`[data-see]` → `#see-it`).

## Download buttons

Mac and Windows are two equal buttons side by side (`a[data-dl="mac"]` and `a[data-dl="win"]`, each with a note in `[data-dl-note]`). There's no OS detection and no "also on" link (Adrian, Sat 7:30 PM).

Since Nov 20 the downloads are behind a code. The first click opens a code field under the buttons (`form[data-code]`). The release links aren't in the page as plain text: each one is sealed with the code (PBKDF2-SHA256, then AES-GCM) in `SEALED` in `index.html`, so a wrong code can't open it. The code is case- and space-insensitive and isn't stored in this repo. A right code is kept in that browser's localStorage (`miyagi-code`), so later clicks download straight away. To change the code or a link, re-seal both links with the seal script (kept outside this public repo) and paste its output into `SEALED`. After a download starts, the button's note shows its first-open tip (Open Anyway in Privacy & Security on Mac; More info › Run anyway on Windows).

The code keeps casual visitors out. It doesn't lock the files themselves: the releases on this public repo can still be reached from GitHub.

- Mac: release `mac`, asset `Miyagi-Mac.dmg` (Apple silicon, macOS 13+). Since Nov 25 the sealed Mac link points at the .dmg, not `Miyagi-Mac.zip`; the release has no zip. `var MAC_READY = true` keeps the button on; set it to `false` only to pull the Mac build.
- Windows: release `windows`, asset `Miyagi-Windows-Setup.exe` (Windows 10 and 11), rebuilt and re-uploaded by the Windows sync agent when the app changes.

## Search engines

What a search engine reads is in the `<head>` of `index.html`: the title, the description, the canonical link, and one JSON-LD block (site name, the app, and the questions). `robots.txt` allows every crawler and points to `sitemap.xml`, which lists every page.

- The pages under `learn/` (one per search, such as "learn python by doing") are drafts. Each opens with a short lesson the visitor does in the page (`learn/lab.js`: a small Python, one NumPy line, a pretend Git repository), then lists the plan's lessons, what passes each one, and the project at the end. Nothing loads from another host. The waitlist field posts to the same Loops form as the home page, with the page as its source.
- The JSON-LD questions must match the "questions." section word for word. Change both together.
- Add a new page to `sitemap.xml` and give it its own `<link rel="canonical">`.
- Don't link the GitHub releases from here: downloads are behind a code.
- `google2a9593ca4bc38729.html` proves to Google Search Console that we own the site. Don't delete it, or the site drops out of Search Console.

## DNS (at Porkbun, the registrar)

| Type | Host | Value |
|---|---|---|
| A | `@` | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| AAAA | `@` | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 |
| CNAME | `www` | adrian-erlikhman.github.io |

The domain was registered free through GoDaddy Registry's MLH offer (Best Domain Name from GoDaddy Registry track).

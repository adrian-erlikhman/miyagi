# miyagi privacy policy

**beta** · last updated Nov 21, 2026

This policy covers the beta of miyagi. It may change before our public launch, and when it does, the date above will change too.

## Who we are

miyagi is made by the miyagi team. Write to us at [hello@miyagi.study](mailto:hello@miyagi.study) about anything in this policy.

## The short version

- miyagi is a Mac app that follows along while you learn from a coding tutorial.
- During a lesson, miyagi sends screenshots of your screen, text on your screen, your code and your questions to Anthropic, the company that makes Claude, so it can check your work and help. Anything visible on your screen can be in a screenshot.
- Anthropic is the only AI company miyagi sends your data to. These calls go through our server, which passes them on and keeps counts, not your work. If you add your own Anthropic key, they go straight to Anthropic.
- Videos play in YouTube's own player, so YouTube sees what you watch.
- Signing in is optional. If you sign in with Google, our server links this Mac's install to your account ID.
- Crash reports and usage counts are off unless you turn them on.
- We don't sell your data, we don't use it for ads, and we don't train AI on it.

## What miyagi sees and where it goes

miyagi needs to see your work to help with it. Here is what it reads, and where each thing goes.

| What | What happens | Where it goes |
| --- | --- | --- |
| Your screen | During a lesson, screenshots and screen text. Text from password apps dropped. | To Anthropic |
| Your code | The step's code, when miyagi checks your work or helps. | To Anthropic |
| Your editor | miyagi reads VS Code here to follow your step. | Read on this Mac, then sent as your code |
| Your questions | What you type to miyagi, and code you pick for Explain this. | To Anthropic |
| Your searches | What you ask to learn goes to YouTube search and the AI. | To YouTube and Anthropic |
| Lesson videos | The video's captions and what you want to learn, to Anthropic. | To Anthropic |
| Video player | Videos play in YouTube's player, which sees what you watch. | To YouTube |
| Your sign-in | Google sign-in through Supabase. The session stays encrypted here. | To Supabase |
| Account link | When you sign in, miyagi's server ties this Mac to your account. | To miyagi |
| miyagi's server | Passes AI calls on. Keeps counts and cost, never your work. | To miyagi |
| Your API key | Locked by your Keychain, sent only to Anthropic. | On this Mac |
| Lesson progress | Lesson folders and progress, kept in ~/miyagi on this Mac. | On this Mac |
| Crash reports | Only the kind of error, never its text. Off unless you share. | To miyagi, if on |
| Usage counts | Lesson and step counts. Never your code or screen. | To miyagi, if on |

### Your screen

- **When.** miyagi reads your screen only while a lesson step is active. When no step is running, it stops.
- **What.** Screenshots of your screen, made smaller before they're sent. The text on your screen, which miyagi reads on this Mac with macOS text recognition and accessibility features. The name of the app in front.
- **How often.** While a step is active and your screen changes, miyagi sends a screenshot to Anthropic about every 5 seconds to see how you're doing. It also sends one when it points at something on your screen or answers a question.
- **What is removed first.** In text read from your screen, miyagi replaces email addresses, card numbers, US phone numbers and US social security numbers. It drops text from password managers (1Password, Bitwarden, Dashlane, LastPass, Keychain Access, Passwords) and from Messages. It also replaces text that looks like an API key, a token or a password, and blacks out the rows of the screen where it found one in the screenshots it sends. miyagi finds these by their shape, so it can miss some.
- **Password apps in screenshots.** In the regular screenshots during a step, miyagi blacks out the windows of those password managers and Messages, and it skips the screenshot while one of them is the app in front. Screenshots taken to point at something or to answer a question don't black them out.
- **What is not removed.** miyagi sends your whole screen, not just your work. It doesn't remove names, addresses, other chat or email apps, or browser tabs. **Anything on your screen, including other people's messages, can be in a screenshot.** Close or hide anything private before a lesson.
- **Why.** To tell whether you've done a step, to point at the right place, and to answer when you ask for help.

### Your code and VS Code

miyagi's companion extension for VS Code lets it follow your step. On this Mac, it reads the file you're working on (including changes you haven't saved), your open tabs, where you're typing and what you've selected, and the commands you run in VS Code's terminal with the last lines of their output.

miyagi sends to Anthropic:

- the step's code and the files a step checks, when it checks your work or helps;
- error messages and recent output from commands you ran, when it helps you with an error;
- the questions you type to miyagi;
- text you select for "Explain this", with up to 12 lines around it and the file's name and location;
- when it builds a lesson, to fit the lesson's checks to your lesson folder: the list of files in that folder, up to 60,000 characters of their contents, and the folder's path, which includes your Mac username. Files and folders whose names start with a dot (such as `.env`) are skipped, and so are folders like `node_modules`. Keys or passwords written inside the other files are not removed from this scan.

Before your code, "Explain this" text and your questions are sent, miyagi replaces text that looks like an API key, a token or a password, and it hides the values in files like `.env`. As on screen, it finds these by their shape and can miss some. The lesson folder scan above is sent as it is.

### Building a lesson

- **From a video.** miyagi reads the video's public YouTube page and its captions from your Mac. It sends the video's title, description, chapters and captions, with what you want to learn, to Anthropic, which writes the lesson's steps.
- **Without a video** ("Just teach me"). miyagi sends what you want to learn to Anthropic, which may search the web to research the lesson.

### Finding tutorials

When you ask miyagi to find something to learn, the words you type go to YouTube's search, straight from your Mac, and to Anthropic, which may use its web search to find and rank videos.

### Videos and YouTube

miyagi plays tutorials in YouTube's embedded player. YouTube, which is part of Google, gets your IP address, the videos you watch and how you play them, and can keep its own cookies in the miyagi app.

miyagi uses YouTube API Services. Google's Privacy Policy applies to what YouTube collects: [policies.google.com/privacy](https://policies.google.com/privacy). Watching YouTube in miyagi is also covered by the [YouTube Terms of Service](https://www.youtube.com/t/terms).

### Signing in (optional)

You can use miyagi without an account. If you sign in with Google, Google shares your name, email address and basic profile with Supabase, the service we use for sign-in. Supabase keeps your account and a record of your sign-ins. On this Mac, your session is stored encrypted with a key from your Keychain.

### miyagi's server

- On first launch, the app gets an install token from our server. It sends the app version, the macOS version and the chip type. The token is stored encrypted on this Mac.
- **If you sign in, our server links this install to your account.** The app sends your install token and your sign-in token. Our server checks the sign-in and keeps your account ID (not your name or email) next to this install. Signing out does not undo the link. If someone else signs in on this Mac, the link moves to their account.
- Our server passes your screenshots, code and questions to Anthropic and returns the answer. **It does not store them.**
- It stores, for each install: a fingerprint of the install token (not the token), the app version, the platform and the day it started; daily counts of requests, with their size and cost, by AI model and kind of request; and the account link, if you signed in. If you turn on crash reports and usage counts, it also keeps daily counts of those.
- Its request logs show the time, the kind of request, the AI model, sizes, a short install ID and, if you signed in, your account ID.
- It sees your IP address, and uses it only in memory to limit how often new installs are made. It doesn't store it.
- Our server runs on Render.

### Crash reports and usage counts

These are off for everyone unless you turn on "Share crash reports and usage" in Settings › Privacy. Nothing is sent before you're past sign-in and setup. When it's on, miyagi sends:

- that the app was installed (with the app version, the system and the chip type) and that setup finished;
- lesson counts: a lesson was built (how many steps, how it was built), a step passed or failed its check, a hint was used, a lesson was finished (steps passed and skipped, minutes) or left (a one-word reason);
- for each crash, only what kind of error it was and the app version. The error text stays on this Mac.

They never include your code, files, screen text, file paths or anything you typed. They go to our server with your install token, so they're tied to this install, and to your account if you signed in. Turning the switch off stops sending right away and drops anything not yet sent.

### Other connections

- **Updates.** About every 6 hours, the app checks GitHub for a new version. GitHub sees your IP address. The check sends nothing about you.
- **Setup.** miyagi installs its companion extension in VS Code, and Microsoft's Python and Jupyter extensions from the VS Code Marketplace. Those extensions follow VS Code's own settings, including its telemetry setting.
- **Starter files.** If a tutorial links starter files (on GitHub or Google Drive, for example), miyagi may download them into your lesson folder.

### What stays on this Mac

Your API key, your sign-in session and your install token, which are encrypted. Your settings. Your lesson folders and progress in ~/miyagi. Cached searches, lessons and video captions. Logs, the local error log and crash reports. We don't receive any of these. If you turn on crash sharing, we get only the kind of each error.

## Who receives your data

| Who | What they get | Why | How long |
| --- | --- | --- | --- |
| Anthropic | Screenshots, screen text, code, files, questions, video captions and what you want to learn, through our server | To check your work, coach you, and build and find lessons | Under Anthropic's commercial terms, which don't let it train its models on this data |
| Supabase | Your Google name, email address and basic profile, and a record of your sign-ins | Sign-in | Until you ask us to delete your account |
| Render | What passes through our server, while it passes, and our server's stored counts and logs | Hosts our server | Stored data until it's deleted; logs under Render's log retention |
| YouTube (Google) | Your IP address, your searches and the videos you watch | Plays videos and finds tutorials | Under Google's Privacy Policy |
| GitHub | Your IP address | Update checks and downloads | Under GitHub's Privacy Statement |
| Microsoft | Your IP address | VS Code extensions during setup | Under Microsoft's privacy terms |

Anthropic, Supabase and Render handle this data to run miyagi for us. YouTube, GitHub and Microsoft act on their own.

**If you add your own Anthropic API key,** calls go straight from your Mac to Anthropic, not through our server, under your own agreement with Anthropic.

## What we don't do

- We don't sell your data or share it for advertising. Nothing in miyagi tracks you across other sites or apps. Because we don't track you, we don't change anything when your browser or system sends a Do Not Track or Global Privacy Control signal.
- We don't train AI models on your screen, your code or your questions.
- We don't look for health, money or other sensitive information. If a screenshot catches some, it's used only to answer that request, and our server doesn't keep it.

## How long we keep it

| Where | What | How long |
| --- | --- | --- |
| Your Mac | Everything in "What stays on this Mac" | Until you delete it (see below) |
| Our server | Install record, daily counts, account link | Until you ask us to delete it. We don't delete it automatically yet. |
| Our server's logs, at Render | Request log lines | As long as Render keeps logs for our plan |
| Supabase | Your account | Until you ask us to delete it |
| Anthropic | What the AI calls carried | Under Anthropic's terms |

## Deleting your data

In Settings › Privacy, Delete my data says:

> Erases keys, settings and sign-in on this Mac. Cannot be undone.

It asks once more before it deletes:

> Signs you out. Lesson folders in ~/miyagi stay. Cannot be undone.

It erases your API key, resets your settings, removes your sign-in on this Mac and signs you out. It also removes the note of your account link on this Mac.

It does not remove your install token, your lesson folders and progress in ~/miyagi, cached searches, lessons and captions, logs and crash reports, YouTube's cookies in the app, or the VS Code extensions. It does not delete anything on our server or at Supabase.

To remove everything from your Mac: quit miyagi, move the app to the Trash, delete the `miyagi` folder in your home folder (~/miyagi), delete ~/Library/Application Support/miyagi, and uninstall the miyagi companion extension in VS Code.

**To delete your account and what our server keeps,** email [hello@miyagi.study](mailto:hello@miyagi.study). There's no way to do this in the app yet. We'll confirm when it's done. If you never signed in, our server doesn't know who you are: it only holds counts tied to an install token.

## Children and teens

- miyagi is for people 13 and older. If you're under 13, please don't use miyagi. We don't knowingly collect personal information from children under 13.
- **Parents:** if you believe a child under 13 used miyagi, email [hello@miyagi.study](mailto:hello@miyagi.study) and we'll delete what we hold about them.
- If you're under 18, a parent or guardian needs to agree to our [terms](https://miyagi.study/terms/) for you. Parents and guardians can ask us to see or delete their teen's data.
- Everyone gets the same privacy defaults: crash and usage sharing off, no public profile, no ads.
- miyagi's coach is an AI. It can be wrong.

## Your choices and rights

Anyone can ask us what we hold about them, ask us to correct it, or ask us to delete it. Email [hello@miyagi.study](mailto:hello@miyagi.study). We answer within 30 days.

We offer miyagi in the United States for now. Our providers may process data in the United States and other countries.

## Security

Secrets on your Mac (your API key, your sign-in session and your install token) are encrypted with macOS's secure storage. The app talks to our server over HTTPS. Our server stores only a fingerprint of your install token, not the token itself, and it doesn't store your screenshots, code or answers. No system is perfectly secure. If a breach affects your personal information, we'll tell you as the law requires.

## The miyagi.study website

The website sets no cookies and has no analytics, ads or trackers. If you enter a download code, your browser remembers it for this site until you clear the site's data. The early access form opens your own email app; the site doesn't send it anywhere.

The site is hosted on GitHub Pages, so GitHub sees your IP address when you visit. Parts of the home page load from other servers, which also see your IP address: jsDelivr (code for the 3D bonsai and smooth scrolling) and YouTube's image server (video thumbnails). Downloads come from GitHub. This page and the terms page load nothing from other servers.

## Changes

If this policy changes, we'll update the date at the top. If a change would let us use your data in a new way, we'll ask you first, and it won't apply to data we collected before.

## Contact

[hello@miyagi.study](mailto:hello@miyagi.study), for privacy questions, deletion requests, support and copyright notices. Our [terms](https://miyagi.study/terms/) cover the rest.

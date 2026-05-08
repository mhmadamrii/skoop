MASTER BRIEF (paste this first, every time)

Designing mobile screens for "Skoop" — a short-form educational video app for
Southeast Asia, Indonesia-leading. Target audience is 18–35, mobile-native,
currently scrolling TikTok/Reels. The product copies TikTok's swipe loop exactly
(vertical feed, autoplay, audio-on, swipe-up to skip, double-tap to like) but
every video is under 90 seconds and teaches one takeaway. Tone is playful,
sharp,  
 generous — a smart friend, not a teacher. Copy is in Bahasa Indonesia, native
to Jakarta, not translated from English.

CREATIVE NORTH STAR — "The Warung Lantern": a warung is a Southeast Asian street
stall, small and warmly lit, run by one expert. Skoop is the warung; the lesson
is the small portion; the brand color  
 is the lantern glow. The feed itself is nearly monochrome so the video is the
only color in frame. Everywhere outside the feed, one warm saffron hue carries
30–60% of every surface.

COLOR PALETTE — exact hex, no substitutions:

- Saffron Lantern #E89638 — brand. Primary buttons, active tabs, brand surfaces.
- Charcoal Warung #14110D — dark surround. Saffron-tinted, never #000. Feed
  background and app shell.
- Cream Lantern #FAF6EE — light surround. Saffron-tinted, never #fff.
- Dim Smoke #6E665A — secondary text, dividers, inactive chrome (dark theme).
- Bright Smoke #B8AE9D — secondary text, dividers (mid contrast).  


TYPOGRAPHY: one geometric sans for the entire app (Geist / Satoshi / General
Sans family). No display/body split. Hierarchy via weight and scale only.

- Display Bold ~32–40px, line-height 1.05
- Headline Bold ~24px, line-height 1.15
- Title Semibold ~18px
- Body Regular ~16px, line-height 1.45
- Label Medium ~13px tracked +0.05em  


STYLE RULES:

- Flat by default. ZERO box-shadows on chrome (cards, buttons, sheets, tab bar).
  Depth is tonal contrast, never elevation.
- Shadows exist ONLY as gradient scrims over video (top scrim ~96pt, bottom
  scrim ~140pt, charcoal at 60–70% alpha).
- No gradients on chrome. No gradient text.
- Tap targets ≥ 44pt.
- Light and dark themes both first-class; dark is canonical for the feed.
- Motion is responsive (transitions ease, taps feel back), never choreographed.
  No bounce, no elastic.

DESIGN AGAINST these (anti-references — if the screen looks like one of these,
it failed):

- Enterprise SaaS chrome: no sidebars, no dashboards, no hero-metric cards, no
  generic-blue-Inter-on-white surfaces.
- LMS / course-platform energy: no course-card grids, no progress rings on every
  screen, no "Module 3 of 12" labels, no certificate badges, no formal headers.
- Brainrot TikTok cues: no red-dot notification spam, no fake urgency, no
  aggressive autoplay traps, no fake-engagement counters.
- Pure #000 or #fff anywhere.
- Mixing typefaces (no serif "for the professor side").  


---

PER-SCREEN PROMPTS

1. Splash

Minimal launch surface. Full-bleed Charcoal Warung (#14110D). Centered: a 64×64
filled saffron (#E89638) circle with a charcoal flame glyph inside (the warung
lantern mark). Below: "Skoop" wordmark in bold geometric sans, ~36px, Cream
Lantern (#FAF6EE). No tagline, no spinner, no chrome. Edge-to-edge.

2. Onboarding — 3 panels, horizontal pager  


Charcoal Warung full-bleed. Top right: "Lewati" link in Bright Smoke (#B8AE9D),
14px. Center: a 176×176 circle of a slightly raised charcoal (#1C1813) with a
saffron (#E89638) line icon at 96px in the middle. Below it: a bold geometric
sans headline ~32px in Cream Lantern, leading-tight, then a body line ~16px in
Bright Smoke, leading-relaxed. Bottom: 3 dot indicators (active is a 24×8
saffron  
 pill, inactive are 8×8 Dim Smoke circles), then a saffron-500 primary CTA
button — h-56, rounded-2xl, label in Charcoal Warung bold.

Generate three panels:

- Panel 1: play-circle icon. Title "Belajar dalam 90 detik." Body "Setiap
  geseran satu pelajaran. Kecil, tajam, gampang diingat."
- Panel 2: lightning-bolt icon. Title "Geser, dan makin pintar." Body "Algoritma
  kami belajar dari apa yang kamu pelajari — bukan cuma yang kamu tonton."
- Panel 3: compass icon. Title "Topik kamu, di tangan kamu." Body "Sains,
  sejarah, koding, finansial, seni — dari kreator yang bikin belajar terasa
  seru."  
  CTA label is "Lanjut" on panels 1–2, "Mulai" on panel 3.  


3. Auth — sign in  


Charcoal Warung full-bleed. Top section centered: 64×64 saffron-500 filled
circle with a charcoal flame icon, then "Skoop" wordmark in bold ~40px Cream
Lantern, then subhead "Belajar dalam 90 detik." in 16px Bright Smoke.

Middle section: "Masuk untuk mulai." headline in 24px bold Cream Lantern. Below
it, a vertical stack of three outlined buttons (h-56, rounded-2xl, 1px Dim Smoke
border, transparent fill, icon + label centered):

- Apple icon (cream tint) + "Lanjut dengan Apple"
- Google "G" glyph + "Lanjut dengan Google"
- Mail icon + "Lanjut dengan Email" Below the stack: a centered saffron-500 text
  link "Lanjutkan tanpa akun".  


Footer: tiny 12px Dim Smoke text — "Dengan lanjut, kamu setuju dengan Syarat
Layanan dan Kebijakan Privasi Skoop." — with the two policy phrases underlined.

4. Interest picker (post-auth, seeds the feed)  


Charcoal Warung. Header: "Pilih topik favoritmu" in 28px bold Cream Lantern;
subhead "Minimal 3 — biar feed langsung pintar." in 14px Bright Smoke.

Body: a 2-column grid of 8 category cards. Each card is rounded-2xl, ~112pt
tall, charcoal-warung-raised (#1C1813) fill, with a small Ionicons line glyph
top-left and the category label below in  
 Semibold 16px Cream Lantern. Categories: Sains, Sejarah, Koding, Finansial,
Bahasa, Seni, Kesehatan, Bisnis.

Selected state: 1.5px saffron-500 border, saffron-500 fill at 8% alpha, glyph
turns from Bright Smoke to saffron. Idle glyph is Bright Smoke.

Bottom CTA: full-width saffron-500 button, label "Lanjut (3/8)" with live count,
disabled state when <3 picked (Dim Smoke fill, charcoal text).

5. Feed (the canonical Skoop surface)  


Full-bleed vertical video on Charcoal Warung. Edge-to-edge, no header chrome
over video.

Top scrim: gradient from charcoal at 60% alpha down to transparent, ~96pt tall,
protecting the category label.  
 Bottom scrim: gradient from charcoal at 70% alpha up to transparent, ~140pt
tall, protecting creator info and the action rail.

Top-left over scrim: a small all-caps category label in tracked Medium 13px
Cream Lantern (e.g., "SAINS").

Bottom-left over scrim, stacked: creator handle "@maya.sains" in Semibold 16px
Cream Lantern; lesson title "Kenapa langit jadi merah saat senja?" in Bold 24px
Cream Lantern, max 2 lines; one-line  
 description in Regular 14px Cream Lantern at 85% alpha.

Right-side action rail, vertically stacked with ~64pt spacing, all icons Cream
Lantern outlined ~28px:

- Heart (like). Count "12.4K" below in Medium 12px.
- Chat bubble (comment). Count "284".
- Bookmark (save). Count "1.1K".
- Forward arrow (share).  
  Active "liked" state is saffron-500 fill — the only saffron in the frame.

NO bottom tab bar visible over the feed. NO red-dot notifications. NO progress
ring.

6. Discover

Charcoal Warung. Top: a search field, rounded-2xl, charcoal-warung-raised fill,
no border, search icon left, placeholder "Cari pelajaran, kreator, topik..." in
Bright Smoke.

Section 1 — "Topik" header in Bold 24px Cream Lantern. Below: 2-column grid of 8
category tiles, same style as the interest picker but no selectable state — idle
saffron icon top-left, Cream Lantern  
 label below, charcoal-warung-raised fill, rounded-2xl.

Section 2 — "Kreator yang lagi naik" header. Below: a horizontal scrolling row
of creator chips. Each chip: 64×64 avatar circle (placeholder image), handle
below in Semibold 14px Cream Lantern,  
 follower count in Regular 12px Bright Smoke, then a small saffron-500 "Ikuti"
pill button.

Bottom: 5-tab bar — charcoal-warung-deep (#0E0B08) fill, 1px dim-smoke top
hairline, icons centered: Feed, Discover (active — saffron icon, saffron label,
others Bright Smoke), Upload (center,  
 rendered as a 44×44 saffron-500 rounded-xl square with a charcoal "+"),
Library, You.

7. Upload (creator landing)

Charcoal Warung. Header row: "Buat pelajaran" in Bold 24px Cream Lantern, an X
close icon top-right (Cream Lantern, 24px).

Body, centered vertically: a large 280pt-tall rounded-3xl card with a
saffron-500 fill at 12% alpha and a 1.5px saffron-500 border. Inside: a
saffron-500 camera icon at 48px, then "Rekam baru" in Bold 20px Cream Lantern,
then a one-liner "Vertikal, maks 90 detik." in 13px Bright Smoke.

Below it, a secondary card — same dimensions but charcoal-warung-raised fill,
1px Dim Smoke border, rounded-3xl: a Bright Smoke gallery icon, "Pilih dari
galeri" Semibold 18px Cream Lantern.

Bottom hint, centered: "Tambahkan caption dan kategori setelah trim." in 12px
Bright Smoke.

NO filters carousel. NO effects grid. NO music picker. Skoop is not a
creator-suite clone.

8. Library  


Charcoal Warung. Header: "Library" in Bold 28px Cream Lantern; subhead
"Pelajaran kamu, balik kapan saja." in 14px Bright Smoke.

Streak card just below: full-width, charcoal-warung-raised, rounded-2xl, p-4.
Left: a saffron flame icon ~32px. Right: "5 hari berturut-turut" Bold 18px Cream
Lantern, then "Streak terpanjang 12  
 hari." Regular 12px Bright Smoke. NO percentage, NO guilt-trip copy.

Tabs row: "Disimpan" (active) / "Riwayat" — text only, 16px Semibold; active
gets a 2px saffron-500 underline, inactive is Bright Smoke. NOT pill tabs.

List of saved lesson rows. Each row: 56×72 placeholder thumbnail rounded-xl on
the left; right side stacked: title in Semibold 16px Cream Lantern (max 2
lines), creator handle in Regular 13px Bright  
 Smoke, then a tiny category chip with saffron-100 fill and saffron-700 text,
~10px label, rounded-full.

Bottom: 5-tab bar with Library tab active.

9. Profile (You)

Charcoal Warung. Top right: a settings cog icon, Cream Lantern, 24px.

Header section, centered: 96×96 circular avatar (placeholder image), then
display name "Adi P." in Bold 24px Cream Lantern, then handle "@adipratama" in
Regular 16px Bright Smoke.

Stats row: three columns equal width, each shows a number in Bold 20px Cream
Lantern then a tracked Medium 12px label below in Bright Smoke — "12 /
FOLLOWING", "4 / FOLLOWERS", "27 / LESSONS".

Below: a full-width saffron-500 primary button "Edit profil", h-56, rounded-2xl,
charcoal label.

Tabs: "Dibuat" (active) / "Disukai" — text + 2px saffron underline pattern.

Grid: 3-column of square lesson thumbnails (placeholder image), rounded-md, 1pt
gap. NO badges, NO level indicators, NO certifications, NO progress rings.

Bottom: 5-tab bar with You active.

10. Comments sheet (modal over feed)

A bottom sheet rising from the bottom over a dimmed feed (charcoal at 60% alpha
scrim covering everything behind). Sheet: charcoal-warung-raised fill, top
corners rounded-3xl, ~80% screen height. 4×40 Dim Smoke drag handle at top
center.

Header: "Komentar (24)" Semibold 18px Cream Lantern, centered, with a small X
close icon right.

Comment list: each row has a 36×36 avatar circle (placeholder) on the left;
right side stacked — a top line with handle in Semibold 14px Cream Lantern then
a "•" then timestamp "2j" in Regular 12px  
 Bright Smoke; then comment body in Regular 14px Cream Lantern; then a small
action row "Suka • Balas" in 12px Bright Smoke with a tiny heart count to the
right.

Bottom input bar, sticky: a rounded-full charcoal-warung-deep input field with
placeholder "Tambahkan komentar..." in Bright Smoke, and a saffron-500 send
arrow icon button to the right.

---

How to use it

1. Always paste the master brief first, then add the per-screen prompt below it.
   This keeps the palette, typography, and anti-references consistent across
   generations.
2. Generate one screen at a time. Stitch handles single-screen prompts much
   better than "design the whole app."
3. If a generation drifts (e.g., shadows, generic blue, course-card grids),
   reply with the specific anti-reference rule it broke — Stitch responds well
   to corrective feedback.
4. Tweaks worth running early: try Light theme on a non-feed screen (Discover or
   Profile) to confirm the Cream Lantern surround still feels warung-warm, not
   paper-clinical.  


Want me to write this to ideas/stitch-prompts.md so you can keep refining it in
the repo, or are you good copy-pasting from here?

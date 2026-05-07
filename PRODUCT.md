# Product

## Register

product

## Users

Primary audience is Southeast Asia, Indonesia leading, ages roughly 18–35, mobile-native, currently spending real minutes inside TikTok, Reels, and Shorts. They feel a low-grade guilt about doomscrolling but don't want school. They are not looking for certificates, mastery tracks, or syllabi.

Context of use: phone-first, often on cellular data, often one-handed, often distracted. Vertical orientation, audio-on by default, swipe-up to skip. Sessions can be 90 seconds (queue, elevator, traffic light) or 90 minutes (bed, commute). The app must not punish either shape.

Job to be done: "give me the dopamine of TikTok with a takeaway I can repeat to a friend tomorrow." Not "help me earn a credential." Not "help me master a subject by Friday." The user is trading a doomscroll session for a Skoop session — Skoop competes with TikTok for that exact slot, not with Coursera for evening study time.

## Product Purpose

Skoop is a short-form video platform for educational content, built on the same swipe mechanics as TikTok — because those mechanics are not the problem. The problem is the calories. Every Skoop video is under 90 seconds, taught by creators and experts, tagged by category (science, history, languages, coding, finance, art, and more).

MVP scope: a vertical, infinite, personalized feed; creator uploads with category tagging; basic library, follows, and streaks. The next strategic bet after launch is automated content moderation — an "is this allowed on Skoop" filter that keeps the feed educational as creator volume scales.

Success on a given day: a SEA user opens Skoop instead of TikTok, watches one or many lessons, and walks away with at least one thing they didn't know an hour ago. Long-term: the algorithm rewards what you learn, not just what you watch.

## Brand Personality

Three words: **playful, sharp, generous.**

Voice: a smart friend, not a teacher. Casual, confident, never preachy. Treats the user's two minutes in line as a real budget. Earns time, doesn't extract it. Speaks Bahasa as a first language where it speaks Bahasa — not English with subtitles.

Tone: light, not loud. Confident without performing. Funny when it's funny, quiet when it isn't. Never guilt-trips the user about streaks, missed days, or "your friends are ahead of you."

Emotional goals: small daily "huh, didn't know that" wins. Pride without anxiety. The opposite of the "wasted my Sunday on TikTok" feeling.

## Anti-references

- **Enterprise SaaS chrome.** No sidebars, no dashboards, no hero-metric templates, no settings-heavy first impressions, no generic-blue-Inter-on-white surfaces. Skoop is consumer entertainment whose calories happen to be educational; the UI must read that way at first glance. If a screen could pass as Linear, Notion, or a B2B admin panel, it has failed.
- **LMS / course-platform energy.** No course-card grids, no percentage-complete progress bars on every screen, no "module 3 of 12" chrome, no certificate badges, no formal headers. We are not Coursera in vertical format. The Lesson is the unit, not the course.
- **Brainrot cues.** Even though the swipe loop is TikTok's, avoid the cues that make TikTok feel like a time-waste afterward: red notification spam, fake urgency, hostile autoplay traps that punish leaving, ragebait surfaced in UI, fake-engagement counters. Skoop should feel good after the session, not just during it.

## Design Principles

1. **TikTok mechanics, professor payload.** Copy the swipe loop exactly. Replace the calories. The vertical feed, autoplay, audio-on default, swipe-up-to-skip, double-tap-to-like — these are not negotiable and not the enemy. The content is what changes.
2. **The 90-second contract.** Every video promises and delivers one takeaway in under 90 seconds. UI hierarchy on every surface must reinforce that promise. Never bury the lesson behind chrome, intros, or branding.
3. **Earn the next swipe.** The next video must always feel worth it. Feed quality, prefetch, transitions, and recovery from a bad swipe are first-class UX, not polish. A mediocre next video breaks the entire thesis of the app.
4. **Consumer app, not classroom.** No course chrome, no SaaS chrome. If a screen could be mistaken for an LMS or a dashboard, redo it. The default mental model for a Skoop screen should be "video app," not "study tool."
5. **SEA-native, not SEA-localized.** Bahasa- and regional-language-first content, regionally-relevant topic taxonomy, copy tone that feels native to Jakarta — not a Western app translated. Localization is a baseline; the personality should already feel local before any translation runs.

## Accessibility & Inclusion

Target: WCAG 2.2 AA across video overlays, captions, and chrome.

- Honor `prefers-reduced-motion` and OS-level reduced-motion settings. Decorative motion becomes instant; autoplay continues, but loop chrome (progress rings, transitions) simplifies.
- Respect iOS Dynamic Type and Android font scale across all UI text. The feed must remain usable at 200% scale — text must not clip critical chrome (creator name, lesson title, swipe affordances).
- Captions are first-class on every video. Creators ship them; auto-captions are the fallback. Audio-off comprehension is a baseline requirement, not a nice-to-have, given the mobile and public-transit usage pattern.
- Color is never the only carrier of meaning (categories, like-state, streak-state must also use shape, weight, or label).
- Tap targets meet 44×44pt minimum, even when the design wants to feel "TikTok-tight."

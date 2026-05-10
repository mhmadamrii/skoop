Pre-auth & onboarding

1. Splash — brand-only launch surface (charcoal-warung + saffron lantern mark)
2. Welcome — 1–3 brief intro panels ("Belajar dalam 90 detik")
3. Sign in
4. Sign up
5. Interest picker — pick 3–5 categories to seed the feed

Bottom tabs (5)

6. Feed — vertical infinite, autoplay, audio-on. The naked surface.
7. Discover — category grid, search entry, trending creators
8. Upload — center tab, prominent. Camera/picker → trim → metadata
9. Library — saved lessons, watch history, streak display
10. You — own profile, follows, settings entry

Feed sub-surfaces (overlays/sheets, not full screens)

11. Comments sheet — bottom sheet over feed
12. Share sheet — bottom sheet
13. Report / flag — bottom sheet
14. Lesson detail — full description (tap title) — could also be a sheet

Discover sub-screens

15. Search — input + results (lessons, creators, categories)
16. Category detail — all lessons in one category, vertical or grid
17. Creator profile — public profile of any creator (tap from feed)

Upload sub-flow

18. Camera / picker — record or pick from library
19. Trim — enforce ≤90s
20. Publish metadata — title, description, category, captions
21. Upload progress / success

Library sub-screens

22. Saved (default within Library)
23. Watch history
24. Streak detail — quiet, no guilt-trip per PRODUCT.md

You sub-screens

25. Edit profile
26. Followers list
27. Following list
28. Settings — theme, notifications, language, account
29. Notifications inbox — quiet, no red-dot spam

Cross-cutting state surfaces (build once, reuse)

30. Empty states — no saves yet, no follows yet, no streak yet
31. Error / offline — video-failed-to-load, no-connection
32. Loading skeleton — feed cell, list rows

---

Suggested generation order if you want a sensible build path:

- First: Feed (6) — proves the theme tokens and the type system end-to-end
- Then: tab scaffold + the other 4 tabs as stubs (7–10)
- Then: Onboarding + auth (1–5)
- Then: Upload sub-flow (18–21)
- Then: Detail/sheet surfaces (11–17)
- Last: settings, lists, state surfaces

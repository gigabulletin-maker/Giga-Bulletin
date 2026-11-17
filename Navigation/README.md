# Giga Bulletin — Shared Navigation

All current pages use the same navigation component:

- `/Navigation/navigation.css` — desktop navigation, arrows, frosted-glass scroll state, mobile circular menu button, right-hand glass drawer and staggered menu animation.
- `/Navigation/navigation.js` — desktop arrow scrolling, mobile opening/closing, scroll-state effects and the canonical menu markup for new pages.

## Adding a future page

1. Create `your-page/index.html`, `your-page/Style/style.css`, and `your-page/Script/script.js` as usual.
2. In `<head>`, include `<link rel="stylesheet" href="/Navigation/navigation.css">` **after your page stylesheet**, so the shared navigation rules take precedence.
3. Before `</body>`, include `<script src="/Navigation/navigation.js" defer></script>`.
4. **Do not paste another navigation bar**. The shared script automatically inserts the canonical navigation at the beginning of `<body>` if `#gigaNavigation` is missing. It also supports existing pages that already contain the same markup.
5. Add the new page's link to the canonical menu markup in `Navigation/navigation.js`, and, if needed, synchronize existing static navigation copies. Do not create page-specific navigation styles or handlers.

The existing 14 pages intentionally retain their original navigation markup, while using the same shared CSS and JavaScript. This keeps their current layouts stable. Future pages can omit that markup entirely.

## Design rules

Desktop: single horizontal scrollable row, always-visible previous/next arrows, logo at left. Mobile: 42px circular menu button, glass right-side drawer, one-by-one link entrance, single-tap close. Scrolling: transparent frosted-glass navigation. Giga Flow only: its own sticky title bar stays below the navigation.

Do not change page-specific layouts, content, popups, or scripts when updating the shared navigation.

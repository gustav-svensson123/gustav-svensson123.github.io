# Bröllopssida – Malin & Gustav

Plain static site: no build step, no dependencies. Open `index.html` in a browser and it works.

```
index.html        All content (Swedish). Each section is marked with a ==== comment banner.
css/themes.css    Colour themes as CSS variables. The only place colours are defined.
css/style.css     Layout and typography. Uses only the variables from themes.css.
js/main.js        Countdown, fade-in on scroll, theme preview picker.
kalender.ics      "Add to calendar" file for the ceremony.
```

## Common edits

| I want to…                  | Do this |
|-----------------------------|---------|
| Switch theme                | Change `data-theme="bukett"` on the `<html>` tag in `index.html` (`bukett`, `bukett-mork`, `vastkust`, `skog`, `sand`, `skymning`, `solnedgang`, `sandhav`). The hero has its own `data-theme` (`bukett-mork`). |
| Compare themes live         | Open `index.html?teman`, a picker appears bottom-right. |
| Tweak a colour              | Edit the variable in `css/themes.css`. |
| Add a theme                 | Copy a block in `themes.css`, rename it, then add the name to `THEMES` in `js/main.js` (only needed for the preview picker). |
| Change text                 | Edit `index.html`. Placeholders are marked `[...]` or `<!-- TODO -->`. |
| Add schedule row / FAQ item | Copy an `<li>` in the timeline, or a `<details>` block under Praktiskt. |
| Change fonts                | Swap the Google Fonts link in `index.html` and `--font-heading` / `--font-body` in `style.css`. |
| RSVP (OSA)                  | Sent by e-mail via [FormSubmit](https://formsubmit.co) to `RSVP_TO`, with `RSVP_CC` in copy (set in `js/main.js`). See below. |

## Hosting (free)

- **GitHub Pages:** push the folder to a repo → Settings → Pages → deploy from branch.
- **Netlify / Cloudflare Pages:** drag and drop the folder, or connect the repo.

Both let you attach your own domain later (e.g. `malinochgustav.se`).

## OSA via FormSubmit

The form posts to FormSubmit, a free service that forwards form data as e-mail, so no backend is needed.

1. **Activate once:** host the page (or run `python -m http.server` in this folder and open http://localhost:8000) and send a test answer. FormSubmit mails an activation link to `RSVP_TO`. Click it; answers are delivered from then on.
2. The form does not work when opened directly as a file (`file://`), since FormSubmit needs a real web address.
3. After activation FormSubmit can give you a random alias to use instead of your e-mail in `RSVP_TO`, so the address isn't visible in the code.
4. If sending fails, the guest gets a link to send the answer as a regular e-mail to both of you.

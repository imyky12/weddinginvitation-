# Royal Gateway — Wedding Invitation Website

A royal Rajasthani-style wedding invite for Vikas & Avika (details from the printed card). It opens at a peacock palace gate, the view zooms through the doors, and everything after that is animated as you scroll:

1. Names reveal, then a sunset palace that zooms into a haveli front while the page is held in place
2. A carved window whose screens open to show the date and venue
3. Invitation text with a countdown in colourful arch tiles
4. A Save the Date scratch card
5. The Royal Couple and Our Family in window frames that open
6. The Royal Festivities: a hanging lamp comes down and each event scroll unrolls as you scroll
7. Royal Gallery carousel, venue card with map, RSVP and a Wishes Wall (both sent by WhatsApp)
8. Closing with a desert scene, plus falling petals, rotating mandalas and optional music throughout

All the artwork is drawn in code (SVG/CSS), so no image files are needed for the design itself.

## Customise
- **`config.js`** is the only file you need to edit: names, parents, dates, events, venue, gallery captions, WhatsApp number, music.
- **Photos** go in `images/` (`groom.jpg`, `bride.jpg`, `family-1.jpg`, `gallery-1.jpg` …, matching the paths in `config.js`). Any photo that's missing shows a decorative placeholder.
- **Music:** drop an mp3 into `music/` and set `music: "music/song.mp3"`. It starts when the gates are opened.

## Publish
Use GitHub Pages (Settings → Pages → deploy from branch, root folder), or drag the folder onto Netlify.

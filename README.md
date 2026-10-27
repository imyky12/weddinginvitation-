# शुभ विवाह — Vikas & Avika's Wedding Invitation

An Awadhi / Uttar Pradesh-style wedding invite (details from the printed card). All the artwork is drawn in code, and every section animates as you scroll:

1. **Awadhi gate**: an ivory gateway inspired by Lucknow's Rumi Darwaza, with the twin-fish emblem of Awadh, marigold garlands, a mango-leaf door garland and kalash pots. The doors swing open and the view zooms through.
2. **Names over the Ganga**: dusk at the ghats of Shuklaganj, with temple spires, bamboo umbrellas, floating diyas and a boat. The page holds in place while it zooms into an Awadhi palace front (Bara Imambara style).
3. **Date**: an arched window whose chikankari lattice screens open to show the date.
4. **सादर आमंत्रण**: Ganesh shloka, the invitation text lighting up word by word, and a countdown in Awadhi arches.
5. **शुभ तिथि**: a Save the Date scratch card.
6. **वर-वधू** and **हमारा परिवार** (वर पक्ष / कन्या पक्ष) in garlanded arch frames, plus the बाल मनुहार lines.
7. **मांगलिक कार्यक्रम**: Banarasi-brocade cards that unroll from marigold garlands while a brass bell comes down.
8. **विवाह स्थल**: a venue photo and directions.
9. **Closing**: a baraat procession (groom on a white mare, dhol, shehnai, light-bearers) walking up to a स्वागतम् gate with banana plants.

Marigold flowers turn at the sides as you scroll, and petals fall throughout.

## Customise
- **`config.js`** is the only file you need to edit: names, parents, dates, events, venue (map link, coordinates, photo), contacts, music.
- **Photos** go in `images/` (`groom.jpg`, `bride.jpg`, `family-1.jpg` …, matching the paths in `config.js`). Any photo that's missing shows an illustrated portrait instead.
- **Music:** drop an mp3 into `music/` and set `music: "music/song.mp3"`. It starts when the gates are opened.

## Publish
Use GitHub Pages (Settings → Pages → deploy from branch, root folder), or drag the folder onto Netlify.

Guests are guided to scroll: a "Scroll down to continue" hint shows over the palace, the page gently scrolls a little by itself if they don't, and a "Scroll down" button appears whenever they stop for a few seconds.

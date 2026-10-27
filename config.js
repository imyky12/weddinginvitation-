/* ============================================================
   EDIT THIS FILE ONLY — every name, date and place on the site
   comes from here (taken from the printed card).
   ============================================================ */
window.WEDDING = {
  groom: "Vikas",
  bride: "Avika",
  groomHindi: "विकास",
  brideHindi: "अविका",
  groomFull: "Vikas Singh",
  brideFull: "Avika Singh",
  groomParents: "Son of Smt. Sarla Devi & Shri Narsingh",
  brideParents: "Daughter of Smt. Madhuri Singh & Shri Dinesh Singh",
  groomGrandparents: "Grandson of Late Smt. Brijrani & Shri Narayan Singh",
  brideGrandparents: "Granddaughter of Late Smt. Savitri Devi & Late Shri Krishna Kumar Singh",

  // Main moment for the countdown (Baraat departs) — local time
  weddingDate: "2026-11-24T18:00:00",
  dateLong: "Tuesday, 24 November 2026",
  dateShort: "24 November 2026",
  timeText: "Baraat departs at 6:00 PM",

  shloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
  invitationText:
    "With the blessings of the Almighty and our revered ancestors, we request the honour of your presence to celebrate the sacred union of our beloved Vikas with Avika.",
  hashtag: "#VikasWedsAvika",

  // Photos: put files in images/ — until then an illustrated portrait is shown
  groomPhoto: "images/groom.jpg",
  bridePhoto: "images/bride.jpg",

  // art: groom | bride | man | woman | elder  (used when there is no photo)
  family: {
    groom: [
      { name: "Shri Narayan Singh", relation: "Grandfather of the Groom", art: "elder", photo: "images/family-1.jpg" },
      { name: "Shri Narsingh",      relation: "Father of the Groom",      art: "man",   photo: "images/family-2.jpg" },
      { name: "Smt. Sarla Devi",    relation: "Mother of the Groom",      art: "woman", photo: "images/family-3.jpg" }
    ],
    bride: [
      { name: "Shri Dinesh Singh",  relation: "Father of the Bride",      art: "man",   photo: "images/family-4.jpg" },
      { name: "Smt. Madhuri Singh", relation: "Mother of the Bride",      art: "woman", photo: "images/family-5.jpg" }
    ]
  },

  // "Bal Manuhar" — the little ones' invitation
  kids: {
    names: "Vasu, Shivay & Manjari",
    couplet: "हल्दी है, चन्दन है, रिश्तों का बन्धन है,\nमेरे मामा के तिलक में आपका अभिनन्दन है ।"
  },

  events: [
    { name: "Tilakotsav", hindi: "शुभ तिलकोत्सव एवं स्नेहिल प्रीतिभोज", note: "Tilak & Preetibhoj", date: "18 Nov 2026", day: "Wednesday", time: "7:00 PM", venue: "Azad Marriage Lawn, Badarka, Unnao", map: "Azad Marriage Lawn Unnao" },
    { name: "Matru Poojan", hindi: "मातृ पूजन", note: "Blessings of the mothers", date: "23 Nov 2026", day: "Monday", time: "", venue: "Jagjeevanpur (Rawal Kalan), Unnao" },
    { name: "Shubh Vivah", hindi: "शुभ विवाह", note: "Baraat departs at 6:00 PM", date: "24 Nov 2026", day: "Tuesday", time: "6:00 PM", venue: "Saubhagya Shri Palace, Marhala Chauraha, Shuklaganj", map: "Saubhagya Shri Palace Shuklaganj Unnao" },
    { name: "Vadhu Aagman", hindi: "वधू आगमन", note: "Welcoming the bride home", date: "25 Nov 2026", day: "Wednesday", time: "", venue: "Jagjeevanpur (Rawal Kalan), Unnao" }
  ],

  gallery: [
    { src: "images/gallery-1.jpg", caption: "The Tilak" },
    { src: "images/gallery-2.jpg", caption: "The Haldi" },
    { src: "images/gallery-3.jpg", caption: "The Wedding Mandap" },
    { src: "images/gallery-4.jpg", caption: "The Pheras" },
    { src: "images/gallery-5.jpg", caption: "Together Forever" }
  ],

  venue: {
    name: "Saubhagya Shri Palace",
    address: "Near Marhala Chauraha, Shuklaganj, Unnao",
    note: "The Baraat departs at 6:00 PM from our home in Jagjeevanpur (Rawal Kalan), Unnao.",
    mapQuery: "Saubhagya Shri Palace Shuklaganj Unnao"
  },

  hosts: {
    inviter: "Narayan Singh",
    family: "Samast Kakutsth Parivar",
    contacts: [
      { name: "Narayan Singh Kakutsth", phone: "9415934508" },
      { name: "Dr. Narsingh Kakutsth", phone: "9554305725" }
    ]
  },

  // RSVPs and wishes are sent on WhatsApp to this number (country code, no "+")
  whatsapp: "919415934508",

  wishes: [
    { text: "Wishing Vikas and Avika a lifetime of love, laughter and togetherness.", from: "Kakutsth Parivar" },
    { text: "May Lord Ganesha bless the new journey of the couple.", from: "Charan Medical Store, Rawal Kalan" }
  ],

  // Background music, e.g. "music/song.mp3" — leave "" for none
  music: ""
};

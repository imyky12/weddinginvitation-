/* ============================================================
   EDIT THIS FILE ONLY — every name, date and place on the site
   comes from here. Sample names below are placeholders.
   ============================================================ */
window.WEDDING = {
  groom: "Aarav",
  bride: "Diya",
  groomFull: "Aarav Mehta",
  brideFull: "Diya Sharma",
  groomParents: "Son of Mr. Rajesh Mehta & Mrs. Sunita Mehta",
  brideParents: "Daughter of Mr. Anil Sharma & Mrs. Kavita Sharma",

  // Main ceremony (used by the countdown) — local time
  weddingDate: "2026-12-02T19:00:00",
  dateLong: "Wednesday, 2 December 2026",
  timeText: "7:00 PM onwards",

  invitationText:
    "request the honour of your presence to celebrate the union of their son and daughter, and the joining of two families.",
  hashtag: "#AaravWedsDiya",

  // Photos: put files in images/ — missing photos show a decorative placeholder
  groomPhoto: "images/groom.jpg",
  bridePhoto: "images/bride.jpg",

  family: {
    groom: [
      { name: "Rohan Mehta", relation: "Brother of the Groom", photo: "images/family-1.jpg" }
    ],
    bride: [
      { name: "Nisha Sharma", relation: "Sister of the Bride", photo: "images/family-2.jpg" }
    ]
  },

  events: [
    { name: "Haldi",     note: "Family only",        date: "29 Nov 2026", time: "10:00 AM", venue: "Mehta Residence" },
    { name: "Mehndi",    note: "Henna & laughter",   date: "30 Nov 2026", time: "4:00 PM",  venue: "The Garden Courtyard" },
    { name: "Sangeet",   note: "An evening of music", date: "1 Dec 2026",  time: "7:00 PM",  venue: "The Grand Lawns" },
    { name: "Wedding",   note: "The pheras",         date: "2 Dec 2026",  time: "7:00 PM",  venue: "Shubh Vivah Banquet Hall" },
    { name: "Reception", note: "Dinner & dancing",   date: "3 Dec 2026",  time: "8:00 PM",  venue: "Shubh Vivah Banquet Hall" }
  ],

  gallery: [
    { src: "images/gallery-1.jpg", caption: "The Proposal" },
    { src: "images/gallery-2.jpg", caption: "The Roka" },
    { src: "images/gallery-3.jpg", caption: "The Engagement" },
    { src: "images/gallery-4.jpg", caption: "Pre-Wedding" },
    { src: "images/gallery-5.jpg", caption: "Together" }
  ],

  venue: {
    name: "Shubh Vivah Banquet Hall",
    address: "MG Road, Gurugram, Haryana",
    mapQuery: "MG Road Gurugram"          // anything Google Maps can search
  },

  // RSVPs and wishes are sent to this WhatsApp number (country code, no "+")
  whatsapp: "919999999999",

  wishes: [
    { text: "So happy for you both! Wishing you a lifetime of love and laughter.", from: "Friends from college" },
    { text: "May your journey together be as beautiful as your love story.", from: "The Kapoor family" }
  ],

  // Background music, e.g. "music/song.mp3" — leave "" for none
  music: ""
};

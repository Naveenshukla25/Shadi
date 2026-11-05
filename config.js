/**
 * Wedding Configuration Data
 * Ankit Mishra & Saumya Shukla — Shubh Vivah
 * 7–9 December 2026 · Prayagraj
 */

window.WEDDING = {
  groom: {
    en: "Ankit Mishra",
    hi: "अंकित मिश्रा"
  },
  bride: {
    en: "Saumya Shukla",
    hi: "सौम्या शुक्ला"
  },
  city: {
    en: "Prayagraj",
    hi: "प्रयागराज"
  },
  tz: "Asia/Kolkata",
  music: "assets/song.mp3",
  video: null,
  monogram: "assets/monogram.png",
  ganesh: "assets/ganesh.png",
  // Formal card wording — paste exact wording here when ready; null = shows placeholder
  // The card section uses Noto Serif Devanagari font for Hindi text automatically.
  cardText: {
    groom: { en: "Mr Arun Shukla. & Mrs Susheela Shukla. \n request the pleasure of your company\n at the marriage of their daughter \n Saumya Shukla with Ankit Mishra .", hi: "श्री अरुण शुक्ला व श्रीमती सुशिला शुक्ला \nआपको सादर आमंत्रित करते हैं\n.." },
    bride: { en: null, hi: null }
  },

  // Gallery images — add filenames (placed inside assets/ folder)
  // Each entry: { src: "assets/photo1.jpg", caption: "…" } — caption is optional
  // Leave the array empty [] to show shimmer placeholders
  gallery: [
    { src: "assets/photo1.jpg" },
    { src: "assets/photo2.jpg" },
    { src: "assets/photo3.jpg"},
    { src : "assets/photo4.jpg"},
    {src : "assets/photo5.jpg"},
    {src : "assets/photo6.jpeg"},
    {src : "assets/photo7.jpeg"},
    {src : "assets/photo8.jpeg"},
    {src : "assets/photo9.jpeg"},
    {src : "assets/photo10.jpeg"},
  ],

  rsvp: [{ name: "ARUN SHUKLA", phone: "+918840052136" }],
  events: [
    {
      id: "haldi",
      en: "Haldi / Mehendi",
      hi: "हल्दी / मेहंदी",
      start: "2026-12-07T18:30:00+05:30",
      venue: "7/110 Savitri Nagar New Jhunsi Prayagraj",
      venueHi: "७/११०, सावित्री नगर, न्यू झूँसी, प्रयागराज",
      mapsQ: "CWP3+5RG Prayagraj, UttarPradesh"
    },
    {
      id: "sangeet",
      en: "Sangeet",
      hi: "संगीत",
      start: "2026-12-08T19:00:00+05:30",
      venue: "7/110 Savitri Nagar, New Jhunsi, Prayagraj",
      venueHi: "७/११०, सावित्री नगर, न्यू झूँसी, प्रयागराज",
      mapsQ: "CWP3+5RG Prayagraj, UttarPradesh"
    },
    {
      id: "pheras",
      en: "Baraat Swagat & Pheras (Shubh Muhurat)",
      hi: "बारात स्वागत व फेरे (शुभ मुहूर्त)",
      start: "2026-12-09T19:30:00+05:30",
      venue: "RP Lawn, Near Bhola Hospital, Andawa, Prayagraj",
      venueHi: "आर.पी. लॉन, भोला हॉस्पिटल के समीप, अंदावा, प्रयागराज",
      mapsQ: "RP Lawn near Bhola Hospital Andawa Prayagraj",
      note: {
        en: "Followed by Dinner & Ashirwad",
        hi: "तत्पश्चात् भोजन एवं आशीर्वाद"
      }
    }
  ]
};

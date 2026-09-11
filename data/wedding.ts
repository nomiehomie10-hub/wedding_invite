/**
 * The single source of truth for the invitation.
 *
 * Everything the guest reads — names, date, venue, running order — comes from
 * here. Editing this file re-renders the entire invitation; no component holds
 * its own copy of any of it.
 */
export const wedding = {
  /**
   * Which function this invitation is for. Named once here; the hero, the
   * formal panel and the page title all read from it.
   */
  ceremony: {
    name: "Barat",
  },

  /*
   * Two names each. `name` is the formal one, used where the invitation
   * addresses its guests — the hero and the printed panel. `shortName` is used
   * where the tone turns personal, which at present is only the sign-off.
   */
  groom: {
    name: "Farhanullah Khan",
    shortName: "Farhan",
    initial: "F",
    relation: "Son of",
    parents: "Mr. & Mrs. Maj (R) Shahid Ashraf",
  },

  bride: {
    name: "Dr. Sobia Mariam",
    shortName: "Sobia",
    initial: "S",
    relation: "Daughter of",
    parents: "Mr. & Mrs. Col (R) Ghulam Farooq Babai",
  },

  date: {
    day: 10,
    month: "October",
    year: 2026,
    /** Drives the countdown. Set to the hour the first guests arrive. */
    iso: "2026-10-10T19:30:00",
  },

  venue: {
    city: "Karachi",
    name: "DHA Golf Club",
    /**
     * Optional — a ballroom, lawn or hall within the venue. Leave empty and
     * the line is simply not rendered.
     */
    room: "Convention Centre, Hall A" as string,
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=DHA+Golf+Club+Karachi",
    /**
     * Keyless Google Maps embed. Leave blank to fall back to the engraved map
     * card, which needs no network at all.
     */
    mapEmbedUrl:
      "https://maps.google.com/maps?q=DHA%20Golf%20Club%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },

  events: [
    { time: "7:30 pm", title: "Arrival of Guests", image: "celebration" },
    { time: "8:30 pm", title: "Bridal Entry", image: "bride-entrance" },
    { time: "9:00 pm", title: "Dinner", image: "dinner" },
  ],

  /**
   * An optional remembrance, shown as its own quiet panel after the formal
   * invitation. Set to `null` to leave it out entirely.
   */
  memorial: {
    lead: "On this special day, we carry with us the love and memories of our beloved father,",
    name: "Late Col Ghulam Farooq Babai",
    tail: "whose presence we miss dearly and whose blessings we hold forever in our hearts.",
  },

  invitation: {
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    salutation: "Dear Friends and Family",
    letter:
      "Join us for an evening of love, laughter, duas, and unforgettable memories as we begin our forever.",
  },

  closing: {
    lines: [
      "We look forward to celebrating with you.",
      "Your presence will make our day complete.",
    ],
  },

  audio: {
    /**
     * Empty by default, because no track ships with the invitation.
     *
     * Put an mp3 in /public/audio and set this to its path — e.g.
     * "/audio/wedding-ambient.mp3" — and the music control appears once the
     * invitation is opened. Left empty, nothing is requested and the control
     * never renders. It never autoplays either way.
     */
    src: "" as string,
  },
} as const;

export type Wedding = typeof wedding;
export type WeddingEvent = Wedding["events"][number];

/**
 * The order the two are presented in, everywhere they appear together — the
 * wax seal, the hero, the formal panel and the sign-off.
 *
 * Bride first. This is the only place that order is decided; reversing this
 * one line reverses it across the whole invitation, which is what stops the
 * four surfaces drifting out of agreement.
 */
export const couple = [wedding.bride, wedding.groom] as const;

/** "S & F" — pressed into the wax seal. */
export const monogram = couple.map((person) => person.initial).join(" & ");

/** Formal pairing, e.g. "Dr. Sobia Mariam & Farhanullah Khan". */
export const coupleNames = couple.map((person) => person.name).join(" & ");

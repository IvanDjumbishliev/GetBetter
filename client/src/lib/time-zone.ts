/** The browser's IANA time zone, sent to the server so streak days match the user's calendar. */
export const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

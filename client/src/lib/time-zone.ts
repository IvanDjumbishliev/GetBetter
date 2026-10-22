/** The browser's IANA time zone, sent to the server so streak days match the user's calendar. */
export const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** Today's date ("YYYY-MM-DD") in the browser's time zone, matching the server's streak dates. */
export const todayKey = () =>
  new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(),
  );

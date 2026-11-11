import { getSeasonSessions } from "./openF1Api";
import { f1Calendar2026 } from "./f1Calendar";


/* =========================================
   SESSION TYPES
========================================= */

export const SESSION_TYPES = {
  PRACTICE_1: "Practice 1",
  PRACTICE_2: "Practice 2",
  PRACTICE_3: "Practice 3",
  SPRINT: "Sprint",
  SPRINT_QUALIFYING: "Sprint Qualifying",
  QUALIFYING: "Qualifying",
  RACE: "Race",
};


/* =========================================
   NORMALIZE TEXT
========================================= */

const normalizeText = (value = "") => {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};


/* =========================================
   DETECT SESSION TYPE
========================================= */

export const normalizeSessionName = (session) => {
  if (!session) {
    return "Unknown";
  }

  const name = normalizeText(
    session.session_name ||
    session.session_type ||
    ""
  );

  if (name.includes("practice 1")) {
    return SESSION_TYPES.PRACTICE_1;
  }

  if (name.includes("practice 2")) {
    return SESSION_TYPES.PRACTICE_2;
  }

  if (name.includes("practice 3")) {
    return SESSION_TYPES.PRACTICE_3;
  }

  if (name.includes("sprint qualifying")) {
    return SESSION_TYPES.SPRINT_QUALIFYING;
  }

  if (name === "sprint") {
    return SESSION_TYPES.SPRINT;
  }

  if (name.includes("qualifying")) {
    return SESSION_TYPES.QUALIFYING;
  }

  if (name === "race") {
    return SESSION_TYPES.RACE;
  }

  return (
    session.session_name ||
    session.session_type ||
    "Unknown"
  );
};


/* =========================================
   FIND RACE FROM CALENDAR
========================================= */

export const getRaceFromCalendar = (session) => {
  if (!session) {
    return null;
  }

  const location = normalizeText(
    session.location
  );

  const country = normalizeText(
    session.country_name
  );

  const circuit = normalizeText(
    session.circuit_short_name
  );


  /* -----------------------------------------
     FIRST: MATCH LOCATION
  ----------------------------------------- */

  const locationMatch = f1Calendar2026.find(
    (race) => {
      const raceName =
        normalizeText(race.shortName);

      const raceCircuit =
        normalizeText(race.circuit);

      const raceCountry =
        normalizeText(race.country);

      return (
        raceName === location ||
        raceCircuit === circuit ||
        (
          raceCountry === country &&
          (
            raceName.includes(location) ||
            location.includes(raceName)
          )
        )
      );
    }
  );

  if (locationMatch) {
    return locationMatch;
  }


  /* -----------------------------------------
     SECOND: MATCH COUNTRY
  ----------------------------------------- */

  const countryMatches =
    f1Calendar2026.filter(
      (race) =>
        normalizeText(race.country) === country
    );

  if (countryMatches.length === 1) {
    return countryMatches[0];
  }


  /* -----------------------------------------
     LAST FALLBACK: DATE
  ----------------------------------------- */

  const sessionTime =
    new Date(session.date_start).getTime();

  const candidates =
    countryMatches.length > 0
      ? countryMatches
      : f1Calendar2026;

  return [...candidates].sort(
    (a, b) => {

      const dateA = Math.abs(
        new Date(a.raceDate).getTime() -
        sessionTime
      );

      const dateB = Math.abs(
        new Date(b.raceDate).getTime() -
        sessionTime
      );

      return dateA - dateB;
    }
  )[0] || null;
};


/* =========================================
   SESSION STATUS
========================================= */

export const getSessionStatus = (
  session,
  now = Date.now()
) => {

  if (!session) {
    return "UNKNOWN";
  }

  const start =
    new Date(session.date_start).getTime();

  const end =
    new Date(session.date_end).getTime();


  if (
    now >= start &&
    now <= end
  ) {
    return "LIVE";
  }

  if (now < start) {
    return "UPCOMING";
  }

  return "COMPLETED";
};


/* =========================================
   FORMAT SESSION
========================================= */

const formatSession = (
  session,
  now = Date.now()
) => {

  if (!session) {
    return null;
  }

  return {
    sessionKey:
      session.session_key,

    meetingKey:
      session.meeting_key,

    sessionName:
      session.session_name,

    sessionType:
      normalizeSessionName(session),

    sessionStatus:
      getSessionStatus(session, now),

    location:
      session.location,

    country:
      session.country_name,

    circuit:
      session.circuit_short_name,

    dateStart:
      session.date_start,

    dateEnd:
      session.date_end,

    race:
      getRaceFromCalendar(session),

    raw:
      session,
  };
};


/* =========================================
   GET COMPLETE SESSION STATE
========================================= */

export const getSessionState = async (
  year = new Date().getFullYear()
) => {

  const sessions =
    await getSeasonSessions(year);

  const now = Date.now();


  /* -----------------------------------------
     CURRENT LIVE SESSION
  ----------------------------------------- */

  const liveSession =
    sessions.find((session) => {

      const start =
        new Date(session.date_start).getTime();

      const end =
        new Date(session.date_end).getTime();

      return (
        now >= start &&
        now <= end
      );
    });


  /* -----------------------------------------
     LATEST COMPLETED SESSION
  ----------------------------------------- */

  const completedSessions =
    sessions.filter((session) => {

      return (
        new Date(session.date_end).getTime() <
        now
      );
    });


  const latestCompleted =
    completedSessions.length > 0
      ? completedSessions[
          completedSessions.length - 1
        ]
      : null;


  /* -----------------------------------------
     NEXT UPCOMING SESSION
  ----------------------------------------- */

  const nextUpcoming =
    sessions.find((session) => {

      return (
        new Date(session.date_start).getTime() >
        now
      );
    });


  /* -----------------------------------------
     CURRENT SESSION
  ----------------------------------------- */

  const currentRaw =
    liveSession ||
    latestCompleted;


  const current =
    formatSession(
      currentRaw,
      now
    );


  /* -----------------------------------------
     NEXT SESSION
  ----------------------------------------- */

  const next =
    formatSession(
      nextUpcoming,
      now
    );


  return {
    current,
    next,

    isLive:
      current?.sessionStatus === "LIVE",

    season: year,
  };
};


/* =========================================
   GET CURRENT SESSION
========================================= */

export const getCurrentSession = async (
  year = new Date().getFullYear()
) => {

  const state =
    await getSessionState(year);

  return state.current;
};


/* =========================================
   GET NEXT SESSION
========================================= */

export const getNextSession = async (
  year = new Date().getFullYear()
) => {

  const state =
    await getSessionState(year);

  return state.next;
};


/* =========================================
   DISPLAY NAME
========================================= */

export const getSessionDisplayName = (
  session
) => {

  if (!session) {
    return "F1 SESSION";
  }

  const type =
    session.sessionType ||
    session.session_name ||
    "SESSION";


  if (
    session.sessionStatus === "LIVE"
  ) {
    return `LIVE • ${type.toUpperCase()}`;
  }

  return type.toUpperCase();
};


/* =========================================
   STATUS LABEL
========================================= */

export const getSessionStatusLabel = (
  session
) => {

  if (!session) {
    return "UNKNOWN";
  }

  switch (
    session.sessionStatus
  ) {

    case "LIVE":
      return "LIVE";

    case "UPCOMING":
      return "UPCOMING";

    case "COMPLETED":
      return "COMPLETED";

    default:
      return "UNKNOWN";
  }
};
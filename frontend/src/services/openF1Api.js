const BASE_URL = "https://api.openf1.org/v1";

/* =========================================
   FETCH HELPER
========================================= */

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const fetchData = async (url, retries = 2) => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    // Rate limit protection
    if (response.status === 429 && retries > 0) {
      console.warn("Rate limited. Retrying...");
      await delay(2000);

      return fetchData(url, retries - 1);
    }

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => "");

      throw new Error(
        `OpenF1 API Error: ${response.status}${
          errorText ? ` - ${errorText}` : ""
        }`
      );
    }

    return await response.json();

  } catch (error) {
    console.error(
      "OpenF1 Request Failed:",
      url,
      error.message
    );

    throw error;
  }
};


/* =========================================
   CIRCUIT CONFIGURATION
========================================= */

const CIRCUIT_CONFIG = {
  Bahrain: {
    country: "Bahrain",
    locations: ["Sakhir", "Bahrain"],
    meetings: ["Bahrain Grand Prix"],
  },

  Sakhir: {
    country: "Bahrain",
    locations: ["Sakhir", "Bahrain"],
    meetings: ["Bahrain Grand Prix"],
  },

  "Saudi Arabia": {
    country: "Saudi Arabia",
    locations: ["Jeddah"],
    meetings: ["Saudi Arabian Grand Prix"],
  },

  Jeddah: {
    country: "Saudi Arabia",
    locations: ["Jeddah"],
    meetings: ["Saudi Arabian Grand Prix"],
  },

  Australia: {
    country: "Australia",
    locations: ["Melbourne"],
    meetings: ["Australian Grand Prix"],
  },

  Melbourne: {
    country: "Australia",
    locations: ["Melbourne"],
    meetings: ["Australian Grand Prix"],
  },

  Japan: {
    country: "Japan",
    locations: ["Suzuka"],
    meetings: ["Japanese Grand Prix"],
  },

  Suzuka: {
    country: "Japan",
    locations: ["Suzuka"],
    meetings: ["Japanese Grand Prix"],
  },

  China: {
    country: "China",
    locations: ["Shanghai"],
    meetings: ["Chinese Grand Prix"],
  },

  Shanghai: {
    country: "China",
    locations: ["Shanghai"],
    meetings: ["Chinese Grand Prix"],
  },

  Miami: {
    country: "United States",
    locations: ["Miami"],
    meetings: ["Miami Grand Prix"],
  },

  Monaco: {
    country: "Monaco",
    locations: ["Monaco", "Monte Carlo"],
    meetings: ["Monaco Grand Prix"],
  },

  "Monte Carlo": {
    country: "Monaco",
    locations: ["Monaco", "Monte Carlo"],
    meetings: ["Monaco Grand Prix"],
  },

  Spain: {
    country: "Spain",
    locations: ["Barcelona", "Madrid"],
    meetings: ["Spanish Grand Prix"],
  },

  Barcelona: {
    country: "Spain",
    locations: ["Barcelona"],
    meetings: ["Spanish Grand Prix"],
  },

  Canada: {
    country: "Canada",
    locations: ["Montreal", "Montréal"],
    meetings: ["Canadian Grand Prix"],
  },

  Montreal: {
    country: "Canada",
    locations: ["Montreal", "Montréal"],
    meetings: ["Canadian Grand Prix"],
  },

  Austria: {
    country: "Austria",
    locations: ["Spielberg"],
    meetings: ["Austrian Grand Prix"],
  },

  Spielberg: {
    country: "Austria",
    locations: ["Spielberg"],
    meetings: ["Austrian Grand Prix"],
  },

  Britain: {
    country: "Great Britain",
    locations: ["Silverstone"],
    meetings: ["British Grand Prix"],
  },

  "Great Britain": {
    country: "Great Britain",
    locations: ["Silverstone"],
    meetings: ["British Grand Prix"],
  },

  Silverstone: {
    country: "Great Britain",
    locations: ["Silverstone"],
    meetings: ["British Grand Prix"],
  },

  Belgium: {
    country: "Belgium",
    locations: ["Spa-Francorchamps", "Spa"],
    meetings: ["Belgian Grand Prix"],
  },

  Hungary: {
    country: "Hungary",
    locations: ["Budapest", "Mogyoród"],
    meetings: ["Hungarian Grand Prix"],
  },

  Netherlands: {
    country: "Netherlands",
    locations: ["Zandvoort"],
    meetings: ["Dutch Grand Prix"],
  },

  Italy: {
    country: "Italy",
    locations: ["Monza"],
    meetings: ["Italian Grand Prix"],
  },

  Monza: {
    country: "Italy",
    locations: ["Monza"],
    meetings: ["Italian Grand Prix"],
  },

  Azerbaijan: {
    country: "Azerbaijan",
    locations: ["Baku"],
    meetings: ["Azerbaijan Grand Prix"],
  },

  Baku: {
    country: "Azerbaijan",
    locations: ["Baku"],
    meetings: ["Azerbaijan Grand Prix"],
  },

  Singapore: {
    country: "Singapore",
    locations: ["Singapore"],
    meetings: ["Singapore Grand Prix"],
  },

  Austin: {
    country: "United States",
    locations: ["Austin"],
    meetings: ["United States Grand Prix"],
  },

  USA: {
    country: "United States",
    locations: ["Austin"],
    meetings: ["United States Grand Prix"],
  },

  Mexico: {
    country: "Mexico",
    locations: ["Mexico City"],
    meetings: ["Mexico City Grand Prix"],
  },

  "Mexico City": {
    country: "Mexico",
    locations: ["Mexico City"],
    meetings: ["Mexico City Grand Prix"],
  },

  Brazil: {
    country: "Brazil",
    locations: ["São Paulo", "Sao Paulo"],
    meetings: ["São Paulo Grand Prix"],
  },

  "São Paulo": {
    country: "Brazil",
    locations: ["São Paulo", "Sao Paulo"],
    meetings: ["São Paulo Grand Prix"],
  },

  "Las Vegas": {
    country: "United States",
    locations: ["Las Vegas"],
    meetings: ["Las Vegas Grand Prix"],
  },

  Qatar: {
    country: "Qatar",
    locations: ["Lusail"],
    meetings: ["Qatar Grand Prix"],
  },

  Lusail: {
    country: "Qatar",
    locations: ["Lusail"],
    meetings: ["Qatar Grand Prix"],
  },

  "Abu Dhabi": {
    country: "United Arab Emirates",
    locations: ["Abu Dhabi"],
    meetings: ["Abu Dhabi Grand Prix"],
  },

  AbuDhabi: {
    country: "United Arab Emirates",
    locations: ["Abu Dhabi"],
    meetings: ["Abu Dhabi Grand Prix"],
  },
};


/* =========================================
   HELPERS
========================================= */

const normalizeText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim();


const getCircuitConfig = (circuitName) => {
  if (!circuitName) return null;

  // Direct match
  if (CIRCUIT_CONFIG[circuitName]) {
    return CIRCUIT_CONFIG[circuitName];
  }

  // Case-insensitive match
  const key = Object.keys(CIRCUIT_CONFIG).find(
    (item) =>
      normalizeText(item) === normalizeText(circuitName)
  );

  return key ? CIRCUIT_CONFIG[key] : null;
};


const validateSessionKey = (sessionKey) => {
  if (!sessionKey) {
    throw new Error("Session key is missing.");
  }
};


/* =========================================
   GENERAL FUNCTIONS
========================================= */

export const getLatestSession = async (
  year = new Date().getFullYear()
) => {
  const sessions = await fetchData(
    `${BASE_URL}/sessions?year=${year}`
  );

  if (!sessions || sessions.length === 0) {
    throw new Error(`No F1 sessions found for ${year}.`);
  }

  const now = Date.now();

  // Ignore cancelled sessions.
  const validSessions = sessions.filter(
    (session) => session.is_cancelled !== true
  );

  // Never select a session that has not started yet.
  const startedSessions = validSessions.filter(
    (session) =>
      new Date(session.date_start).getTime() <= now
  );

  if (startedSessions.length === 0) {
    throw new Error(
      `No active or completed F1 sessions found for ${year}.`
    );
  }

  // Prefer a session that is currently running.
  const activeSession = startedSessions.find((session) => {
    const start = new Date(session.date_start).getTime();
    const end = new Date(session.date_end).getTime();

    return (
      now >= start &&
      (!Number.isNaN(end) ? now <= end : true)
    );
  });

  if (activeSession) {
    console.log(
      "Using active F1 session:",
      activeSession.session_name,
      activeSession.location,
      activeSession.session_key
    );

    return activeSession;
  }

  // Otherwise return the most recently started session.
  const latestSession = [...startedSessions].sort(
    (a, b) =>
      new Date(b.date_start).getTime() -
      new Date(a.date_start).getTime()
  )[0];

  console.log(
    "Using latest completed F1 session:",
    latestSession.session_name,
    latestSession.location,
    latestSession.session_key
  );

  return latestSession;
};
 

/* =========================================
   GET ALL SEASON SESSIONS
========================================= */

export const getSeasonSessions = async (
  year = new Date().getFullYear()
) => {
  const sessions = await fetchData(
    `${BASE_URL}/sessions?year=${year}`
  );

  if (!sessions || sessions.length === 0) {
    throw new Error(
      `No F1 sessions found for ${year}.`
    );
  }

  return [...sessions]
    .filter((session) => {
      return (
        session.session_key &&
        session.meeting_key &&
        session.date_start &&
        session.date_end &&
        !session.is_cancelled
      );
    })
    .sort(
      (a, b) =>
        new Date(a.date_start) -
        new Date(b.date_start)
    );
};


/* =========================================
   GET MEETING BY KEY
========================================= */

export const getMeetingByKey = async (meetingKey) => {
  if (!meetingKey) {
    throw new Error("Meeting key is required.");
  }

  const meetings = await fetchData(
    `${BASE_URL}/meetings?meeting_key=${meetingKey}`
  );

  if (!meetings || meetings.length === 0) {
    throw new Error(
      `No meeting found for meeting key ${meetingKey}.`
    );
  }

  return meetings[0];
};



/* =========================================
   DASHBOARD / RACE DATA HELPERS
========================================= */

/**
 * Get the most recently completed Formula 1 Race.
 *
 * IMPORTANT:
 * This is different from getLatestSession().
 * getLatestSession() can return Practice,
 * Qualifying, Sprint, etc.
 *
 * This function ONLY returns Race sessions.
 */
export const getLatestRaceSession = async (
  year = new Date().getFullYear()
) => {
  const sessions = await getSeasonSessions(year);

  const now = Date.now();

  const completedRaces = sessions
    .filter((session) => {
      const name = normalizeText(session.session_name);

      const start = new Date(
        session.date_start
      ).getTime();

      const end = new Date(
        session.date_end
      ).getTime();

      return (
        name === "race" &&
        start <= now &&
        !Number.isNaN(end) &&
        end <= now &&
        session.is_cancelled !== true
      );
    })
    .sort(
      (a, b) =>
        new Date(b.date_end).getTime() -
        new Date(a.date_end).getTime()
    );

  if (completedRaces.length === 0) {
    throw new Error(
      `No completed F1 race found for ${year}.`
    );
  }

  return completedRaces[0];
};


/**
 * Get the latest Race + all important data
 * required by the Dashboard.
 */
export const getLatestRaceData = async (
  year = new Date().getFullYear()
) => {
  const race = await getLatestRaceSession(year);

  const sessionKey = race.session_key;

  const [
    drivers,
    positions,
    laps,
    stints,
  ] = await Promise.all([
    getDrivers(sessionKey),
    getPositions(sessionKey),
    getLaps(sessionKey),
    getStints(sessionKey),
  ]);

  return {
    race,
    sessionKey,
    drivers,
    positions,
    laps,
    stints,
  };
};


/* =========================================
   POSITION CHANGE DATA
========================================= */

/**
 * Build position history for the latest race.
 *
 * Returns:
 *
 * [
 *   {
 *     driver_number: 1,
 *     positions: [
 *       { lap: 1, position: 5 },
 *       { lap: 2, position: 4 },
 *       ...
 *     ]
 *   }
 * ]
 */
export const getRacePositionHistory = async (
  sessionKey
) => {
  validateSessionKey(sessionKey);

  const positions = await getPositions(sessionKey);

  if (!positions || positions.length === 0) {
    return [];
  }

  const grouped = {};

  positions.forEach((entry) => {
    const driverNumber =
      Number(entry.driver_number);

    if (!driverNumber) return;

    if (!grouped[driverNumber]) {
      grouped[driverNumber] = [];
    }

    grouped[driverNumber].push({
      lap: entry.date
        ? entry.date
        : null,
      position: Number(entry.position),
      date: entry.date,
    });
  });

  Object.keys(grouped).forEach((driverNumber) => {
    grouped[driverNumber].sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
  });

  return Object.entries(grouped).map(
    ([driverNumber, history]) => ({
      driverNumber: Number(driverNumber),
      history,
    })
  );
};


/* =========================================
   SECTOR TIMES
========================================= */

/**
 * Get the fastest valid sector times
 * from the race.
 *
 * OpenF1 lap data contains:
 *
 * duration_sector_1
 * duration_sector_2
 * duration_sector_3
 */
export const getRaceSectorTimes = async (
  sessionKey
) => {
  validateSessionKey(sessionKey);

  const laps = await getLaps(sessionKey);

  if (!laps || laps.length === 0) {
    return {
      sector1: null,
      sector2: null,
      sector3: null,
    };
  }

  const validNumber = (value) =>
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0;

  const getBestSector = (key) => {
    const values = laps
      .map((lap) => lap[key])
      .filter(validNumber);

    if (values.length === 0) {
      return null;
    }

    return Math.min(...values);
  };

  return {
    sector1: getBestSector(
      "duration_sector_1"
    ),

    sector2: getBestSector(
      "duration_sector_2"
    ),

    sector3: getBestSector(
      "duration_sector_3"
    ),
  };
};


/* =========================================
   FORMAT SECTOR TIME
========================================= */

export const formatSectorTime = (
  seconds
) => {
  if (
    seconds === null ||
    seconds === undefined ||
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    return "--";
  }

  return seconds.toFixed(3);
};


/* =========================================
   BEST SECTOR DRIVER
========================================= */

/**
 * Find which driver achieved the best
 * time in each sector.
 */
export const getBestSectorDrivers = async (
  sessionKey
) => {
  validateSessionKey(sessionKey);

  const [
    laps,
    drivers,
  ] = await Promise.all([
    getLaps(sessionKey),
    getDrivers(sessionKey),
  ]);

  const findBest = (key) => {
    const validLaps = laps.filter(
      (lap) =>
        typeof lap[key] === "number" &&
        Number.isFinite(lap[key]) &&
        lap[key] > 0
    );

    if (validLaps.length === 0) {
      return null;
    }

    const best = validLaps.reduce(
      (fastest, current) =>
        current[key] < fastest[key]
          ? current
          : fastest
    );

    const driver = drivers.find(
      (item) =>
        Number(item.driver_number) ===
        Number(best.driver_number)
    );

    return {
      driverNumber: best.driver_number,
      acronym:
        driver?.name_acronym ||
        driver?.name_acronym ||
        "--",
      fullName:
        driver?.full_name ||
        "--",
      time: best[key],
    };
  };

  return {
    sector1: findBest(
      "duration_sector_1"
    ),

    sector2: findBest(
      "duration_sector_2"
    ),

    sector3: findBest(
      "duration_sector_3"
    ),
  };
};


/* =========================================
   LAST RACE SUMMARY
========================================= */

/**
 * Simple object for Dashboard header.
 */
export const getLastRaceSummary = async (
  year = new Date().getFullYear()
) => {
  const race =
    await getLatestRaceSession(year);

  return {
    sessionKey: race.session_key,
    meetingKey: race.meeting_key,

    raceName:
      race.meeting_name ||
      race.meeting_official_name ||
      `${race.location} Grand Prix`,

    location: race.location,

    country:
      race.country_name ||
      "",

    dateStart: race.date_start,

    dateEnd: race.date_end,

    sessionName:
      race.session_name,

    circuit:
      race.location,
  };
};

/* =========================================
   DRIVERS
========================================= */

export const getDrivers = async (sessionKey) => {
  validateSessionKey(sessionKey);

  return fetchData(
    `${BASE_URL}/drivers?session_key=${sessionKey}`
  );
};


// Keep this export for compatibility
export const getCircuitDrivers = getDrivers;


/* =========================================
   POSITIONS
========================================= */

export const getPositions = async (sessionKey) => {
  validateSessionKey(sessionKey);

  return fetchData(
    `${BASE_URL}/position?session_key=${sessionKey}`
  );
};


// Keep this export for compatibility
export const getCircuitPositions = getPositions;


/* =========================================
   DRIVER INTERVALS
========================================= */

export const getIntervals = async (sessionKey) => {
  if (!sessionKey) {
    throw new Error("Session key is required for intervals.");
  }

  return fetchData(
    `${BASE_URL}/intervals?session_key=${sessionKey}`
  );
};




/* =========================================
   LAPS
========================================= */

export const getLaps = async (sessionKey) => {
  validateSessionKey(sessionKey);

  return fetchData(
    `${BASE_URL}/laps?session_key=${sessionKey}`
  );
};


/* =========================================
   STINTS
========================================= */

export const getStints = async (sessionKey) => {
  validateSessionKey(sessionKey);

  return fetchData(
    `${BASE_URL}/stints?session_key=${sessionKey}`
  );
};


/* =========================================
   WEATHER
========================================= */

export const getWeather = async (sessionKey) => {
  validateSessionKey(sessionKey);

  return fetchData(
    `${BASE_URL}/weather?session_key=${sessionKey}`
  );
};


/* =========================================
   CIRCUIT MEETINGS
========================================= */

export const getCircuitMeetings = async (
  circuitName,
  year = new Date().getFullYear()
) => {

  const config =
    getCircuitConfig(circuitName);

  /*
    First get meetings for the year.

    This is safer than depending completely
    on one location query.
  */

  let meetings = [];

  if (config?.country) {

    const encodedCountry =
      encodeURIComponent(config.country);

    meetings = await fetchData(
      `${BASE_URL}/meetings?year=${year}&country_name=${encodedCountry}`
    );

  } else {

    meetings = await fetchData(
      `${BASE_URL}/meetings?year=${year}`
    );

  }


  if (!meetings || meetings.length === 0) {
    throw new Error(
      `No OpenF1 meetings found for ${circuitName} in ${year}.`
    );
  }


  /*
    Try to find the EXACT circuit/location.
  */

  if (config) {

    const locationMatch =
      meetings.find((meeting) => {

        const location =
          normalizeText(meeting.location);

        const meetingName =
          normalizeText(meeting.meeting_name);

        const officialName =
          normalizeText(
            meeting.meeting_official_name
          );

        const matchesLocation =
          config.locations.some(
            (name) =>
              location.includes(
                normalizeText(name)
              )
          );

        const matchesMeeting =
          config.meetings.some(
            (name) =>
              meetingName.includes(
                normalizeText(name)
              ) ||
              officialName.includes(
                normalizeText(name)
              )
          );

        return (
          matchesLocation ||
          matchesMeeting
        );
      });


    if (locationMatch) {
      console.log(
        "Exact meeting found:",
        locationMatch
      );

      return [locationMatch];
    }

  }


  /*
    Fallback:
    Return available meetings.
  */

  console.warn(
    "Exact circuit match not found. Using available meeting data:",
    meetings
  );

  return meetings;
};


/* =========================================
   CIRCUIT SESSIONS
========================================= */

export const getCircuitSessions = async (
  circuitName,
  year = new Date().getFullYear()
) => {

  const meetings =
    await getCircuitMeetings(
      circuitName,
      year
    );


  /*
    Get newest meeting
  */

  const meeting =
    [...meetings].sort(
      (a, b) =>
        new Date(b.date_start) -
        new Date(a.date_start)
    )[0];


  if (!meeting?.meeting_key) {
    throw new Error(
      `Invalid meeting data for ${circuitName}.`
    );
  }


  console.log(
    "Using meeting:",
    meeting.meeting_name,
    meeting.meeting_key
  );


  const sessions = await fetchData(
    `${BASE_URL}/sessions?meeting_key=${meeting.meeting_key}`
  );


  if (!sessions || sessions.length === 0) {
    throw new Error(
      `No sessions found for ${meeting.meeting_name}.`
    );
  }


  return sessions;
};


/* =========================================
   BEST CIRCUIT SESSION
========================================= */

export const getCircuitSession = async (
  circuitName,
  year = new Date().getFullYear()
) => {

  const sessions =
    await getCircuitSessions(
      circuitName,
      year
    );


  const sortedSessions =
    [...sessions]
      .filter(
        (session) => session.is_cancelled !== true
      )
      .sort(
        (a, b) =>
          new Date(b.date_start) -
          new Date(a.date_start)
      );

  const now = Date.now();

  // Do not select a future session when a completed/active
  // session is available.
  const startedSessions = sortedSessions.filter(
    (session) =>
      new Date(session.date_start).getTime() <= now
  );

  const usableSessions =
    startedSessions.length > 0
      ? startedSessions
      : sortedSessions;

  /*
    Priority among sessions that have already started:

    Active session
    ↓
    Race
    ↓
    Sprint
    ↓
    Qualifying
    ↓
    Latest session
  */

  const activeSession = usableSessions.find((session) => {
    const start = new Date(session.date_start).getTime();
    const end = new Date(session.date_end).getTime();

    return (
      now >= start &&
      (!Number.isNaN(end) ? now <= end : false)
    );
  });

  if (activeSession) {
    console.log(
      "Using active session:",
      activeSession.session_name,
      activeSession.session_key
    );

    return activeSession;
  }

  const raceSession = usableSessions.find(
    (session) =>
      normalizeText(session.session_name) === "race"
  );

  if (raceSession) {
    console.log(
      "Using Race session:",
      raceSession.session_key
    );

    return raceSession;
  }

  const sprintSession = usableSessions.find(
    (session) =>
      normalizeText(session.session_name) === "sprint"
  );

  if (sprintSession) {
    console.log(
      "Using Sprint session:",
      sprintSession.session_key
    );

    return sprintSession;
  }

  const qualifyingSession = usableSessions.find(
    (session) =>
      normalizeText(session.session_name) === "qualifying"
  );

  if (qualifyingSession) {
    console.log(
      "Using Qualifying session:",
      qualifyingSession.session_key
    );

    return qualifyingSession;
  }

  return usableSessions[0];
};


/* =========================================
   LOCATION / GPS DATA
========================================= */

/*
  IMPORTANT:

  DO NOT call:

  /location?session_key=XXXXX

  for an entire race.

  That can return too much data and cause:

  OpenF1 API Error 422
*/


/*
  Get location data for ONE DRIVER.

  Example:

  getLocations(9161, 1)
*/

export const getLocations = async (
  sessionKey,
  driverNumber
) => {

  validateSessionKey(sessionKey);

  if (!driverNumber) {

    throw new Error(
      "Driver number is required for location data. " +
      "Fetching GPS data for the entire session can cause OpenF1 Error 422."
    );

  }


  return fetchData(
    `${BASE_URL}/location?session_key=${sessionKey}&driver_number=${driverNumber}`
  );
};


/*
  Alternative clearer function name.
*/

export const getDriverLocations =
  getLocations;


/* =========================================
   GET SINGLE DRIVER POSITION DATA
========================================= */

export const getDriverPositions = async (
  sessionKey,
  driverNumber
) => {

  validateSessionKey(sessionKey);

  if (!driverNumber) {
    throw new Error(
      "Driver number is missing."
    );
  }


  return fetchData(
    `${BASE_URL}/position?session_key=${sessionKey}&driver_number=${driverNumber}`
  );
};



// ============================================================
// CHAMPIONSHIP STANDINGS
// ============================================================

/**
 * Get current championship driver standings.
 *
 * OpenF1 only provides championship standings for Race sessions.
 */
export const getChampionshipDrivers = async (sessionKey) => {
  validateSessionKey(sessionKey);

  return fetchData(
    `${BASE_URL}/championship_drivers?session_key=${sessionKey}`
  );
};


/**
 * Get current constructor/team championship standings.
 *
 * OpenF1 only provides championship standings for Race sessions.
 */
export const getChampionshipTeams = async (sessionKey) => {
  validateSessionKey(sessionKey);

  return fetchData(
    `${BASE_URL}/championship_teams?session_key=${sessionKey}`
  );
};
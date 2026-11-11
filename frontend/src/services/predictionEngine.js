/**
 * ============================================================
 * F1 AI PREDICTION ENGINE
 * ============================================================
 *
 * Uses:
 * - OpenF1 session performance
 * - Driver pace
 * - Recent pace
 * - Lap consistency
 * - Current position
 * - Circuit characteristics
 * - Race conditions
 *
 * Designed for RaceVision
 * ============================================================
 */


/* ============================================================
   F1 CIRCUIT DATABASE
============================================================ */

export const F1_TRACKS = {

  Australia: {
    name: "Australia",
    circuit: "Albert Park Circuit",
    country: "Australia",
    lengthKm: 5.278,
    laps: 58,

    characteristics: {
      downforce: 3,
      topSpeed: 4,
      braking: 3,
      corners: 3,
      traction: 3,
      tyreStress: 3,
      overtaking: 4,
      streetCircuit: false
    }
  },


  China: {
    name: "China",
    circuit: "Shanghai International Circuit",
    country: "China",
    lengthKm: 5.451,
    laps: 56,

    characteristics: {
      downforce: 4,
      topSpeed: 4,
      braking: 4,
      corners: 4,
      traction: 4,
      tyreStress: 4,
      overtaking: 4,
      streetCircuit: false
    }
  },


  Japan: {
    name: "Japan",
    circuit: "Suzuka Circuit",
    country: "Japan",
    lengthKm: 5.807,
    laps: 53,

    characteristics: {
      downforce: 5,
      topSpeed: 4,
      braking: 3,
      corners: 5,
      traction: 3,
      tyreStress: 5,
      overtaking: 3,
      streetCircuit: false
    }
  },


  Bahrain: {
    name: "Bahrain",
    circuit: "Bahrain International Circuit",
    country: "Bahrain",
    lengthKm: 5.412,
    laps: 57,

    characteristics: {
      downforce: 3,
      topSpeed: 5,
      braking: 5,
      corners: 3,
      traction: 4,
      tyreStress: 5,
      overtaking: 5,
      streetCircuit: false
    }
  },


  "Saudi Arabia": {
    name: "Saudi Arabia",
    circuit: "Jeddah Corniche Circuit",
    country: "Saudi Arabia",
    lengthKm: 6.174,
    laps: 50,

    characteristics: {
      downforce: 3,
      topSpeed: 5,
      braking: 3,
      corners: 5,
      traction: 3,
      tyreStress: 3,
      overtaking: 5,
      streetCircuit: true
    }
  },


  Miami: {
    name: "Miami",
    circuit: "Miami International Autodrome",
    country: "USA",
    lengthKm: 5.412,
    laps: 57,

    characteristics: {
      downforce: 3,
      topSpeed: 4,
      braking: 5,
      corners: 3,
      traction: 3,
      tyreStress: 3,
      overtaking: 5,
      streetCircuit: false
    }
  },


  "Emilia-Romagna": {
    name: "Emilia-Romagna",
    circuit: "Imola",
    country: "Italy",
    lengthKm: 4.909,
    laps: 63,

    characteristics: {
      downforce: 4,
      topSpeed: 4,
      braking: 4,
      corners: 4,
      traction: 3,
      tyreStress: 3,
      overtaking: 2,
      streetCircuit: false
    }
  },


  Monaco: {
    name: "Monaco",
    circuit: "Circuit de Monaco",
    country: "Monaco",
    lengthKm: 3.337,
    laps: 78,

    characteristics: {
      downforce: 5,
      topSpeed: 1,
      braking: 3,
      corners: 5,
      traction: 5,
      tyreStress: 2,
      overtaking: 1,
      streetCircuit: true
    }
  },


  Spain: {
    name: "Spain",
    circuit: "Circuit de Barcelona-Catalunya",
    country: "Spain",
    lengthKm: 4.657,
    laps: 66,

    characteristics: {
      downforce: 5,
      topSpeed: 3,
      braking: 3,
      corners: 5,
      traction: 3,
      tyreStress: 5,
      overtaking: 3,
      streetCircuit: false
    }
  },


  Canada: {
    name: "Canada",
    circuit: "Circuit Gilles Villeneuve",
    country: "Canada",
    lengthKm: 4.361,
    laps: 70,

    characteristics: {
      downforce: 2,
      topSpeed: 5,
      braking: 5,
      corners: 2,
      traction: 4,
      tyreStress: 3,
      overtaking: 5,
      streetCircuit: false
    }
  },


  Austria: {
    name: "Austria",
    circuit: "Red Bull Ring",
    country: "Austria",
    lengthKm: 4.318,
    laps: 71,

    characteristics: {
      downforce: 3,
      topSpeed: 5,
      braking: 5,
      corners: 2,
      traction: 3,
      tyreStress: 3,
      overtaking: 5,
      streetCircuit: false
    }
  },


  Britain: {
    name: "Britain",
    circuit: "Silverstone Circuit",
    country: "United Kingdom",
    lengthKm: 5.891,
    laps: 52,

    characteristics: {
      downforce: 5,
      topSpeed: 5,
      braking: 3,
      corners: 5,
      traction: 3,
      tyreStress: 5,
      overtaking: 3,
      streetCircuit: false
    }
  },


  "Belgium": {
    name: "Belgium",
    circuit: "Circuit de Spa-Francorchamps",
    country: "Belgium",
    lengthKm: 7.004,
    laps: 44,

    characteristics: {
      downforce: 3,
      topSpeed: 5,
      braking: 4,
      corners: 5,
      traction: 3,
      tyreStress: 5,
      overtaking: 5,
      streetCircuit: false
    }
  },


  Hungary: {
    name: "Hungary",
    circuit: "Hungaroring",
    country: "Hungary",
    lengthKm: 4.381,
    laps: 70,

    characteristics: {
      downforce: 5,
      topSpeed: 2,
      braking: 3,
      corners: 5,
      traction: 5,
      tyreStress: 3,
      overtaking: 2,
      streetCircuit: false
    }
  },


  Netherlands: {
    name: "Netherlands",
    circuit: "Circuit Zandvoort",
    country: "Netherlands",
    lengthKm: 4.259,
    laps: 72,

    characteristics: {
      downforce: 5,
      topSpeed: 3,
      braking: 3,
      corners: 5,
      traction: 5,
      tyreStress: 5,
      overtaking: 2,
      streetCircuit: false
    }
  },


  Italy: {
    name: "Italy",
    circuit: "Monza",
    country: "Italy",
    lengthKm: 5.793,
    laps: 53,

    characteristics: {
      downforce: 1,
      topSpeed: 5,
      braking: 5,
      corners: 2,
      traction: 2,
      tyreStress: 3,
      overtaking: 5,
      streetCircuit: false
    }
  },


  Azerbaijan: {
    name: "Azerbaijan",
    circuit: "Baku City Circuit",
    country: "Azerbaijan",
    lengthKm: 6.003,
    laps: 51,

    characteristics: {
      downforce: 2,
      topSpeed: 5,
      braking: 5,
      corners: 4,
      traction: 3,
      tyreStress: 3,
      overtaking: 5,
      streetCircuit: true
    }
  },


  Singapore: {
    name: "Singapore",
    circuit: "Marina Bay Street Circuit",
    country: "Singapore",
    lengthKm: 4.940,
    laps: 62,

    characteristics: {
      downforce: 5,
      topSpeed: 2,
      braking: 5,
      corners: 5,
      traction: 5,
      tyreStress: 5,
      overtaking: 3,
      streetCircuit: true
    }
  },


  "United States": {
    name: "United States",
    circuit: "Circuit of the Americas",
    country: "USA",
    lengthKm: 5.513,
    laps: 56,

    characteristics: {
      downforce: 4,
      topSpeed: 4,
      braking: 4,
      corners: 5,
      traction: 3,
      tyreStress: 4,
      overtaking: 5,
      streetCircuit: false
    }
  },


  Mexico: {
    name: "Mexico",
    circuit: "Autódromo Hermanos Rodríguez",
    country: "Mexico",
    lengthKm: 4.304,
    laps: 71,

    characteristics: {
      downforce: 3,
      topSpeed: 5,
      braking: 5,
      corners: 3,
      traction: 3,
      tyreStress: 3,
      overtaking: 4,
      streetCircuit: false
    }
  },


  Brazil: {
    name: "Brazil",
    circuit: "Interlagos",
    country: "Brazil",
    lengthKm: 4.309,
    laps: 71,

    characteristics: {
      downforce: 3,
      topSpeed: 4,
      braking: 3,
      corners: 3,
      traction: 4,
      tyreStress: 4,
      overtaking: 5,
      streetCircuit: false
    }
  },


  "Las Vegas": {
    name: "Las Vegas",
    circuit: "Las Vegas Strip Circuit",
    country: "USA",
    lengthKm: 6.201,
    laps: 50,

    characteristics: {
      downforce: 2,
      topSpeed: 5,
      braking: 5,
      corners: 3,
      traction: 3,
      tyreStress: 2,
      overtaking: 5,
      streetCircuit: true
    }
  },


  Qatar: {
    name: "Qatar",
    circuit: "Lusail International Circuit",
    country: "Qatar",
    lengthKm: 5.419,
    laps: 57,

    characteristics: {
      downforce: 5,
      topSpeed: 4,
      braking: 3,
      corners: 5,
      traction: 3,
      tyreStress: 5,
      overtaking: 3,
      streetCircuit: false
    }
  },


  "Abu Dhabi": {
    name: "Abu Dhabi",
    circuit: "Yas Marina Circuit",
    country: "United Arab Emirates",
    lengthKm: 5.281,
    laps: 58,

    characteristics: {
      downforce: 3,
      topSpeed: 4,
      braking: 5,
      corners: 3,
      traction: 3,
      tyreStress: 3,
      overtaking: 4,
      streetCircuit: false
    }
  }

};


/* ============================================================
   CIRCUIT NAME ALIASES
============================================================ */

export const getTrackProfile = (trackName) => {

  if (!trackName) {
    return null;
  }

  const name = trackName.toLowerCase().trim();

  const aliases = {

    "silverstone": "Britain",
    "silverstone circuit": "Britain",
    "great britain": "Britain",
    "british": "Britain",

    "spa": "Belgium",
    "spa-francorchamps": "Belgium",
    "spa francorchamps": "Belgium",

    "suzuka": "Japan",
    "suzuka circuit": "Japan",

    "monza": "Italy",

    "imola": "Emilia-Romagna",

    "interlagos": "Brazil",

    "baku": "Azerbaijan",

    "cota": "United States",
    "austin": "United States",

    "jeddah": "Saudi Arabia",

    "lusail": "Qatar",

    "yas marina": "Abu Dhabi",

    "las vegas strip circuit": "Las Vegas",

    "miami international autodrome": "Miami"

  };


  const key =
    aliases[name] ||
    Object.keys(F1_TRACKS).find(
      (key) =>
        key.toLowerCase() === name
    );


  return key
    ? F1_TRACKS[key]
    : null;
};


/* ============================================================
   AVERAGE LAP TIME
============================================================ */

const getAverageLapTime = (laps = []) => {

  const validLaps = laps.filter(
    (lap) =>
      Number.isFinite(lap.lap_duration) &&
      lap.lap_duration > 0
  );


  if (validLaps.length === 0) {
    return null;
  }


  const total = validLaps.reduce(
    (sum, lap) =>
      sum + lap.lap_duration,
    0
  );


  return total / validLaps.length;
};


/* ============================================================
   LAP CONSISTENCY
============================================================ */

const getConsistency = (laps = []) => {

  const validLaps = laps.filter(
    (lap) =>
      Number.isFinite(lap.lap_duration) &&
      lap.lap_duration > 0
  );


  if (validLaps.length < 2) {
    return 50;
  }


  const average =
    getAverageLapTime(validLaps);


  const variance =
    validLaps.reduce(
      (sum, lap) =>
        sum +
        Math.pow(
          lap.lap_duration - average,
          2
        ),
      0
    ) / validLaps.length;


  const standardDeviation =
    Math.sqrt(variance);


  return Math.max(
    0,
    Math.min(
      100,
      100 - standardDeviation * 10
    )
  );
};


/* ============================================================
   RECENT PACE
============================================================ */

const getRecentPace = (laps = []) => {

  const validLaps = laps
    .filter(
      (lap) =>
        Number.isFinite(lap.lap_duration) &&
        lap.lap_duration > 0
    )
    .slice(-5);


  if (validLaps.length === 0) {
    return null;
  }


  const total =
    validLaps.reduce(
      (sum, lap) =>
        sum + lap.lap_duration,
      0
    );


  return total / validLaps.length;
};


/* ============================================================
   DRIVER PERFORMANCE
============================================================ */

export const calculateDriverPerformance = (
  drivers = [],
  laps = [],
  positions = []
) => {

  return drivers.map((driver) => {

    const driverNumber =
      Number(
        driver.number ??
        driver.driver_number
      );


    const driverLaps =
      laps.filter(
        (lap) =>
          Number(lap.driver_number) ===
          driverNumber
      );


    const driverPositions =
      positions.filter(
        (position) =>
          Number(position.driver_number) ===
          driverNumber
      );


    const latestPosition =
      driverPositions.length > 0
        ? Number(
            driverPositions[
              driverPositions.length - 1
            ].position
          )
        : null;


    const averageLap =
      getAverageLapTime(driverLaps);


    const recentPace =
      getRecentPace(driverLaps);


    const consistency =
      getConsistency(driverLaps);


    return {

      ...driver,

      number: driverNumber,

      position: latestPosition,

      averageLap,

      recentPace,

      consistency,

      lapCount:
        driverLaps.length

    };

  });

};


/* ============================================================
   TRACK CONDITION SCORE
============================================================ */

const calculateTrackAdjustment = (
  driver,
  track
) => {

  if (!track) {
    return 0;
  }


  /*
   *
   * We don't pretend that OpenF1 gives us
   * a driver's exact ability in every category.
   *
   * This is therefore a small adjustment,
   * not the main prediction.
   *
   */


  let adjustment = 0;


  const position =
    driver.position || 20;


  /*
   * Current position remains the strongest
   * indicator of actual session performance.
   */

  if (position <= 3) {
    adjustment += 4;
  } else if (position <= 6) {
    adjustment += 2;
  } else if (position <= 10) {
    adjustment += 1;
  }


  /*
   * Consistency becomes more important
   * on high tyre-stress circuits.
   */

  if (
    track.characteristics.tyreStress >= 4 &&
    driver.consistency >= 85
  ) {
    adjustment += 3;
  }


  if (
    track.characteristics.tyreStress >= 4 &&
    driver.consistency < 60
  ) {
    adjustment -= 2;
  }


  /*
   * High overtaking circuits reduce the
   * importance of starting position slightly.
   */

  if (
    track.characteristics.overtaking >= 4
  ) {

    if (position <= 5) {
      adjustment += 1;
    }

  }


  /*
   * Street circuits reward consistency,
   * traction and precision.
   */

  if (
    track.characteristics.streetCircuit &&
    driver.consistency >= 80
  ) {
    adjustment += 2;
  }


  return adjustment;
};


/* ============================================================
   RACE CONDITION ADJUSTMENT
============================================================ */

export const calculateConditionAdjustment = (
  condition = "Dry",
  driver
) => {

  if (!driver) {
    return 0;
  }


  const value =
    String(condition)
      .toLowerCase();


  let adjustment = 0;


  /*
   * Wet conditions increase the importance
   * of consistency.
   */

  if (
    value.includes("wet") ||
    value.includes("rain")
  ) {

    if (driver.consistency >= 85) {
      adjustment += 4;
    } else if (
      driver.consistency >= 70
    ) {
      adjustment += 2;
    } else {
      adjustment -= 2;
    }

  }


  /*
   * Dry conditions reward raw pace.
   */

  if (
    value.includes("dry")
  ) {

    if (
      driver.recentPace !== null
    ) {
      adjustment += 1;
    }

  }


  /*
   * Mixed conditions are unpredictable,
   * so consistency gets additional weight.
   */

  if (
    value.includes("mixed") ||
    value.includes("changeable")
  ) {

    if (driver.consistency >= 85) {
      adjustment += 3;
    }

  }


  return adjustment;
};


/* ============================================================
   CALCULATE PREDICTION PROBABILITIES
============================================================ */

export const calculateProbabilities = (
  performanceData = [],
  trackName = null,
  raceCondition = "Dry"
) => {

  if (
    !performanceData ||
    performanceData.length === 0
  ) {
    return [];
  }


  const track =
    getTrackProfile(trackName);


  const driversWithPace =
    performanceData.filter(
      (driver) =>
        driver.averageLap !== null &&
        driver.averageLap > 0
    );


  const fastestAverage =
    driversWithPace.length > 0
      ? Math.min(
          ...driversWithPace.map(
            (driver) =>
              driver.averageLap
          )
        )
      : null;


  const recentDrivers =
    driversWithPace.filter(
      (driver) =>
        driver.recentPace !== null &&
        driver.recentPace > 0
    );


  const fastestRecent =
    recentDrivers.length > 0
      ? Math.min(
          ...recentDrivers.map(
            (driver) =>
              driver.recentPace
          )
        )
      : null;


  const scoredDrivers =
    performanceData.map((driver) => {

      let score = 0;


      /* ========================================
         CURRENT POSITION
      ======================================== */

      if (
        driver.position &&
        driver.position > 0
      ) {

        const positionScore =
          Math.max(
            0,
            31 - driver.position
          ) /
          30 *
          25;


        score += positionScore;

      }


      /* ========================================
         AVERAGE PACE
      ======================================== */

      if (
        driver.averageLap &&
        fastestAverage
      ) {

        const paceRatio =
          fastestAverage /
          driver.averageLap;


        const paceScore =
          Math.min(
            1,
            paceRatio
          ) *
          30;


        score += paceScore;

      }


      /* ========================================
         CONSISTENCY
      ======================================== */

      score +=
        (driver.consistency / 100) *
        15;


      /* ========================================
         RECENT PACE
      ======================================== */

      if (
        driver.recentPace &&
        fastestRecent
      ) {

        const recentRatio =
          fastestRecent /
          driver.recentPace;


        const recentScore =
          Math.min(
            1,
            recentRatio
          ) *
          20;


        score += recentScore;

      }


      /* ========================================
         CIRCUIT ADJUSTMENT
      ======================================== */

      score +=
        calculateTrackAdjustment(
          driver,
          track
        );


      /* ========================================
         WEATHER / CONDITION
      ======================================== */

      score +=
        calculateConditionAdjustment(
          raceCondition,
          driver
        );


      return {

        ...driver,

        predictionScore:
          Math.round(
            score * 100
          ) / 100

      };

    });


  /* ========================================================
     SORT DRIVERS
  ======================================================== */

  const sorted =
    [...scoredDrivers]
      .sort(
        (a, b) =>
          b.predictionScore -
          a.predictionScore
      );


  /* ========================================================
     NORMALIZED PROBABILITY
  ======================================================== */

  const totalScore =
    sorted.reduce(
      (sum, driver) =>
        sum +
        Math.max(
          0,
          driver.predictionScore
        ),
      0
    );


  return sorted.map(
    (driver, index) => {

      const probability =
        totalScore > 0
          ? (
              Math.max(
                0,
                driver.predictionScore
              ) /
              totalScore
            ) *
            100
          : 0;


      return {

        ...driver,

        rank: index + 1,

        winProbability:
          Math.round(
            probability * 10
          ) / 10,

        performanceScore:
          Math.round(
            driver.predictionScore * 10
          ) / 10

      };

    }
  );

};


/* ============================================================
   GENERATE PREDICTION REASONS
============================================================ */

export const generatePredictionReasons = (
  driver,
  fastestAverage,
  fastestRecent,
  trackName = null,
  raceCondition = "Dry"
) => {

  const reasons = [];


  /* ========================================
     CURRENT POSITION
  ======================================== */

  if (
    driver.position &&
    driver.position <= 3
  ) {

    reasons.push(
      "🏁 Strong current race position"
    );

  } else if (
    driver.position &&
    driver.position <= 8
  ) {

    reasons.push(
      "📊 Competitive track position"
    );

  }


  /* ========================================
     AVERAGE PACE
  ======================================== */

  if (
    driver.averageLap &&
    fastestAverage
  ) {

    const difference =
      driver.averageLap -
      fastestAverage;


    if (difference < 0.5) {

      reasons.push(
        "⚡ Excellent overall race pace"
      );

    } else if (
      difference < 1.5
    ) {

      reasons.push(
        "⚡ Competitive lap pace"
      );

    }

  }


  /* ========================================
     RECENT PACE
  ======================================== */

  if (
    driver.recentPace &&
    fastestRecent
  ) {

    const difference =
      driver.recentPace -
      fastestRecent;


    if (difference < 0.5) {

      reasons.push(
        "🔥 Strong recent performance"
      );

    } else if (
      difference < 1.5
    ) {

      reasons.push(
        "📈 Competitive recent laps"
      );

    }

  }


  /* ========================================
     CONSISTENCY
  ======================================== */

  if (
    driver.consistency >= 85
  ) {

    reasons.push(
      "🎯 Excellent lap consistency"
    );

  } else if (
    driver.consistency >= 70
  ) {

    reasons.push(
      "🎯 Good race consistency"
    );

  }


  /* ========================================
     TRACK
  ======================================== */

  const track =
    getTrackProfile(trackName);


  if (track) {

    if (
      track.characteristics.streetCircuit &&
      driver.consistency >= 80
    ) {

      reasons.push(
        `🏙️ Strong fit for ${track.name}`
      );

    } else if (
      track.characteristics.overtaking >= 4
    ) {

      reasons.push(
        `🏎️ Track favors overtaking`
      );

    }

  }


  /* ========================================
     CONDITIONS
  ======================================== */

  if (
    raceCondition &&
    raceCondition !== "Dry"
  ) {

    if (
      driver.consistency >= 80
    ) {

      reasons.push(
        `🌦️ Strong performance profile for ${raceCondition.toLowerCase()} conditions`
      );

    }

  }


  /* ========================================
     FALLBACK
  ======================================== */

  if (
    reasons.length === 0
  ) {

    reasons.push(
      "📊 Performance data analysis"
    );

  }


  return reasons.slice(0, 4);

};


/* ============================================================
   COMPLETE AI PREDICTION
============================================================ */

export const generateRacePrediction = ({
  drivers = [],
  laps = [],
  positions = [],
  trackName = "Monaco",
  raceCondition = "Dry"
}) => {

  const performanceData =
    calculateDriverPerformance(
      drivers,
      laps,
      positions
    );


  const predictions =
    calculateProbabilities(
      performanceData,
      trackName,
      raceCondition
    );


  if (
    predictions.length === 0
  ) {

    return {

      predictions: [],

      podium: [],

      winner: null,

      confidence: 0,

      track:
        getTrackProfile(trackName),

      condition:
        raceCondition

    };

  }


  const podium =
    predictions.slice(0, 3);


  const winner =
    predictions[0];


  /*
   * Confidence is based on how much
   * the predicted winner separates
   * from the second-place driver.
   */

  const second =
    predictions[1];


  let confidence = 50;


  if (second) {

    const difference =
      winner.performanceScore -
      second.performanceScore;


    confidence =
      Math.min(
        98,
        Math.max(
          50,
          50 + difference * 3
        )
      );

  }


  return {

    predictions,

    podium,

    winner,

    confidence:
      Math.round(
        confidence
      ),

    track:
      getTrackProfile(trackName),

    condition:
      raceCondition

  };

};
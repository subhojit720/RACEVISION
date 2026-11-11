/**
 * ============================================
 * RACEVISION AI PREDICTOR CONFIGURATION
 * ============================================
 *
 * Circuit characteristics are used as prediction
 * inputs together with real OpenF1 performance data.
 */

export const TRACK_CONDITIONS = [
  {
    id: "dry",
    name: "Dry",
    description: "Dry track with normal grip",
    grip: 1.0,
    tyreWear: 1.0,
    weatherRisk: 0.05,
  },

  {
    id: "mixed",
    name: "Mixed",
    description: "Changing conditions",
    grip: 0.88,
    tyreWear: 1.15,
    weatherRisk: 0.35,
  },

  {
    id: "wet",
    name: "Wet",
    description: "Wet track",
    grip: 0.72,
    tyreWear: 1.25,
    weatherRisk: 0.65,
  },

  {
    id: "heavy-wet",
    name: "Heavy Wet",
    description: "Heavy rain and very low grip",
    grip: 0.55,
    tyreWear: 1.35,
    weatherRisk: 0.9,
  },
];


/**
 * ============================================
 * 2026 F1 CIRCUITS
 * ============================================
 */

export const F1_CIRCUITS = [

  {
    id: "australia",
    name: "Australian Grand Prix",
    shortName: "Australia",
    circuit: "Albert Park",
    country: "Australia",

    characteristics: {
      highSpeed: 8,
      lowSpeed: 6,
      downforce: 7,
      tyreWear: 6,
      overtaking: 6,
      streetCircuit: true,
      weatherSensitivity: 7,
    },
  },

  {
    id: "china",
    name: "Chinese Grand Prix",
    shortName: "China",
    circuit: "Shanghai International Circuit",
    country: "China",

    characteristics: {
      highSpeed: 8,
      lowSpeed: 6,
      downforce: 7,
      tyreWear: 7,
      overtaking: 8,
      streetCircuit: false,
      weatherSensitivity: 6,
    },
  },

  {
    id: "japan",
    name: "Japanese Grand Prix",
    shortName: "Japan",
    circuit: "Suzuka",
    country: "Japan",

    characteristics: {
      highSpeed: 10,
      lowSpeed: 6,
      downforce: 9,
      tyreWear: 7,
      overtaking: 6,
      streetCircuit: false,
      weatherSensitivity: 8,
    },
  },

  {
    id: "bahrain",
    name: "Bahrain Grand Prix",
    shortName: "Bahrain",
    circuit: "Bahrain International Circuit",
    country: "Bahrain",

    characteristics: {
      highSpeed: 8,
      lowSpeed: 8,
      downforce: 7,
      tyreWear: 10,
      overtaking: 9,
      streetCircuit: false,
      weatherSensitivity: 2,
    },
  },

  {
    id: "saudi-arabia",
    name: "Saudi Arabian Grand Prix",
    shortName: "Saudi Arabia",
    circuit: "Jeddah Corniche Circuit",
    country: "Saudi Arabia",

    characteristics: {
      highSpeed: 10,
      lowSpeed: 4,
      downforce: 6,
      tyreWear: 5,
      overtaking: 8,
      streetCircuit: true,
      weatherSensitivity: 2,
    },
  },

  {
    id: "miami",
    name: "Miami Grand Prix",
    shortName: "Miami",
    circuit: "Miami International Autodrome",
    country: "United States",

    characteristics: {
      highSpeed: 8,
      lowSpeed: 7,
      downforce: 7,
      tyreWear: 7,
      overtaking: 7,
      streetCircuit: false,
      weatherSensitivity: 6,
    },
  },

  {
    id: "emilia-romagna",
    name: "Emilia-Romagna Grand Prix",
    shortName: "Emilia-Romagna",
    circuit: "Imola",
    country: "Italy",

    characteristics: {
      highSpeed: 8,
      lowSpeed: 7,
      downforce: 8,
      tyreWear: 6,
      overtaking: 4,
      streetCircuit: false,
      weatherSensitivity: 7,
    },
  },

  {
    id: "monaco",
    name: "Monaco Grand Prix",
    shortName: "Monaco",
    circuit: "Circuit de Monaco",
    country: "Monaco",

    characteristics: {
      highSpeed: 3,
      lowSpeed: 10,
      downforce: 10,
      tyreWear: 4,
      overtaking: 2,
      streetCircuit: true,
      weatherSensitivity: 8,
    },
  },

  {
    id: "spain",
    name: "Spanish Grand Prix",
    shortName: "Spain",
    circuit: "Circuit de Barcelona-Catalunya",
    country: "Spain",

    characteristics: {
      highSpeed: 8,
      lowSpeed: 8,
      downforce: 9,
      tyreWear: 8,
      overtaking: 7,
      streetCircuit: false,
      weatherSensitivity: 4,
    },
  },

  {
    id: "canada",
    name: "Canadian Grand Prix",
    shortName: "Canada",
    circuit: "Circuit Gilles-Villeneuve",
    country: "Canada",

    characteristics: {
      highSpeed: 9,
      lowSpeed: 7,
      downforce: 5,
      tyreWear: 5,
      overtaking: 9,
      streetCircuit: false,
      weatherSensitivity: 8,
    },
  },

  {
    id: "austria",
    name: "Austrian Grand Prix",
    shortName: "Austria",
    circuit: "Red Bull Ring",
    country: "Austria",

    characteristics: {
      highSpeed: 9,
      lowSpeed: 6,
      downforce: 6,
      tyreWear: 6,
      overtaking: 8,
      streetCircuit: false,
      weatherSensitivity: 7,
    },
  },

  {
    id: "great-britain",
    name: "British Grand Prix",
    shortName: "Great Britain",
    circuit: "Silverstone",
    country: "United Kingdom",

    characteristics: {
      highSpeed: 10,
      lowSpeed: 5,
      downforce: 9,
      tyreWear: 8,
      overtaking: 8,
      streetCircuit: false,
      weatherSensitivity: 9,
    },
  },

  {
    id: "belgium",
    name: "Belgian Grand Prix",
    shortName: "Belgium",
    circuit: "Spa-Francorchamps",
    country: "Belgium",

    characteristics: {
      highSpeed: 10,
      lowSpeed: 5,
      downforce: 7,
      tyreWear: 7,
      overtaking: 9,
      streetCircuit: false,
      weatherSensitivity: 10,
    },
  },

  {
    id: "hungary",
    name: "Hungarian Grand Prix",
    shortName: "Hungary",
    circuit: "Hungaroring",
    country: "Hungary",

    characteristics: {
      highSpeed: 4,
      lowSpeed: 10,
      downforce: 10,
      tyreWear: 7,
      overtaking: 3,
      streetCircuit: false,
      weatherSensitivity: 6,
    },
  },

  {
    id: "netherlands",
    name: "Dutch Grand Prix",
    shortName: "Netherlands",
    circuit: "Zandvoort",
    country: "Netherlands",

    characteristics: {
      highSpeed: 7,
      lowSpeed: 8,
      downforce: 9,
      tyreWear: 8,
      overtaking: 4,
      streetCircuit: false,
      weatherSensitivity: 9,
    },
  },

  {
    id: "italy",
    name: "Italian Grand Prix",
    shortName: "Italy",
    circuit: "Monza",
    country: "Italy",

    characteristics: {
      highSpeed: 10,
      lowSpeed: 3,
      downforce: 4,
      tyreWear: 5,
      overtaking: 10,
      streetCircuit: false,
      weatherSensitivity: 5,
    },
  },

  {
    id: "azerbaijan",
    name: "Azerbaijan Grand Prix",
    shortName: "Azerbaijan",
    circuit: "Baku City Circuit",
    country: "Azerbaijan",

    characteristics: {
      highSpeed: 10,
      lowSpeed: 7,
      downforce: 5,
      tyreWear: 5,
      overtaking: 9,
      streetCircuit: true,
      weatherSensitivity: 4,
    },
  },

  {
    id: "singapore",
    name: "Singapore Grand Prix",
    shortName: "Singapore",
    circuit: "Marina Bay Street Circuit",
    country: "Singapore",

    characteristics: {
      highSpeed: 4,
      lowSpeed: 10,
      downforce: 10,
      tyreWear: 9,
      overtaking: 5,
      streetCircuit: true,
      weatherSensitivity: 8,
    },
  },

  {
    id: "united-states",
    name: "United States Grand Prix",
    shortName: "USA",
    circuit: "Circuit of the Americas",
    country: "United States",

    characteristics: {
      highSpeed: 9,
      lowSpeed: 8,
      downforce: 8,
      tyreWear: 8,
      overtaking: 9,
      streetCircuit: false,
      weatherSensitivity: 6,
    },
  },

  {
    id: "mexico",
    name: "Mexico City Grand Prix",
    shortName: "Mexico",
    circuit: "Autódromo Hermanos Rodríguez",
    country: "Mexico",

    characteristics: {
      highSpeed: 9,
      lowSpeed: 7,
      downforce: 6,
      tyreWear: 6,
      overtaking: 8,
      streetCircuit: false,
      weatherSensitivity: 5,
    },
  },

  {
    id: "sao-paulo",
    name: "São Paulo Grand Prix",
    shortName: "Brazil",
    circuit: "Interlagos",
    country: "Brazil",

    characteristics: {
      highSpeed: 8,
      lowSpeed: 7,
      downforce: 7,
      tyreWear: 7,
      overtaking: 9,
      streetCircuit: false,
      weatherSensitivity: 9,
    },
  },

  {
    id: "las-vegas",
    name: "Las Vegas Grand Prix",
    shortName: "Las Vegas",
    circuit: "Las Vegas Strip Circuit",
    country: "United States",

    characteristics: {
      highSpeed: 10,
      lowSpeed: 5,
      downforce: 4,
      tyreWear: 4,
      overtaking: 9,
      streetCircuit: true,
      weatherSensitivity: 3,
    },
  },

  {
    id: "qatar",
    name: "Qatar Grand Prix",
    shortName: "Qatar",
    circuit: "Lusail International Circuit",
    country: "Qatar",

    characteristics: {
      highSpeed: 9,
      lowSpeed: 5,
      downforce: 8,
      tyreWear: 9,
      overtaking: 7,
      streetCircuit: false,
      weatherSensitivity: 3,
    },
  },

  {
    id: "abu-dhabi",
    name: "Abu Dhabi Grand Prix",
    shortName: "Abu Dhabi",
    circuit: "Yas Marina Circuit",
    country: "United Arab Emirates",

    characteristics: {
      highSpeed: 8,
      lowSpeed: 8,
      downforce: 8,
      tyreWear: 7,
      overtaking: 8,
      streetCircuit: false,
      weatherSensitivity: 2,
    },
  },

];


/**
 * ============================================
 * FIND CIRCUIT
 * ============================================
 */

export const getCircuitConfig = (circuitName) => {

  if (!circuitName) {
    return null;
  }

  const search = circuitName
    .toLowerCase()
    .trim();

  return (
    F1_CIRCUITS.find((circuit) => {

      return (
        circuit.name.toLowerCase().includes(search) ||
        circuit.shortName.toLowerCase().includes(search) ||
        circuit.circuit.toLowerCase().includes(search)
      );

    }) || null
  );
};


/**
 * ============================================
 * FIND TRACK CONDITION
 * ============================================
 */

export const getTrackCondition = (conditionId) => {

  return (
    TRACK_CONDITIONS.find(
      (condition) =>
        condition.id === conditionId
    ) || TRACK_CONDITIONS[0]
  );

};
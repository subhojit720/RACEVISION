import { useState } from "react";
import "./Predictor.css";

import {
  Brain,
  Trophy,
  CloudRain,
  Sun,
  Wind,
  Gauge,
  History,
  Zap,
  MapPin,
  Thermometer,
  Sparkles,
  ChevronDown,
  Activity,
  Target,
} from "lucide-react";

import {
  calculateProbabilities,
  generatePredictionReasons,
} from "../services/predictionEngine";


/* =========================================================
   2026 F1 CIRCUITS
========================================================= */

const CIRCUITS = [
  {
    shortName: "Australia",
    circuit: "Albert Park Circuit",
    country: "Australia",
    flag: "🇦🇺",
    type: "Street",
    characteristics: "Medium-high speed, technical corners",
    downforce: "Medium",
    tyreWear: "Medium",
  },
  {
    shortName: "China",
    circuit: "Shanghai International Circuit",
    country: "China",
    flag: "🇨🇳",
    type: "Permanent",
    characteristics: "Long straights, heavy braking",
    downforce: "Medium",
    tyreWear: "High",
  },
  {
    shortName: "Japan",
    circuit: "Suzuka Circuit",
    country: "Japan",
    flag: "🇯🇵",
    type: "Permanent",
    characteristics: "High-speed, technical, flowing",
    downforce: "High",
    tyreWear: "Medium",
  },
  {
    shortName: "Bahrain",
    circuit: "Bahrain International Circuit",
    country: "Bahrain",
    flag: "🇧🇭",
    type: "Permanent",
    characteristics: "Heavy braking, traction zones",
    downforce: "Medium",
    tyreWear: "High",
  },
  {
    shortName: "Saudi Arabia",
    circuit: "Jeddah Corniche Circuit",
    country: "Saudi Arabia",
    flag: "🇸🇦",
    type: "Street",
    characteristics: "Very high speed, walls close to track",
    downforce: "Medium",
    tyreWear: "Low",
  },
  {
    shortName: "Miami",
    circuit: "Miami International Autodrome",
    country: "United States",
    flag: "🇺🇸",
    type: "Street",
    characteristics: "Long straights, slow corners",
    downforce: "Medium",
    tyreWear: "Medium",
  },
  {
    shortName: "Imola",
    circuit: "Imola Circuit",
    country: "Italy",
    flag: "🇮🇹",
    type: "Permanent",
    characteristics: "Technical, narrow, kerbs",
    downforce: "High",
    tyreWear: "Medium",
  },
  {
    shortName: "Monaco",
    circuit: "Circuit de Monaco",
    country: "Monaco",
    flag: "🇲🇨",
    type: "Street",
    characteristics: "Low speed, extreme precision",
    downforce: "Very High",
    tyreWear: "Low",
  },
  {
    shortName: "Spain",
    circuit: "Circuit de Barcelona-Catalunya",
    country: "Spain",
    flag: "🇪🇸",
    type: "Permanent",
    characteristics: "Balanced aerodynamic test",
    downforce: "High",
    tyreWear: "Medium",
  },
  {
    shortName: "Canada",
    circuit: "Circuit Gilles Villeneuve",
    country: "Canada",
    flag: "🇨🇦",
    type: "Semi-street",
    characteristics: "Long straights, chicanes, braking",
    downforce: "Low",
    tyreWear: "Medium",
  },
  {
    shortName: "Austria",
    circuit: "Red Bull Ring",
    country: "Austria",
    flag: "🇦🇹",
    type: "Permanent",
    characteristics: "Short lap, long straights",
    downforce: "Medium",
    tyreWear: "Medium",
  },
  {
    shortName: "Britain",
    circuit: "Silverstone Circuit",
    country: "United Kingdom",
    flag: "🇬🇧",
    type: "Permanent",
    characteristics: "Very high-speed corners",
    downforce: "High",
    tyreWear: "High",
  },
  {
    shortName: "Belgium",
    circuit: "Circuit de Spa-Francorchamps",
    country: "Belgium",
    flag: "🇧🇪",
    type: "Permanent",
    characteristics: "High speed, elevation changes",
    downforce: "Medium",
    tyreWear: "Medium",
  },
  {
    shortName: "Hungary",
    circuit: "Hungaroring",
    country: "Hungary",
    flag: "🇭🇺",
    type: "Permanent",
    characteristics: "Slow technical corners",
    downforce: "Very High",
    tyreWear: "Medium",
  },
  {
    shortName: "Netherlands",
    circuit: "Circuit Zandvoort",
    country: "Netherlands",
    flag: "🇳🇱",
    type: "Permanent",
    characteristics: "Banked corners, flowing layout",
    downforce: "High",
    tyreWear: "High",
  },
  {
    shortName: "Italy",
    circuit: "Monza Circuit",
    country: "Italy",
    flag: "🇮🇹",
    type: "Permanent",
    characteristics: "Very high speed, low downforce",
    downforce: "Low",
    tyreWear: "Low",
  },
  {
    shortName: "Azerbaijan",
    circuit: "Baku City Circuit",
    country: "Azerbaijan",
    flag: "🇦🇿",
    type: "Street",
    characteristics: "Huge straight, heavy braking",
    downforce: "Low",
    tyreWear: "Low",
  },
  {
    shortName: "Singapore",
    circuit: "Marina Bay Street Circuit",
    country: "Singapore",
    flag: "🇸🇬",
    type: "Street",
    characteristics: "Slow corners, high heat",
    downforce: "Very High",
    tyreWear: "Very High",
  },
  {
    shortName: "United States",
    circuit: "Circuit of the Americas",
    country: "United States",
    flag: "🇺🇸",
    type: "Permanent",
    characteristics: "Technical sectors, elevation",
    downforce: "High",
    tyreWear: "High",
  },
  {
    shortName: "Mexico",
    circuit: "Autódromo Hermanos Rodríguez",
    country: "Mexico",
    flag: "🇲🇽",
    type: "Permanent",
    characteristics: "High altitude, long straight",
    downforce: "High",
    tyreWear: "Medium",
  },
  {
    shortName: "Brazil",
    circuit: "Interlagos",
    country: "Brazil",
    flag: "🇧🇷",
    type: "Permanent",
    characteristics: "Short lap, elevation, weather risk",
    downforce: "Medium",
    tyreWear: "Medium",
  },
  {
    shortName: "Las Vegas",
    circuit: "Las Vegas Strip Circuit",
    country: "United States",
    flag: "🇺🇸",
    type: "Street",
    characteristics: "Very long straight, low temperatures",
    downforce: "Low",
    tyreWear: "Low",
  },
  {
    shortName: "Qatar",
    circuit: "Lusail International Circuit",
    country: "Qatar",
    flag: "🇶🇦",
    type: "Permanent",
    characteristics: "High-speed flowing corners",
    downforce: "High",
    tyreWear: "Very High",
  },
  {
    shortName: "Abu Dhabi",
    circuit: "Yas Marina Circuit",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    type: "Permanent",
    characteristics: "Long straights, traction zones",
    downforce: "Medium",
    tyreWear: "Medium",
  },
];


/* =========================================================
   TRACK CONDITIONS
========================================================= */

const TRACK_CONDITIONS = [
  {
    value: "dry",
    label: "Dry",
    icon: Sun,
    description: "Normal dry-track conditions",
  },
  {
    value: "hot",
    label: "Hot & Dry",
    icon: Thermometer,
    description: "High temperature and increased tyre degradation",
  },
  {
    value: "cool",
    label: "Cool & Dry",
    icon: Wind,
    description: "Low temperature and difficult tyre warm-up",
  },
  {
    value: "damp",
    label: "Damp",
    icon: CloudRain,
    description: "Mixed grip with possible intermediate tyres",
  },
  {
    value: "wet",
    label: "Wet",
    icon: CloudRain,
    description: "Heavy rain and wet-track conditions",
  },
];


/* =========================================================
   DRIVER DATA
========================================================= */

const DEFAULT_DRIVERS = [
  "Lando Norris",
  "Max Verstappen",
  "Oscar Piastri",
  "Charles Leclerc",
  "George Russell",
  "Lewis Hamilton",
  "Kimi Antonelli",
  "Fernando Alonso",
  "Lance Stroll",
  "Carlos Sainz",
];


/* =========================================================
   PREDICTOR
========================================================= */

export default function Predictor() {
  const [selectedCircuit, setSelectedCircuit] = useState(CIRCUITS[0]);
  const [trackCondition, setTrackCondition] = useState("dry");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const condition = TRACK_CONDITIONS.find(
    (item) => item.value === trackCondition
  );

  const ConditionIcon = condition?.icon || Sun;


  /* =====================================================
     RUN AI PREDICTION
  ===================================================== */

  const runPrediction = async () => {
    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      const simulatedDrivers = DEFAULT_DRIVERS.map(
        (name, index) => ({
          number: index + 1,
          name,
          acronym: name
            .split(" ")
            .map((x) => x[0])
            .join(""),
        })
      );

      const performance = simulatedDrivers.map(
        (driver, index) => {
          let circuitBonus = 0;

          /* Low downforce */
          if (selectedCircuit.downforce === "Low") {
            if (
              [
                "Max Verstappen",
                "Lando Norris",
                "Charles Leclerc",
              ].includes(driver.name)
            ) {
              circuitBonus += 7;
            }
          }

          /* Very high downforce */
          if (selectedCircuit.downforce === "Very High") {
            if (
              [
                "Lando Norris",
                "Oscar Piastri",
                "Charles Leclerc",
              ].includes(driver.name)
            ) {
              circuitBonus += 6;
            }
          }

          /* Wet / damp */
          if (
            trackCondition === "wet" ||
            trackCondition === "damp"
          ) {
            if (
              [
                "Max Verstappen",
                "Lando Norris",
                "Lewis Hamilton",
                "Fernando Alonso",
              ].includes(driver.name)
            ) {
              circuitBonus += 8;
            }
          }

          /* Hot */
          if (trackCondition === "hot") {
            if (
              [
                "Max Verstappen",
                "Lando Norris",
                "Charles Leclerc",
              ].includes(driver.name)
            ) {
              circuitBonus += 5;
            }
          }

          return {
            ...driver,

            position: Math.max(1, index + 1),

            averageLap:
              90 +
              index * 0.35 -
              circuitBonus * 0.05,

            recentPace:
              90 +
              index * 0.3 -
              circuitBonus * 0.06,

            consistency:
              92 -
              index * 1.5 +
              circuitBonus * 0.2,

            circuitBonus,
            lapCount: 20,
          };
        }
      );

      const scored = calculateProbabilities(
        performance
      );

      const sorted = [...scored].sort(
        (a, b) =>
          (b.performanceScore || 0) -
          (a.performanceScore || 0)
      );

      const fastestAverage = Math.min(
        ...performance.map(
          (driver) => driver.averageLap
        )
      );

      const fastestRecent = Math.min(
        ...performance.map(
          (driver) => driver.recentPace
        )
      );

      const finalPrediction = sorted
        .slice(0, 10)
        .map((driver) => ({
          ...driver,
          reasons: generatePredictionReasons(
            driver,
            fastestAverage,
            fastestRecent
          ),
        }));

      setPrediction(finalPrediction);

      const historyItem = {
        circuit: selectedCircuit.shortName,
        circuitName: selectedCircuit.circuit,
        condition: trackCondition,
        winner:
          finalPrediction[0]?.name || "Unknown",
        timestamp: new Date().toLocaleString(),
      };

      setHistory((previous) => [
        historyItem,
        ...previous,
      ]);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to generate prediction."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="predictor-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="predictor-header">

        <div className="predictor-heading">

          <div className="predictor-eyebrow">
            FORMULA 1 ANALYTICS
          </div>

          <h1>
            Race Predictor
          </h1>

          <p>
            Predict Formula 1 race outcomes using
            circuit characteristics, track conditions,
            driver performance and race pace.
          </p>

        </div>

        <div className="ai-status">

          <span className="ai-status-dot" />

          AI ENGINE READY

        </div>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="predictor-grid">

        {/* =================================================
            LEFT CONFIGURATION
        ================================================= */}

        <section className="prediction-config">

          <div className="config-title">

            <div className="icon-box">
              <Brain size={27} />
            </div>

            <div>
              <h2>
                Prediction Configuration
              </h2>

              <p>
                Configure the circuit and race
                conditions used by the prediction model.
              </p>
            </div>

          </div>


          {/* CIRCUIT */}

          <div className="config-field">

            <label>
              <MapPin size={15} />
              SELECT CIRCUIT
            </label>

            <div className="select-wrapper">

              <select
                value={selectedCircuit.shortName}
                onChange={(event) => {
                  const circuit =
                    CIRCUITS.find(
                      (item) =>
                        item.shortName ===
                        event.target.value
                    );

                  if (circuit) {
                    setSelectedCircuit(circuit);
                  }
                }}
              >

                {CIRCUITS.map(
                  (circuit) => (
                    <option
                      key={circuit.shortName}
                      value={circuit.shortName}
                    >
                      {circuit.flag}{" "}
                      {circuit.shortName}
                    </option>
                  )
                )}

              </select>

              <ChevronDown size={17} />

            </div>

          </div>


          {/* TRACK CONDITION */}

          <div className="config-field">

            <label>
              <Gauge size={15} />
              TRACK CONDITION
            </label>

            <div className="select-wrapper">

              <select
                value={trackCondition}
                onChange={(event) =>
                  setTrackCondition(
                    event.target.value
                  )
                }
              >

                {TRACK_CONDITIONS.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}

              </select>

              <ChevronDown size={17} />

            </div>

          </div>


          {/* CIRCUIT INFORMATION */}

          <div className="circuit-info">

            <div className="circuit-info-header">

              <div className="circuit-flag">
                {selectedCircuit.flag}
              </div>

              <div>

                <strong>
                  {selectedCircuit.circuit}
                </strong>

                <span>
                  {selectedCircuit.country}
                </span>

              </div>

            </div>


            <div className="track-stats">

              <div className="track-stat">

                <span>
                  TYPE
                </span>

                <strong>
                  {selectedCircuit.type}
                </strong>

              </div>

              <div className="track-stat">

                <span>
                  DOWNFORCE
                </span>

                <strong>
                  {selectedCircuit.downforce}
                </strong>

              </div>

              <div className="track-stat">

                <span>
                  TYRE WEAR
                </span>

                <strong>
                  {selectedCircuit.tyreWear}
                </strong>

              </div>

            </div>


            <div className="track-characteristics">

              <Zap size={17} />

              <span>
                {selectedCircuit.characteristics}
              </span>

            </div>

          </div>


          {/* CONDITION */}

          <div className="selected-condition">

            <div className="condition-icon">
              <ConditionIcon size={21} />
            </div>

            <div>

              <strong>
                {condition?.label}
              </strong>

              <span>
                {condition?.description}
              </span>

            </div>

          </div>


          {/* AI BUTTON */}

          <button
            className={`prediction-button ${
              loading ? "is-loading" : ""
            }`}
            onClick={runPrediction}
            disabled={loading}
          >

            <span className="button-icon">

              {loading ? (
                <Activity size={19} />
              ) : (
                <Sparkles size={19} />
              )}

            </span>

            <span className="button-content">

              <strong>
                {loading
                  ? "ANALYZING RACE DATA..."
                  : "RUN AI PREDICTION"}
              </strong>

              <small>
                {loading
                  ? "Processing driver performance"
                  : "Generate race outcome analysis"}
              </small>

            </span>

            {!loading && (
              <span className="button-arrow">
                →
              </span>
            )}

          </button>


          {error && (
            <div className="prediction-error">
              {error}
            </div>
          )}

        </section>


        {/* =================================================
            RIGHT — PREDICTED PODIUM
        ================================================= */}

        <section className="prediction-results">

          <div className="results-glow" />

          <div className="results-header">

            <div>

              <div className="results-eyebrow">
                PREDICTED PODIUM
              </div>

              <h2>
                Top 3 Finishers
              </h2>

              <span className="results-circuit">
                {selectedCircuit.flag}{" "}
                {selectedCircuit.shortName}
              </span>

            </div>

            <div className="trophy-icon">
              <Trophy size={27} />
            </div>

          </div>


          {prediction.length === 0 ? (

            /* EMPTY */

            <div className="empty-prediction">

              <div className="empty-trophy">
                <Trophy size={38} />
              </div>

              <h3>
                AI Prediction
              </h3>

              <p>
                Configure your circuit and track
                conditions, then run the AI engine
                to generate the predicted podium.
              </p>

              <div className="empty-hint">

                <Sparkles size={14} />

                <span>
                  Ready for analysis
                </span>

              </div>

            </div>

          ) : (

            /* PODIUM */

            <div className="podium">

              {prediction
                .slice(0, 3)
                .map(
                  (driver, index) => {

                    const confidence = Math.min(
                      99,
                      Math.round(
                        driver.performanceScore *
                        1.05
                      )
                    );

                    return (
                      <div
                        className={`podium-card podium-${index + 1}`}
                        key={driver.name}
                      >

                        <div className="podium-top">

                          <div className="podium-position">
                            {index + 1}
                          </div>

                          <div className="podium-medal">

                            {index === 0
                              ? "🏆"
                              : index === 1
                              ? "🥈"
                              : "🥉"}

                          </div>

                        </div>


                        <div className="podium-driver">

                          <strong>
                            {driver.name}
                          </strong>

                          <span>
                            {driver.acronym}
                          </span>

                        </div>


                        <div className="podium-score">

                          <span>
                            PERFORMANCE
                          </span>

                          <strong>
                            {Number(
                              driver.performanceScore
                            ).toFixed(1)}
                          </strong>

                        </div>


                        <div className="podium-confidence">

                          <div>
                            <span>
                              CONFIDENCE
                            </span>

                            <strong>
                              {confidence}%
                            </strong>
                          </div>

                          <div className="confidence-bar">

                            <span
                              style={{
                                width: `${confidence}%`,
                              }}
                            />

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

            </div>

          )}

        </section>

      </main>


      {/* =================================================
          FULL RANKING
      ================================================= */}

      {prediction.length > 0 && (

        <section className="prediction-ranking">

          <div className="ranking-header">

            <div>

              <div className="ranking-eyebrow">
                AI PERFORMANCE MODEL
              </div>

              <h2>
                Predicted Race Order
              </h2>

              <p>
                Model ranking based on circuit,
                conditions and estimated race pace.
              </p>

            </div>

            <div className="ranking-badge">

              <Target size={15} />

              {selectedCircuit.flag}{" "}
              {selectedCircuit.shortName}

            </div>

          </div>


          <div className="ranking-list">

            {prediction.map(
              (driver, index) => (

                <div
                  className="ranking-row"
                  key={driver.name}
                >

                  <div className="ranking-position">

                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}

                  </div>


                  <div className="ranking-driver">

                    <div className="driver-main">

                      <strong>
                        {driver.name}
                      </strong>

                      <span>
                        {driver.acronym}
                      </span>

                    </div>

                    <small>
                      {driver.reasons?.join(
                        " • "
                      )}
                    </small>

                  </div>


                  <div className="ranking-score">

                    <span>
                      SCORE
                    </span>

                    <strong>
                      {Number(
                        driver.performanceScore
                      ).toFixed(1)}
                    </strong>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

      )}


      {/* =================================================
          PREDICTION HISTORY
      ================================================= */}

      <section className="prediction-history">

        <div className="history-header">

          <div>

            <div className="history-eyebrow">
              AI MEMORY
            </div>

            <h2>
              Prediction History
            </h2>

          </div>

          <div className="history-icon">
            <History size={21} />
          </div>

        </div>


        {history.length === 0 ? (

          <div className="history-empty">

            <History size={28} />

            <p>
              No prediction history yet.
              Run an AI prediction to save it here.
            </p>

          </div>

        ) : (

          <div className="history-list">

            {history.map(
              (item, index) => (

                <div
                  className="history-row"
                  key={`${item.timestamp}-${index}`}
                >

                  <div className="history-circuit">

                    <strong>
                      {item.circuit}
                    </strong>

                    <span>
                      {item.circuitName}
                    </span>

                  </div>


                  <div className="history-condition">

                    <span>
                      {item.condition.toUpperCase()}
                    </span>

                  </div>


                  <div className="history-winner">

                    <strong>
                      🏆 {item.winner}
                    </strong>

                    <span>
                      {item.timestamp}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}
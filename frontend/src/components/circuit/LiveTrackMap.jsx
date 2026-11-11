import { useEffect, useMemo, useState } from "react";
import {
  LoaderCircle,
  AlertCircle,
  Activity,
  RotateCcw,
} from "lucide-react";

import {
  getCircuitSession,
  getLocations,
  getCircuitDrivers,
  getWeather,
} from "../../services/openF1Api";


/* =========================================
   CIRCUIT LOCATION FALLBACKS
========================================= */

const CIRCUIT_LOCATIONS = {
  Bahrain: "Sakhir",
  SaudiArabia: "Jeddah",
  Australia: "Melbourne",
  Japan: "Suzuka",
  China: "Shanghai",
  Miami: "Miami",
  EmiliaRomagna: "Imola",
  Monaco: "Monte Carlo",
  Spain: "Barcelona",
  Canada: "Montréal",
  Austria: "Spielberg",
  GreatBritain: "Silverstone",
  Belgium: "Spa-Francorchamps",
  Hungary: "Budapest",
  Netherlands: "Zandvoort",
  Italy: "Monza",
  Azerbaijan: "Baku",
  Singapore: "Marina Bay",
  UnitedStates: "Austin",
  Mexico: "Mexico City",
  Brazil: "São Paulo",
  LasVegas: "Las Vegas",
  Qatar: "Lusail",
  AbuDhabi: "Yas Marina",
};


/* =========================================
   GET CIRCUIT LOCATION SAFELY
========================================= */

const getCircuitLocation = (circuit) => {

  if (!circuit) return null;

  // First try the API location
  if (circuit.apiLocation) {
    return circuit.apiLocation;
  }

  // Other possible property names
  if (circuit.location) {
    return circuit.location;
  }

  if (circuit.api_location) {
    return circuit.api_location;
  }

  // Try circuit name mapping
  if (circuit.name) {

    const cleanName =
      circuit.name
        .replace(/\s+/g, "")
        .replace(/-/g, "");

    if (CIRCUIT_LOCATIONS[circuit.name]) {
      return CIRCUIT_LOCATIONS[circuit.name];
    }

    if (CIRCUIT_LOCATIONS[cleanName]) {
      return CIRCUIT_LOCATIONS[cleanName];
    }

  }

  return null;

};


/* =========================================
   COMPONENT
========================================= */

function LiveTrackMap({ circuit }) {

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [session, setSession] =
    useState(null);

  const [trackPoints, setTrackPoints] =
    useState([]);

  const [drivers, setDrivers] =
    useState([]);

  const [weather, setWeather] =
    useState(null);

  const [retry, setRetry] =
    useState(0);


  /* =========================================
     LOAD TRACK DATA
  ========================================= */

  useEffect(() => {

    let cancelled = false;


    const loadTrackData = async () => {

      try {

        setLoading(true);
        setError("");

        setTrackPoints([]);
        setDrivers([]);
        setWeather(null);


        /* ===============================
           GET LOCATION
        ================================ */

        const location =
          getCircuitLocation(circuit);


        if (!location) {

          throw new Error(
            "Circuit location is missing."
          );

        }


        console.log(
          "Loading circuit:",
          circuit?.name
        );

        console.log(
          "Using OpenF1 location:",
          location
        );


        /* ===============================
           GET SESSION
        ================================ */

        const selectedSession =
          await getCircuitSession(location);


        if (!selectedSession?.session_key) {

          throw new Error(
            "No valid Formula 1 session found."
          );

        }


        if (cancelled) return;


        setSession(selectedSession);


        console.log(
          "Session found:",
          selectedSession
        );


        /* ===============================
           LOAD API DATA
        ================================ */

        const [
          locations,
          driverData,
          weatherData,
        ] = await Promise.all([

          getLocations(
            selectedSession.session_key
          ),

          getCircuitDrivers(
            selectedSession.session_key
          ),

          getWeather(
            selectedSession.session_key
          ),

        ]);


        if (cancelled) return;


        /* ===============================
           VALIDATE LOCATION DATA
        ================================ */

        if (
          !locations ||
          locations.length === 0
        ) {

          throw new Error(
            "No GPS track coordinates are available for this session."
          );

        }


        /* ===============================
           SORT LOCATION DATA
        ================================ */

        const sortedLocations =
          [...locations].sort(
            (a, b) =>
              new Date(a.date) -
              new Date(b.date)
          );


        /*
          Sample the coordinates.

          OpenF1 can return thousands
          of points, so this prevents
          the SVG from becoming slow.
        */

        const maxPoints = 1500;

        const step =
          Math.max(
            1,
            Math.floor(
              sortedLocations.length /
              maxPoints
            )
          );


        const sampledLocations =
          sortedLocations.filter(
            (_, index) =>
              index % step === 0
          );


        /* ===============================
           CALCULATE TRACK BOUNDS
        ================================ */

        const validPoints =
          sampledLocations.filter(
            (point) =>
              typeof point.x === "number" &&
              typeof point.y === "number"
          );


        if (validPoints.length === 0) {

          throw new Error(
            "Invalid track coordinate data."
          );

        }


        const xs =
          validPoints.map(
            (point) => point.x
          );

        const ys =
          validPoints.map(
            (point) => point.y
          );


        const minX =
          Math.min(...xs);

        const maxX =
          Math.max(...xs);

        const minY =
          Math.min(...ys);

        const maxY =
          Math.max(...ys);


        /* ===============================
           SVG SIZE
        ================================ */

        const width = 900;
        const height = 600;

        const padding = 80;


        const scaleX =
          (width - padding * 2) /
          (maxX - minX || 1);


        const scaleY =
          (height - padding * 2) /
          (maxY - minY || 1);


        const scale =
          Math.min(
            scaleX,
            scaleY
          );


        /* ===============================
           NORMALIZE TRACK POINTS
        ================================ */

        const normalizedPoints =
          validPoints.map((point) => ({

            x:
              (point.x - minX) *
              scale +
              padding,

            y:
              height -
              (
                (point.y - minY) *
                scale +
                padding
              ),

            driver_number:
              point.driver_number,

            date:
              point.date,

          }));


        if (cancelled) return;


        setTrackPoints(
          normalizedPoints
        );


        /* ===============================
           CREATE DRIVER MAP
        ================================ */

        const driverMap = {};


        driverData.forEach(
          (driver) => {

            driverMap[
              driver.driver_number
            ] = {

              number:
                driver.driver_number,

              abbreviation:
                driver.name_acronym ||
                String(
                  driver.driver_number
                ),

              name:
                driver.full_name ||
                driver.name_acronym ||
                `Driver ${driver.driver_number}`,

              team:
                driver.team_name ||
                "Unknown Team",

              color:
                driver.team_colour
                  ? `#${driver.team_colour}`
                  : "#ffffff",

            };

          }
        );


        /* ===============================
           GET LATEST LOCATION
           FOR EVERY DRIVER
        ================================ */

        const latestLocations = {};


        sortedLocations.forEach(
          (locationPoint) => {

            if (
              locationPoint.driver_number !==
              undefined
            ) {

              latestLocations[
                locationPoint.driver_number
              ] = locationPoint;

            }

          }
        );


        /* ===============================
           FORMAT DRIVERS
        ================================ */

        const formattedDrivers =
          Object.values(
            latestLocations
          )
            .map((point) => {

              const driver =
                driverMap[
                  point.driver_number
                ];


              if (!driver) {
                return null;
              }


              return {

                ...driver,

                x:
                  (point.x - minX) *
                  scale +
                  padding,

                y:
                  height -
                  (
                    (point.y - minY) *
                    scale +
                    padding
                  ),

              };

            })
            .filter(Boolean);


        if (cancelled) return;


        setDrivers(
          formattedDrivers
        );


        /* ===============================
           WEATHER
        ================================ */

        if (
          weatherData &&
          weatherData.length > 0
        ) {

          setWeather(
            weatherData[
              weatherData.length - 1
            ]
          );

        }


      } catch (err) {

        console.error(
          "Live Track Map Error:",
          err
        );


        if (!cancelled) {

          setError(
            err.message ||
            "Failed to load track data."
          );

        }

      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    };


    loadTrackData();


    return () => {

      cancelled = true;

    };

  }, [circuit, retry]);


  /* =========================================
     CREATE SVG PATH
  ========================================= */

  const trackPath =
    useMemo(() => {

      if (
        !trackPoints ||
        trackPoints.length === 0
      ) {

        return "";

      }


      return trackPoints
        .map(
          (point, index) =>

            `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`

        )
        .join(" ");

    }, [trackPoints]);


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (

      <div className="live-track-state">

        <LoaderCircle
          size={48}
          className="loading-spin"
        />

        <h2>
          Loading Track Data
        </h2>

        <p>
          Fetching real Formula 1 location coordinates...
        </p>

      </div>

    );

  }


  /* =========================================
     ERROR
  ========================================= */

  if (error) {

    return (

      <div className="live-track-state error-state">

        <AlertCircle size={48} />

        <h2>
          Track Data Unavailable
        </h2>

        <p>
          {error}
        </p>

        <strong>
          Circuit: {circuit?.name || "Unknown"}
        </strong>

        <button
          className="track-retry-button"
          onClick={() =>
            setRetry(
              (value) => value + 1
            )
          }
        >

          <RotateCcw size={16} />

          Try Again

        </button>

      </div>

    );

  }


  /* =========================================
     MAIN UI
  ========================================= */

  return (

    <div className="live-track-container">


      {/* HEADER */}

      <div className="live-track-header">

        <div>

          <div className="live-track-status">

            <span></span>

            HISTORICAL REPLAY

          </div>


          <h2>
            {circuit?.name || "Formula 1 Circuit"}
          </h2>


          {session && (

            <p>

              {session.session_name}

              {" • "}

              {session.year}

            </p>

          )}

        </div>


        <div className="track-weather">

          <Activity size={18} />

          <div>

            <span>
              TRACK TEMPERATURE
            </span>

            <strong>

              {weather?.track_temperature
                ? `${Math.round(
                    weather.track_temperature
                  )}°C`
                : "--"}

            </strong>

          </div>

        </div>

      </div>


      {/* TRACK */}

      <div className="track-svg-wrapper">

        {trackPath ? (

          <svg
            viewBox="0 0 900 600"
            className="live-track-svg"
          >


            {/* TRACK SHADOW */}

            <path
              d={trackPath}
              fill="none"
              stroke="#0b0d12"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />


            {/* MAIN TRACK */}

            <path
              d={trackPath}
              fill="none"
              stroke="#2c313d"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />


            {/* RACING LINE */}

            <path
              d={trackPath}
              fill="none"
              stroke="#e10600"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />


            {/* DRIVER MARKERS */}

            {drivers.map(
              (driver) => (

                <g
                  key={driver.number}
                  className="track-driver"
                >

                  <circle
                    cx={driver.x}
                    cy={driver.y}
                    r="14"
                    fill={driver.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />


                  <text
                    x={driver.x}
                    y={driver.y + 4}
                    textAnchor="middle"
                    fill="#000000"
                    fontSize="8"
                    fontWeight="800"
                  >

                    {driver.abbreviation}

                  </text>

                </g>

              )
            )}

          </svg>

        ) : (

          <div className="no-track-data">

            No track coordinates available

          </div>

        )}

      </div>


      {/* DRIVER LIST */}

      <div className="track-driver-list">

        {drivers
          .slice(0, 10)
          .map(
            (driver) => (

              <div
                className="track-driver-row"
                key={driver.number}
              >

                <span
                  className="driver-colour"
                  style={{
                    background:
                      driver.color,
                  }}
                />


                <strong>
                  {driver.abbreviation}
                </strong>


                <span>
                  {driver.team}
                </span>

              </div>

            )
          )}

      </div>

    </div>

  );

}


export default LiveTrackMap;
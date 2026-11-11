import { useEffect, useState } from "react";
import {
  Radio,
  RefreshCw,
  CircleAlert,
} from "lucide-react";

import LapTimeChart from "../components/dashboard/LapTimeChart";
import RacePositionChart from "../components/dashboard/RacePositionChart";

import {
  getDrivers,
  getPositions,
  getLaps,
  getStints,
} from "../services/openF1Api";

import {
  getCurrentSession,
  getSessionDisplayName,
} from "../services/sessionManager";

import { f1Calendar2026 } from "../services/f1Calendar";


/* =========================================================
   FIND LAST COMPLETED RACE
========================================================= */

const getLastCompletedRace = () => {
  const now = Date.now();

  const completedRaces = f1Calendar2026
    .filter(
      (race) =>
        new Date(race.raceDate).getTime() <= now
    )
    .sort(
      (a, b) =>
        new Date(b.raceDate).getTime() -
        new Date(a.raceDate).getTime()
    );

  return completedRaces[0] || null;
};


/* =========================================================
   LIVE TIMING
========================================================= */

function LiveTiming() {

  /* =======================================================
     STATE
  ======================================================= */

  const [drivers, setDrivers] = useState([]);

  const [lapData, setLapData] = useState([]);

  const [positionData, setPositionData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [currentSession, setCurrentSession] =
    useState(null);

  const [lastUpdated, setLastUpdated] =
    useState(null);

  const [sessionName, setSessionName] =
    useState("");


  /* =======================================================
     LAST RACE
  ======================================================= */

  const lastRace = getLastCompletedRace();


  /* =======================================================
     FETCH LIVE DATA
  ======================================================= */

  const fetchLiveData = async () => {

    try {

      setLoading(true);

      setError("");


      /* =====================================================
         1. GET CURRENT F1 SESSION
      ===================================================== */

      const sessionInfo =
        await getCurrentSession();


      if (!sessionInfo) {

        throw new Error(
          "Unable to determine current F1 session."
        );

      }


      /* =====================================================
         2. SAVE SESSION INFORMATION
      ===================================================== */

      setCurrentSession(sessionInfo);


      setSessionName(
        `${sessionInfo.location} • ${getSessionDisplayName(
          sessionInfo
        )}`
      );


      /* =====================================================
         3. SESSION KEY
      ===================================================== */

      const sessionKey =
        sessionInfo.sessionKey;


      if (!sessionKey) {

        throw new Error(
          "F1 session key is missing."
        );

      }


      /* =====================================================
         4. GET DRIVERS
      ===================================================== */

      const driverData =
        await getDrivers(sessionKey);


      await new Promise(
        (resolve) =>
          setTimeout(resolve, 300)
      );


      /* =====================================================
         5. GET POSITIONS
      ===================================================== */

      const positions =
        await getPositions(sessionKey);


      setPositionData(
        positions
      );


      await new Promise(
        (resolve) =>
          setTimeout(resolve, 300)
      );


      /* =====================================================
         6. GET LAP DATA
      ===================================================== */

      const laps =
        await getLaps(sessionKey);


      setLapData(
        laps
      );


      await new Promise(
        (resolve) =>
          setTimeout(resolve, 300)
      );


      /* =====================================================
         7. GET TYRE / STINT DATA
      ===================================================== */

      const stints =
        await getStints(sessionKey);


      /* =====================================================
         FIND LATEST POSITIONS
      ===================================================== */

      const latestPositions = {};


      positions.forEach(
        (position) => {

          latestPositions[
            position.driver_number
          ] = position;

        }
      );


      /* =====================================================
         FIND LATEST LAP
      ===================================================== */

      const latestLaps = {};


      laps.forEach(
        (lap) => {

          const driverNumber =
            lap.driver_number;


          if (
            !latestLaps[driverNumber] ||
            lap.lap_number >
              latestLaps[driverNumber].lap_number
          ) {

            latestLaps[driverNumber] =
              lap;

          }

        }
      );


      /* =====================================================
         ORGANIZE DRIVER STINTS
      ===================================================== */

      const driverStints = {};


      stints.forEach(
        (stint) => {

          const driverNumber =
            stint.driver_number;


          if (
            !driverStints[driverNumber]
          ) {

            driverStints[driverNumber] =
              [];

          }


          driverStints[driverNumber].push(
            stint
          );

        }
      );


      /* =====================================================
         SORT STINTS
      ===================================================== */

      Object.keys(
        driverStints
      ).forEach(
        (driverNumber) => {

          driverStints[
            driverNumber
          ].sort(
            (a, b) =>
              a.lap_start -
              b.lap_start
          );

        }
      );


      /* =====================================================
         COMBINE DRIVER DATA
      ===================================================== */

      const liveDrivers =
        driverData
          .map(
            (driver) => {

              const driverNumber =
                driver.driver_number;


              const lap =
                latestLaps[
                  driverNumber
                ];


              const driverTyreStints =
                driverStints[
                  driverNumber
                ] || [];


              const latestStint =
                driverTyreStints.length > 0
                  ? driverTyreStints[
                      driverTyreStints.length - 1
                    ]
                  : null;


              return {

                number:
                  driverNumber,

                name:
                  driver.full_name,

                abbreviation:
                  driver.name_acronym,

                team:
                  driver.team_name,

                teamColor:
                  driver.team_colour,


                /* POSITION */

                position:
                  latestPositions[
                    driverNumber
                  ]?.position || "-",


                /* GAP */

                gap:
                  latestPositions[
                    driverNumber
                  ]?.gap_to_leader || null,


                /* LAP */

                lapNumber:
                  lap?.lap_number || "-",


                /* LAP TIME */

                lapTime:
                  lap?.lap_duration
                    ? `${lap.lap_duration.toFixed(
                        3
                      )}s`
                    : "-",


                /* SECTOR 1 */

                sector1:
                  lap?.duration_sector_1
                    ? lap.duration_sector_1.toFixed(
                        3
                      )
                    : "-",


                /* SECTOR 2 */

                sector2:
                  lap?.duration_sector_2
                    ? lap.duration_sector_2.toFixed(
                        3
                      )
                    : "-",


                /* SECTOR 3 */

                sector3:
                  lap?.duration_sector_3
                    ? lap.duration_sector_3.toFixed(
                        3
                      )
                    : "-",


                /* CURRENT TYRE */

                tyre:
                  latestStint?.compound ||
                  "-",


                /* ALL STINTS */

                stints:
                  driverTyreStints,

              };

            }
          )


          /* =================================================
             SORT BY POSITION
          ================================================= */

          .sort(
            (a, b) => {

              if (
                a.position === "-"
              ) {

                return 1;

              }


              if (
                b.position === "-"
              ) {

                return -1;

              }


              return (
                a.position -
                b.position
              );

            }
          );


      /* =====================================================
         SAVE DATA
      ===================================================== */

      setDrivers(
        liveDrivers
      );


      setLastUpdated(
        new Date()
      );


    } catch (err) {

      console.error(
        "Live Timing Error:",
        err
      );


      setError(
        err.message ||
        "Unable to load Formula 1 data"
      );


    } finally {

      setLoading(false);

    }

  };


  /* =======================================================
     INITIAL LOAD + AUTO REFRESH
  ======================================================= */

  useEffect(
    () => {

      fetchLiveData();


      const interval =
        setInterval(
          fetchLiveData,
          15000
        );


      return () =>
        clearInterval(
          interval
        );

    },
    []
  );


  /* =======================================================
     PAGE
  ======================================================= */

  return (

    <div className="live-page">


      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            REAL-TIME FORMULA 1 DATA
          </p>


          <h1>
            Live Timing
          </h1>


          <p className="page-description">

            {sessionName ||
              "Loading latest Formula 1 session..."}

          </p>


          {/* =================================================
              LAST RACE
          ================================================= */}

          {lastRace && (

            <div
              className="last-race-info"
            >

              <div className="last-race-label">
                LAST RACE
              </div>


              <div className="last-race-main">

                <span className="last-race-flag">
                  {lastRace.flag}
                </span>


                <div>

                  <strong>
                    {lastRace.name}
                  </strong>


                  <span>
                    {lastRace.circuit}
                  </span>

                </div>

              </div>


              <div className="last-race-date">

                {new Date(
                  lastRace.raceDate
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}

              </div>

            </div>

          )}

        </div>


        {/* =================================================
            REFRESH BUTTON
        ================================================= */}

        <button
          className="refresh-btn"
          onClick={fetchLiveData}
          disabled={loading}
        >

          <RefreshCw
            size={16}
          />


          {loading
            ? "LOADING..."
            : "REFRESH"}

        </button>

      </div>


      {/* ===================================================
          LIVE STATUS
      =================================================== */}

      <div className="live-session-bar">

        <div className="live-session-title">

          <span
            className="live-pulse"
          />

          <Radio
            size={18}
          />

          <strong>
            OPENF1 DATA CONNECTION
          </strong>

        </div>


        {lastUpdated && (

          <span>

            Updated:{" "}
            {lastUpdated.toLocaleTimeString()}

          </span>

        )}

      </div>


      {/* ===================================================
          LOADING
      =================================================== */}

      {loading &&
        drivers.length === 0 && (

          <div className="live-loading">

            🏎️ Loading Formula 1 data...

          </div>

        )}


      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (

        <div className="live-error">

          <CircleAlert
            size={20}
          />


          <div>

            <strong>
              Unable to load F1 data
            </strong>


            <p>
              {error}
            </p>

          </div>

        </div>

      )}


      {/* ===================================================
          LIVE TIMING TABLE
      =================================================== */}

      {drivers.length > 0 && (

        <div className="card live-timing-card">


          {/* TABLE HEADER */}

          <div className="live-table-head">

            <span>
              POS
            </span>

            <span>
              DRIVER
            </span>

            <span>
              GAP
            </span>

            <span>
              LAP
            </span>

            <span>
              LAST LAP
            </span>

            <span>
              TYRE
            </span>

          </div>


          {/* DRIVER ROWS */}

          {drivers.map(
            (driver) => (

              <div
                className="live-driver-row"
                key={driver.number}
              >


                {/* POSITION */}

                <div className="live-position">

                  {driver.position}

                </div>


                {/* DRIVER */}

                <div className="live-driver">

                  <div
                    className="team-color"
                    style={{
                      backgroundColor:
                        driver.teamColor
                          ? `#${driver.teamColor}`
                          : "#e10600",
                    }}
                  />


                  <div>

                    <strong>
                      {driver.abbreviation}
                    </strong>


                    <span>
                      {driver.name}
                    </span>

                  </div>

                </div>


                {/* GAP */}

                <div className="live-gap">

                  {Number(
                    driver.position
                  ) === 1

                    ? "LEADER"

                    : driver.gap

                    ? `+${Number(
                        driver.gap
                      ).toFixed(3)}`

                    : "-"

                  }

                </div>


                {/* LAP */}

                <div className="live-lap">

                  {driver.lapNumber}

                </div>


                {/* LAP TIME */}

                <div className="live-laptime">

                  {driver.lapTime}

                </div>


                {/* TYRE */}

                <div
                  className={`tyre tyre-${String(
                    driver.tyre
                  ).toLowerCase()}`}
                >

                  {driver.tyre}

                </div>


              </div>

            )
          )}

        </div>

      )}


      {/* ===================================================
          SECTOR TIMES
      =================================================== */}

      {drivers.length > 0 && (

        <div className="card sector-times-card">


          <div className="sector-times-header">

            <div>

              <p className="card-label">
                LIVE PERFORMANCE
              </p>


              <h2>
                Sector Times
              </h2>

            </div>


            <div className="sector-legend">

              <span className="sector-purple">
                S1
              </span>

              <span className="sector-yellow">
                S2
              </span>

              <span className="sector-green">
                S3
              </span>

            </div>

          </div>


          {/* HEADER */}

          <div className="sector-table-head">

            <span>
              DRIVER
            </span>

            <span>
              S1
            </span>

            <span>
              S2
            </span>

            <span>
              S3
            </span>

          </div>


          {/* DRIVER ROWS */}

          {drivers.map(
            (driver) => (

              <div
                className="sector-driver-row"
                key={driver.number}
              >

                <div className="sector-driver-name">

                  <strong>
                    {driver.abbreviation}
                  </strong>


                  <span>
                    {driver.team}
                  </span>

                </div>


                <div className="sector-time sector-s1">

                  {driver.sector1}

                </div>


                <div className="sector-time sector-s2">

                  {driver.sector2}

                </div>


                <div className="sector-time sector-s3">

                  {driver.sector3}

                </div>

              </div>

            )
          )}

        </div>

      )}


      {/* ===================================================
          TYRE STRATEGY
      =================================================== */}

      {drivers.length > 0 && (

        <div className="card tire-strategy-card">


          <div className="tire-strategy-header">

            <div>

              <p className="card-label">
                RACE STRATEGY
              </p>


              <h2>
                Tire Strategy
              </h2>

            </div>


            <span className="strategy-status">
              STINT ANALYSIS
            </span>

          </div>


          {/* HEADER */}

          <div className="tire-table-head">

            <span>
              DRIVER
            </span>

            <span>
              TYRE STRATEGY
            </span>

          </div>


          {/* STRATEGY */}

          {drivers.map(
            (driver) => (

              <div
                className="tire-driver-row"
                key={driver.number}
              >

                <div className="tire-driver-info">

                  <strong>
                    {driver.abbreviation}
                  </strong>


                  <span>
                    {driver.team}
                  </span>

                </div>


                <div className="stint-timeline">

                  {driver.stints &&
                  driver.stints.length > 0 ? (

                    driver.stints.map(
                      (
                        stint,
                        index
                      ) => (

                        <div
                          className={`strategy-stint strategy-${String(
                            stint.compound
                          ).toLowerCase()}`}
                          key={index}
                          title={`${stint.compound} • Laps ${stint.lap_start}–${stint.lap_end}`}
                        >

                          <span>
                            {stint.compound}
                          </span>


                          <small>

                            L
                            {stint.lap_start}
                            –
                            L
                            {stint.lap_end}

                          </small>

                        </div>

                      )
                    )

                  ) : (

                    <span className="no-stint-data">

                      No strategy data

                    </span>

                  )}

                </div>

              </div>

            )
          )}

        </div>

      )}


      {/* ===================================================
          LAP TIME CHART
      =================================================== */}

      {drivers.length > 0 &&
        lapData.length > 0 && (

          <LapTimeChart
            lapData={lapData}
            drivers={drivers}
          />

        )}


      {/* ===================================================
          RACE POSITION CHART
      =================================================== */}

      {drivers.length > 0 &&
        positionData.length > 0 && (

          <RacePositionChart
            positionData={
              positionData
            }
            drivers={drivers}

            lapData={lapData}

            
          />

        )}

    </div>

  );

}


export default LiveTiming;
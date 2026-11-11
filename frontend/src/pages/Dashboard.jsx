import { useEffect, useState } from "react";

import RaceCountdown from "../components/dashboard/RaceCountdown";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getLatestSession,
  getDrivers,
  getPositions,
  getLaps,
  getStints,
  getIntervals,
  getMeetingByKey,
} from "../services/openF1Api";


/* =========================================
   HELPERS
========================================= */

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));


const formatNumber = (value, digits = 3) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "-";
  }

  return number.toFixed(digits);
};


/* =========================================
   BUILD POSITION HISTORY
========================================= */

const buildPositionHistory = (
  positions,
  topDrivers
) => {
  if (
    !positions ||
    positions.length === 0 ||
    !topDrivers ||
    topDrivers.length === 0
  ) {
    return [];
  }


  const driverEvents = {};


  topDrivers.forEach((driver) => {
    driverEvents[driver.number] =
      positions
        .filter(
          (item) =>
            item.driver_number ===
            driver.number
        )
        .sort(
          (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
        );
  });


  const allDates = positions
    .map((item) =>
      new Date(item.date).getTime()
    )
    .filter(
      (date) => !Number.isNaN(date)
    );


  if (allDates.length === 0) {
    return [];
  }


  const startTime = Math.min(...allDates);
  const endTime = Math.max(...allDates);


  const pointers = {};
  const currentPositions = {};


  topDrivers.forEach((driver) => {
    pointers[driver.number] = 0;
    currentPositions[driver.number] =
      null;
  });


  const result = [];

  /*
    One point every 30 seconds.
    This keeps Recharts fast while still
    showing the actual race movement.
  */

  const interval = 30 * 1000;


  for (
    let time = startTime;
    time <= endTime;
    time += interval
  ) {

    const row = {
      time: Math.round(
        (time - startTime) / 60000
      ),
    };


    topDrivers.forEach((driver) => {

      const events =
        driverEvents[driver.number];

      let pointer =
        pointers[driver.number];


      while (
        pointer < events.length &&
        new Date(
          events[pointer].date
        ).getTime() <= time
      ) {

        currentPositions[
          driver.number
        ] = events[pointer].position;

        pointer++;
      }


      pointers[driver.number] =
        pointer;


      row[
        `driver_${driver.number}`
      ] =
        currentPositions[
          driver.number
        ];
    });


    result.push(row);
  }


  return result;
};


/* =========================================
   DASHBOARD
========================================= */

function Dashboard() {

  /* =====================================
     STATE
  ===================================== */

  const [session, setSession] =
    useState(null);

  const [meeting, setMeeting] =
    useState(null);

  const [drivers, setDrivers] =
    useState([]);

  const [positions, setPositions] =
    useState([]);

  const [laps, setLaps] =
    useState([]);

  const [stints, setStints] =
    useState([]);

  const [intervals, setIntervals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState(null);


  /* =====================================
     FETCH DASHBOARD DATA
  ===================================== */

  const fetchDashboardData =
    async () => {

      try {

        setLoading(true);
        setError("");


        /* ===============================
           1. LATEST SESSION
        =============================== */

        const latestSession =
          await getLatestSession();


        if (!latestSession) {
          throw new Error(
            "No Formula 1 session available."
          );
        }


        setSession(latestSession);


        const sessionKey =
          latestSession.session_key;


        /* ===============================
           2. DRIVERS
        =============================== */

        const driverData =
          await getDrivers(sessionKey);


        await wait(250);


        /* ===============================
           3. POSITIONS
        =============================== */

        const positionData =
          await getPositions(sessionKey);


        await wait(250);


        /* ===============================
           4. LAP DATA
        =============================== */

        const lapData =
          await getLaps(sessionKey);


        await wait(250);


        /* ===============================
           5. TYRE STINTS
        =============================== */

        const stintData =
          await getStints(sessionKey);


        await wait(250);


        /* ===============================
           6. INTERVAL / GAP DATA
        =============================== */

        let intervalData = [];

        try {

          intervalData =
            await getIntervals(
              sessionKey
            );

        } catch (intervalError) {

          console.warn(
            "Interval data unavailable:",
            intervalError
          );

        }


        /* ===============================
           7. CIRCUIT / MEETING
        =============================== */

        let meetingData = null;


        try {

          meetingData =
            await getMeetingByKey(
              latestSession.meeting_key
            );

        } catch (meetingError) {

          console.warn(
            "Meeting data unavailable:",
            meetingError
          );

        }


        /* ===============================
           SAVE RAW DATA
        =============================== */

        setMeeting(meetingData);

        setPositions(positionData);

        setLaps(lapData);

        setStints(stintData);

        setIntervals(intervalData);


        /* ===============================
           LATEST POSITION
        =============================== */

        const latestPositions = {};


        positionData.forEach(
          (position) => {

            const driverNumber =
              position.driver_number;

            const existing =
              latestPositions[
                driverNumber
              ];

            if (
              !existing ||
              new Date(position.date)
                .getTime() >
                new Date(existing.date)
                  .getTime()
            ) {

              latestPositions[
                driverNumber
              ] = position;
            }
          }
        );


        /* ===============================
           LATEST LAP
        =============================== */

        const latestLaps = {};


        lapData.forEach((lap) => {

          const driverNumber =
            lap.driver_number;

          if (
            !latestLaps[
              driverNumber
            ] ||
            lap.lap_number >
              latestLaps[
                driverNumber
              ].lap_number
          ) {

            latestLaps[
              driverNumber
            ] = lap;
          }
        });


        /* ===============================
           DRIVER STINTS
        =============================== */

        const driverStints = {};


        stintData.forEach(
          (stint) => {

            const driverNumber =
              stint.driver_number;


            if (
              !driverStints[
                driverNumber
              ]
            ) {

              driverStints[
                driverNumber
              ] = [];
            }


            driverStints[
              driverNumber
            ].push(stint);
          }
        );


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


        /* ===============================
           LATEST GAP
        =============================== */

        const latestIntervals = {};


        intervalData.forEach(
          (interval) => {

            const driverNumber =
              interval.driver_number;

            const existing =
              latestIntervals[
                driverNumber
              ];


            if (
              !existing ||
              new Date(interval.date)
                .getTime() >
                new Date(existing.date)
                  .getTime()
            ) {

              latestIntervals[
                driverNumber
              ] = interval;
            }
          }
        );


        /* ===============================
           COMBINE DRIVER DATA
        =============================== */

        const combinedDrivers =
          driverData
            .map((driver) => {

              const number =
                driver.driver_number;


              const latestPosition =
                latestPositions[
                  number
                ];


              const latestLap =
                latestLaps[
                  number
                ];


              const driverStintList =
                driverStints[
                  number
                ] || [];


              const currentStint =
                driverStintList.length
                  ? driverStintList[
                      driverStintList.length -
                        1
                    ]
                  : null;


              const latestInterval =
                latestIntervals[
                  number
                ];


              return {

                number,

                name:
                  driver.full_name,

                abbreviation:
                  driver.name_acronym,

                team:
                  driver.team_name,

                teamColor:
                  driver.team_colour,

                position:
                  latestPosition?.position ??
                  "-",

                gap:
                  latestInterval
                    ?.gap_to_leader ??
                  null,

                lapNumber:
                  latestLap?.lap_number ??
                  "-",

                lapTime:
                  latestLap?.lap_duration ??
                  null,

                sector1:
                  latestLap
                    ?.duration_sector_1 ??
                  null,

                sector2:
                  latestLap
                    ?.duration_sector_2 ??
                  null,

                sector3:
                  latestLap
                    ?.duration_sector_3 ??
                  null,

                tyre:
                  currentStint?.compound ??
                  "-",

                stints:
                  driverStintList,
              };
            })


            .sort((a, b) => {

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
                Number(a.position) -
                Number(b.position)
              );
            });


        setDrivers(
          combinedDrivers
        );


        setLastUpdated(
          new Date()
        );

      } catch (err) {

        console.error(
          "Dashboard error:",
          err
        );


        setError(
          err.message ||
            "Unable to load Formula 1 data."
        );

      } finally {

        setLoading(false);
      }
    };


  /* =====================================
     AUTO REFRESH
  ===================================== */

  useEffect(() => {

    fetchDashboardData();


    /*
      45 seconds prevents the dashboard
      from fighting with LiveTiming for
      the OpenF1 free API rate limit.
    */

    const interval =
      setInterval(
        fetchDashboardData,
        45000
      );


    return () =>
      clearInterval(interval);

  }, []);


  /* =====================================
     TOP 5 DRIVERS
  ===================================== */

  const topDrivers =
    drivers.slice(0, 5);


  /* =====================================
     POSITION CHART
  ===================================== */

  const positionChartData =
    buildPositionHistory(
      positions,
      topDrivers
    );


  /* =====================================
     CURRENT LAP
  ===================================== */

  const currentLap =
    laps.length > 0
      ? Math.max(
          ...laps.map(
            (lap) =>
              Number(
                lap.lap_number
              ) || 0
          )
        )
      : "-";


  /* =====================================
     SESSION STATUS
  ===================================== */

  const now = Date.now();

  const sessionStart =
    session
      ? new Date(
          session.date_start
        ).getTime()
      : 0;

  const sessionEnd =
    session
      ? new Date(
          session.date_end
        ).getTime()
      : 0;


  const sessionLive =
    session &&
    now >= sessionStart &&
    now <= sessionEnd;


  const sessionStatus =
    sessionLive
      ? "LIVE"
      : "COMPLETED";


  /* =====================================
     FASTEST SECTORS
  ===================================== */

  const fastestSectors = [
    {
      key: "duration_sector_1",
      label: "S1",
    },
    {
      key: "duration_sector_2",
      label: "S2",
    },
    {
      key: "duration_sector_3",
      label: "S3",
    },
  ].map((sector) => {

    let fastest = null;


    laps.forEach((lap) => {

      const value =
        Number(
          lap[
            sector.key
          ]
        );


      if (
        !Number.isFinite(value) ||
        value <= 0
      ) {
        return;
      }


      if (
        !fastest ||
        value < fastest.value
      ) {

        const driver =
          drivers.find(
            (item) =>
              item.number ===
              lap.driver_number
          );


        fastest = {

          value,

          driver:
            driver?.abbreviation ||
            `#${lap.driver_number}`,
        };
      }
    });


    return {
      ...sector,
      ...(
        fastest || {
          value: null,
          driver: "-",
        }
      ),
    };
  });


  /* =====================================
     CIRCUIT INFO
  ===================================== */

  const circuitName =
    meeting?.circuit_short_name ||
    session?.location ||
    "Unknown Circuit";


  const circuitImage =
    meeting?.circuit_image ||
    null;


  /* =====================================
     RENDER
  ===================================== */

  return (
    <>

      {/* =================================
          NEXT RACE
      ================================= */}

      <div className="next-race-wrapper">
        <RaceCountdown />
      </div>


      {/* =================================
          CURRENT / LAST SESSION
      ================================= */}

      <section className="race-banner">

        <div>

          <p>
            {sessionLive
              ? "FORMULA 1 GRAND PRIX"
              : "LATEST FORMULA 1 SESSION"}
          </p>

          <h2>
            {circuitName}
          </h2>

          <span
            style={{
              display: "block",
              marginTop: "6px",
              opacity: 0.7,
            }}
          >
            {session?.session_name ||
              "Loading session..."}
          </span>

        </div>


        <div className="race-info">

          <div>

            <span>LAP</span>

            <strong>
              {currentLap}
              {session?.session_name
                ?.toLowerCase()
                .includes("race")
                ? " / 71"
                : ""}
            </strong>

          </div>


          <div>

            <span>SESSION STATUS</span>

            <strong
              className={
                sessionLive
                  ? "green"
                  : ""
              }
            >
              {sessionStatus}
            </strong>

          </div>


          <div>

            <span>LOCATION</span>

            <strong>
              {session?.country_name ||
                session?.location ||
                "-"}
            </strong>

          </div>

        </div>

      </section>


      {/* =================================
          ERROR
      ================================= */}

      {error && (

        <div className="live-error">

          <strong>
            Unable to load live dashboard data
          </strong>

          <p>
            {error}
          </p>

        </div>

      )}


      {/* =================================
          1. RACE TIMING + TRACK MAP
      ================================= */}

      <section className="dashboard-grid">


        {/* ===============================
            RACE TIMING
        =============================== */}

        <div className="card large-card">

          <div className="card-header">

            <div>

              <p className="card-label">
                {sessionLive
                  ? "LIVE"
                  : "LATEST"}
              </p>

              <h2>
                Race Timing
              </h2>

            </div>


            <span className="updated">

              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString()}`
                : "Loading..."}

            </span>

          </div>


          <div className="timing-table">

            <div className="table-row table-head">

              <span>POS</span>

              <span>DRIVER</span>

              <span>GAP</span>

              <span>TYRE</span>

            </div>


            {topDrivers.map(
              (driver) => (

                <div
                  className="table-row"
                  key={driver.number}
                >

                  <strong>
                    {driver.position}
                  </strong>


                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >

                    <span
                      style={{
                        width: "4px",
                        height: "28px",
                        borderRadius: "4px",
                        background:
                          driver.teamColor
                            ? `#${driver.teamColor}`
                            : "#e10600",
                      }}
                    />

                    <span>
                      {driver.abbreviation}
                    </span>

                  </span>


                  <span>

                    {Number(
                      driver.position
                    ) === 1
                      ? "LEADER"
                      : driver.gap !== null &&
                        driver.gap !== undefined
                      ? typeof driver.gap ===
                        "string"
                        ? driver.gap
                        : `+${formatNumber(
                            driver.gap
                          )}`
                      : "-"}

                  </span>


                  <span
                    className={`tyre ${String(
                      driver.tyre
                    ).toLowerCase()}`}
                  >
                    {driver.tyre}
                  </span>

                </div>

              )
            )}

          </div>

        </div>


        {/* ===============================
            TRACK MAP
        =============================== */}

        <div className="card track-card">

          <div className="card-header">

            <div>

              <p className="card-label">
                CIRCUIT
              </p>

              <h2>
                Track Map
              </h2>

            </div>

          </div>


          <div
            className="track-placeholder"
            style={{
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >

            {circuitImage ? (

              <img
                src={circuitImage}
                alt={`${circuitName} circuit`}
                style={{
                  width: "100%",
                  maxWidth: "430px",
                  height: "210px",
                  objectFit: "contain",
                  filter:
                    "brightness(1.15) contrast(1.1)",
                }}
              />

            ) : (

              <div
                className="track-shape"
              />

            )}


            <p
              style={{
                marginTop: "15px",
              }}
            >
              {circuitName}
            </p>


            <span>
              {meeting?.circuit_type ||
                "Formula 1 Circuit"}
            </span>

          </div>

        </div>

      </section>


      {/* =================================
          2. POSITION CHANGES
      ================================= */}

      <section className="analytics-grid">


        <div className="card chart-card">

          <div className="card-header">

            <div>

              <p className="card-label">
                RACE ANALYSIS
              </p>

              <h2>
                Position Changes
              </h2>

            </div>


            <span className="updated">

              {currentLap !== "-"
                ? `Lap ${currentLap}`
                : "Race timeline"}

            </span>

          </div>


          <div
            className="chart-container"
            style={{
              height: "300px",
            }}
          >

            {positionChartData.length >
            0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={
                    positionChartData
                  }
                >

                  <XAxis
                    dataKey="time"
                    stroke="#666"
                    tick={{
                      fill: "#8a8f99",
                      fontSize: 11,
                    }}
                    label={{
                      value:
                        "Minutes",
                      position:
                        "insideBottom",
                      offset: -5,
                      fill:
                        "#777",
                    }}
                  />


                  <YAxis
                    reversed
                    domain={[
                      1,
                      Math.max(
                        5,
                        ...topDrivers.map(
                          (driver) =>
                            Number(
                              driver.position
                            ) || 5
                        )
                      ),
                    ]}
                    stroke="#666"
                    tick={{
                      fill: "#8a8f99",
                      fontSize: 11,
                    }}
                  />


                  <Tooltip
                    contentStyle={{
                      background:
                        "#151820",
                      border:
                        "1px solid #333",
                      borderRadius:
                        "8px",
                    }}
                    formatter={(
                      value,
                      key
                    ) => {

                      const number =
                        String(
                          key
                        ).replace(
                          "driver_",
                          ""
                        );


                      const driver =
                        topDrivers.find(
                          (item) =>
                            String(
                              item.number
                            ) ===
                            number
                        );


                      return [
                        `P${value}`,
                        driver?.abbreviation ||
                          number,
                      ];
                    }}
                  />


                  {topDrivers.map(
                    (driver) => (

                      <Line
                        key={
                          driver.number
                        }
                        type="stepAfter"
                        dataKey={`driver_${driver.number}`}
                        stroke={
                          driver.teamColor
                            ? `#${driver.teamColor}`
                            : "#e10600"
                        }
                        strokeWidth={3}
                        dot={false}
                        connectNulls
                      />

                    )
                  )}

                </LineChart>

              </ResponsiveContainer>

            ) : (

              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  opacity: 0.5,
                }}
              >
                Waiting for position
                data...
              </div>

            )}

          </div>


          <div className="chart-legend">

            {topDrivers.map(
              (driver) => (

                <span
                  key={driver.number}
                >

                  <i
                    style={{
                      display:
                        "inline-block",
                      width: "9px",
                      height: "9px",
                      borderRadius:
                        "50%",
                      background:
                        driver.teamColor
                          ? `#${driver.teamColor}`
                          : "#e10600",
                      marginRight:
                        "6px",
                    }}
                  />

                  {driver.abbreviation}

                </span>

              )
            )}

          </div>

        </div>


        {/* =================================
            3. SECTOR TIMES
        ================================= */}

        <div className="card sector-card">

          <div className="card-header">

            <div>

              <p className="card-label">
                PERFORMANCE
              </p>

              <h2>
                Sector Times
              </h2>

            </div>

          </div>


          <div className="sector-list">

            {fastestSectors.map(
              (sector, index) => {

                const colors = [
                  "purple",
                  "yellow",
                  "green-sector",
                ];


                return (

                  <div
                    className="sector-row"
                    key={sector.label}
                  >

                    <div
                      className={`sector-name ${colors[index]}`}
                    >
                      {sector.label}
                    </div>


                    <div>

                      <strong>

                        {sector.value !==
                        null
                          ? formatNumber(
                              sector.value
                            )
                          : "—"}

                      </strong>


                      <p>
                        {sector.driver}
                      </p>

                    </div>


                    <span className="fastest">
                      FASTEST
                    </span>

                  </div>

                );
              }
            )}

          </div>

        </div>

      </section>


      {/* =================================
          EXISTING LOWER WIDGETS
      ================================= */}

      <section className="widgets-grid">


        {/* TYRE STRATEGY */}

        <div className="card">

          <div className="card-header">

            <div>

              <p className="card-label">
                STRATEGY
              </p>

              <h2>
                Tyre Strategy
              </h2>

            </div>

          </div>


          {topDrivers
            .slice(0, 3)
            .map((driver) => (

              <div
                className="strategy-row"
                key={driver.number}
              >

                <span>
                  {driver.abbreviation}
                </span>


                <div className="strategy-bar">

                  {driver.stints?.map(
                    (stint, index) => (

                      <div
                        key={index}
                        className={`stint ${String(
                          stint.compound
                        ).toLowerCase()}-stint`}
                        style={{
                          flex:
                            Math.max(
                              1,
                              (stint.lap_end ||
                                currentLap ||
                                1) -
                                stint.lap_start +
                                1
                            ),
                        }}
                        title={`${stint.compound} • Laps ${stint.lap_start}-${stint.lap_end}`}
                      />

                    )
                  )}

                </div>


                <span className="laps">
                  {driver.lapNumber !== "-"
                    ? `${driver.lapNumber} LAPS`
                    : "-"}
                </span>

              </div>

            ))}

        </div>


        {/* WEATHER */}

        <div className="card weather-card">

          <div className="card-header">

            <div>

              <p className="card-label">
                CIRCUIT
              </p>

              <h2>
                {circuitName}
              </h2>

            </div>

          </div>


          <div className="temperature">
            —
          </div>

          <p className="weather-condition">
            Weather data will be connected
            next
          </p>


          <div className="weather-details">

            <div>
              <span>TRACK</span>
              <strong>—</strong>
            </div>

            <div>
              <span>HUMIDITY</span>
              <strong>—</strong>
            </div>

            <div>
              <span>WIND</span>
              <strong>—</strong>
            </div>

          </div>

        </div>


        {/* AI PREDICTOR */}

        <div className="card predictor-card">

          <div className="card-header">

            <div>

              <p className="card-label">
                AI ENGINE
              </p>

              <h2>
                Race Predictor
              </h2>

            </div>

            <span className="ai-badge">
              AI LIVE
            </span>

          </div>


          {topDrivers
            .slice(0, 3)
            .map((driver, index) => {

              const confidence =
                [42, 31, 18][
                  index
                ] || 10;


              return (

                <div
                  className="prediction"
                  key={driver.number}
                >

                  <div
                    className="prediction-driver"
                  >

                    <span>
                      {driver.abbreviation}
                    </span>

                    <strong>
                      {driver.name}
                    </strong>

                    <b>
                      {confidence}%
                    </b>

                  </div>


                  <div className="confidence-bar">

                    <div
                      className="confidence-fill"
                      style={{
                        width:
                          `${confidence}%`,
                      }}
                    />

                  </div>

                </div>

              );
            })}

        </div>


      </section>

    </>
  );
}

export default Dashboard;
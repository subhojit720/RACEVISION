import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";


/* =========================================
   FIND LAP FOR A POSITION TIMESTAMP
========================================= */

const findLapForTime = (timestamp, laps) => {
  if (!laps || laps.length === 0) {
    return null;
  }

  const time = new Date(timestamp).getTime();

  let left = 0;
  let right = laps.length - 1;
  let result = null;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    const lapTime =
      new Date(laps[middle].date_start).getTime();

    if (lapTime <= time) {
      result = laps[middle];
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return result;
};


/* =========================================
   POSITION CHART
========================================= */

function RacePositionChart({
  positionData = [],
  drivers = [],
  lapData = [],
}) {

  /* =========================================
     DRIVER LOOKUP
  ========================================= */

  const driverMap = {};

  drivers.forEach((driver) => {

    driverMap[driver.number] = {
      abbreviation:
        driver.abbreviation ||
        `#${driver.number}`,

      color:
        driver.teamColor
          ? `#${driver.teamColor.replace("#", "")}`
          : "#ffffff",
    };

  });


  /* =========================================
     LAP DATA BY DRIVER
  ========================================= */

  const lapsByDriver = {};

  lapData.forEach((lap) => {

    const driverNumber =
      lap.driver_number;

    if (!lapsByDriver[driverNumber]) {
      lapsByDriver[driverNumber] = [];
    }

    if (lap.date_start) {
      lapsByDriver[driverNumber].push(lap);
    }

  });


  /* =========================================
     SORT LAP DATA
  ========================================= */

  Object.values(lapsByDriver).forEach(
    (laps) => {

      laps.sort(
        (a, b) =>
          new Date(a.date_start).getTime() -
          new Date(b.date_start).getTime()
      );

    }
  );


  /* =========================================
     CREATE LAP-BY-LAP POSITIONS
  ========================================= */

  const lapPositions = {};


  positionData.forEach((position) => {

    const driverNumber =
      position.driver_number;

    const driverLaps =
      lapsByDriver[driverNumber];

    if (
      !driverLaps ||
      driverLaps.length === 0
    ) {
      return;
    }


    const lap =
      findLapForTime(
        position.date,
        driverLaps
      );


    if (!lap) {
      return;
    }


    const lapNumber =
      Number(lap.lap_number);

    const currentPosition =
      Number(position.position);


    if (
      !Number.isFinite(lapNumber) ||
      !Number.isFinite(currentPosition)
    ) {
      return;
    }


    if (!lapPositions[lapNumber]) {
      lapPositions[lapNumber] = {
        lap: lapNumber,
      };
    }


    /*
      Keep the latest position
      recorded during the lap.
    */

    lapPositions[lapNumber][
      driverNumber
    ] = currentPosition;

  });


  /* =========================================
     CONVERT OBJECT → ARRAY
  ========================================= */

  const chartData =
    Object.values(lapPositions)
      .sort(
        (a, b) => a.lap - b.lap
      );


  /* =========================================
     SELECT DRIVERS
  ========================================= */

  const chartDrivers =
    drivers
      .filter(
        (driver) =>
          chartData.some(
            (row) =>
              row[driver.number] !==
              undefined
          )
      )
      .slice(0, 8);


  /* =========================================
     EMPTY STATE
  ========================================= */

  if (
    chartData.length === 0 ||
    chartDrivers.length === 0
  ) {

    return (
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

        </div>


        <div
          className="chart-container"
          style={{
            height: "260px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777",
          }}
        >

          Waiting for position data...

        </div>

      </div>
    );

  }


  /* =========================================
     LAP RANGE
  ========================================= */

  const firstLap =
    chartData[0]?.lap || 0;

  const lastLap =
    chartData[chartData.length - 1]?.lap || 0;


  /* =========================================
     RENDER
  ========================================= */

  return (

    <div className="card chart-card">

      {/* HEADER */}

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

          Lap {firstLap} → {lastLap}

        </span>

      </div>


      {/* CHART */}

      <div
        className="chart-container"
        style={{
          width: "100%",
          height: "300px",
        }}
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >

            <CartesianGrid
              stroke="#252933"
              strokeDasharray="3 3"
            />


            {/* X AXIS */}

            <XAxis
              dataKey="lap"
              stroke="#666"
              tick={{
                fill: "#8a8f99",
                fontSize: 11,
              }}
              tickLine={false}
              axisLine={{
                stroke: "#333",
              }}
              label={{
                value: "LAP",
                position: "insideBottom",
                offset: -5,
                fill: "#666",
                fontSize: 10,
              }}
            />


            {/* Y AXIS */}

            <YAxis
              reversed
              domain={[1, "dataMax"]}
              allowDecimals={false}
              stroke="#666"
              tick={{
                fill: "#8a8f99",
                fontSize: 11,
              }}
              tickLine={false}
              axisLine={{
                stroke: "#333",
              }}
              label={{
                value: "POSITION",
                angle: -90,
                position: "insideLeft",
                fill: "#666",
                fontSize: 10,
              }}
            />


            {/* TOOLTIP */}

            <Tooltip
              contentStyle={{
                background: "#151820",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
              }}

              labelStyle={{
                color: "#aaa",
                marginBottom: "6px",
              }}

              formatter={(
                value,
                name
              ) => {

                const driver =
                  driverMap[name];

                return [
                  `P${value}`,
                  driver?.abbreviation ||
                    name,
                ];

              }}

              labelFormatter={(lap) =>
                `Lap ${lap}`
              }
            />


            {/* LEGEND */}

            <Legend
              wrapperStyle={{
                paddingTop: "10px",
                fontSize: "11px",
              }}

              formatter={(value) => {

                const driver =
                  driverMap[value];

                return (
                  driver?.abbreviation ||
                  value
                );

              }}
            />


            {/* DRIVER LINES */}

            {chartDrivers.map(
              (driver) => {

                const driverNumber =
                  driver.number;

                const driverInfo =
                  driverMap[
                    driverNumber
                  ];


                return (

                  <Line
                    key={driverNumber}

                    type="monotone"

                    dataKey={String(
                      driverNumber
                    )}

                    name={String(
                      driverNumber
                    )}

                    stroke={
                      driverInfo?.color ||
                      "#ffffff"
                    }

                    strokeWidth={2}

                    dot={false}

                    activeDot={{
                      r: 4,
                    }}

                    connectNulls
                  />

                );

              }
            )}

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}


export default RacePositionChart;
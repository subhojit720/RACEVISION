import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DRIVER_COLORS = [
  "#e10600",
  "#00d2be",
  "#ff8700",
  "#3671c6",
];

function LapTimeChart({ lapData, drivers }) {
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  const chartData = useMemo(() => {
    if (!lapData || lapData.length === 0) return [];

    const driverNumbers =
      selectedDrivers.length > 0
        ? selectedDrivers
        : drivers.slice(0, 4).map((driver) => driver.number);

    const lapsByNumber = {};

    lapData.forEach((lap) => {
      if (
        driverNumbers.includes(lap.driver_number) &&
        lap.lap_duration
      ) {
        if (!lapsByNumber[lap.lap_number]) {
          lapsByNumber[lap.lap_number] = {
            lap: lap.lap_number,
          };
        }

        lapsByNumber[lap.lap_number][lap.driver_number] =
          Number(lap.lap_duration.toFixed(3));
      }
    });

    return Object.values(lapsByNumber).sort(
      (a, b) => a.lap - b.lap
    );
  }, [lapData, selectedDrivers, drivers]);

  const activeDrivers =
    selectedDrivers.length > 0
      ? drivers.filter((driver) =>
          selectedDrivers.includes(driver.number)
        )
      : drivers.slice(0, 4);

  const toggleDriver = (driverNumber) => {
    setSelectedDrivers((current) => {
      if (current.includes(driverNumber)) {
        return current.filter((number) => number !== driverNumber);
      }

      if (current.length >= 4) return current;

      return [...current, driverNumber];
    });
  };

  return (
    <div className="card lap-chart-card">

      <div className="lap-chart-header">
        <div>
          <p className="card-label">PERFORMANCE ANALYSIS</p>
          <h2>Lap Time Comparison</h2>
        </div>

        <span className="chart-status">
          SELECT UP TO 4 DRIVERS
        </span>
      </div>

      {/* DRIVER SELECTOR */}

      <div className="driver-selector">

        {drivers.map((driver) => {

          const isSelected = activeDrivers.some(
            (item) => item.number === driver.number
          );

          return (
            <button
              key={driver.number}
              className={`driver-select-btn ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => toggleDriver(driver.number)}
            >
              {driver.abbreviation}
            </button>
          );
        })}

      </div>

      {/* CHART */}

      <div className="lap-chart-container">

        {chartData.length > 0 ? (

          <ResponsiveContainer width="100%" height={350}>

            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 10,
                bottom: 10,
              }}
            >

              <XAxis
                dataKey="lap"
                stroke="#737983"
                tick={{ fill: "#737983", fontSize: 10 }}
                label={{
                  value: "LAP",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#737983",
                  fontSize: 10,
                }}
              />

              <YAxis
                stroke="#737983"
                tick={{ fill: "#737983", fontSize: 10 }}
                domain={["auto", "auto"]}
                width={55}
              />

              <Tooltip
                contentStyle={{
                  background: "#171a21",
                  border: "1px solid #2b3038",
                  borderRadius: "8px",
                }}
                labelStyle={{
                  color: "#ffffff",
                }}
              />

              <Legend />

              {activeDrivers.map((driver, index) => (
                <Line
                  key={driver.number}
                  type="monotone"
                  dataKey={driver.number}
                  name={driver.abbreviation}
                  stroke={
                    DRIVER_COLORS[
                      index % DRIVER_COLORS.length
                    ]
                  }
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}

            </LineChart>

          </ResponsiveContainer>

        ) : (

          <div className="no-chart-data">
            No lap time data available
          </div>

        )}

      </div>

    </div>
  );
}

export default LapTimeChart;
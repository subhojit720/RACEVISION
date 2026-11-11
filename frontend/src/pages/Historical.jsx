import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

import { TrendingUp, ChartNoAxesCombined, History } from "lucide-react";

function Historical() {
  const [selectedSeason, setSelectedSeason] = React.useState("2025");

  const championshipData = [
    { round: "R1", verstappen: 25, norris: 18, leclerc: 15 },
    { round: "R2", verstappen: 43, norris: 43, leclerc: 33 },
    { round: "R3", verstappen: 68, norris: 58, leclerc: 48 },
    { round: "R4", verstappen: 86, norris: 83, leclerc: 60 },
    { round: "R5", verstappen: 111, norris: 101, leclerc: 78 },
    { round: "R6", verstappen: 129, norris: 126, leclerc: 96 },
    { round: "R7", verstappen: 154, norris: 144, leclerc: 111 },
    { round: "R8", verstappen: 179, norris: 169, leclerc: 126 },
  ];

  const racePerformance = [
    { race: "BHR", max: 92, norris: 88, leclerc: 84 },
    { race: "SAU", max: 95, norris: 91, leclerc: 89 },
    { race: "AUS", max: 88, norris: 96, leclerc: 87 },
    { race: "JPN", max: 97, norris: 93, leclerc: 90 },
    { race: "MON", max: 91, norris: 94, leclerc: 98 },
    { race: "GBR", max: 96, norris: 98, leclerc: 92 },
  ];

  const driverStats = [
    { driver: "VER", points: 179 },
    { driver: "NOR", points: 169 },
    { driver: "LEC", points: 126 },
    { driver: "RUS", points: 112 },
    { driver: "PIA", points: 105 },
  ];

  return (
    <div className="historical-page">

      {/* HEADER */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">FORMULA 1 DATA ARCHIVE</p>
          <h1>Historical Analysis</h1>
          <p className="page-description">
            Analyze historical Formula 1 performance, race pace and championship battles.
          </p>
        </div>

        <select
          className="season-select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
        >
          <option value="2025">2025 SEASON</option>
          <option value="2024">2024 SEASON</option>
          <option value="2023">2023 SEASON</option>
        </select>
      </div>

      {/* TOP STATS */}
      <div className="historical-stats">

        <div className="historical-stat-card">
          <TrendingUp size={22} />
          <div>
            <span>RACES ANALYZED</span>
            <strong>24</strong>
          </div>
        </div>

        <div className="historical-stat-card">
          <ChartNoAxesCombined size={22} />
          <div>
            <span>DATA POINTS</span>
            <strong>12,480</strong>
          </div>
        </div>

        <div className="historical-stat-card">
          <History size={22} />
          <div>
            <span>HISTORICAL YEARS</span>
            <strong>75+</strong>
          </div>
        </div>

      </div>

      {/* CHARTS */}
      <div className="historical-grid">

        {/* CHAMPIONSHIP PROGRESSION */}
        <div className="card historical-chart-card">
          <div className="card-header">
            <div>
              <p className="card-label">CHAMPIONSHIP BATTLE</p>
              <h2>Points Progression</h2>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={championshipData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252a33" />

              <XAxis
                dataKey="round"
                tick={{ fill: "#7d838d", fontSize: 11 }}
              />

              <YAxis
                tick={{ fill: "#7d838d", fontSize: 11 }}
              />

              <Tooltip
                contentStyle={{
                  background: "#151820",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />

              <Line
                type="monotone"
                dataKey="verstappen"
                stroke="#e10600"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="norris"
                stroke="#ff8700"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="leclerc"
                stroke="#f5c542"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PERFORMANCE */}
        <div className="card historical-chart-card">
          <div className="card-header">
            <div>
              <p className="card-label">RACE PERFORMANCE</p>
              <h2>Driver Pace Comparison</h2>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={racePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252a33" />

              <XAxis
                dataKey="race"
                tick={{ fill: "#7d838d", fontSize: 11 }}
              />

              <YAxis
                tick={{ fill: "#7d838d", fontSize: 11 }}
              />

              <Tooltip
                contentStyle={{
                  background: "#151820",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />

              <Bar dataKey="max" fill="#e10600" radius={[4, 4, 0, 0]} />
              <Bar dataKey="norris" fill="#ff8700" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leclerc" fill="#f5c542" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* DRIVER COMPARISON */}
      <div className="card driver-comparison-card">

        <div className="card-header">
          <div>
            <p className="card-label">SEASON PERFORMANCE</p>
            <h2>Driver Points Comparison</h2>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={driverStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252a33" />

            <XAxis
              dataKey="driver"
              tick={{ fill: "#7d838d", fontSize: 11 }}
            />

            <YAxis
              tick={{ fill: "#7d838d", fontSize: 11 }}
            />

            <Tooltip
              contentStyle={{
                background: "#151820",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
            />

            <Bar
              dataKey="points"
              fill="#e10600"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default Historical;
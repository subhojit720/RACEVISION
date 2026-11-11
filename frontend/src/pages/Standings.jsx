import { useCallback, useEffect, useState } from "react";
import {
  Trophy,
  Users,
  Car,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import {
  getLatestRaceSession,
  getChampionshipDrivers,
  getChampionshipTeams,
  getDrivers,
} from "../services/openF1Api";

import "./Standings.css";

const getCurrentYear = () => new Date().getFullYear();

const Standings = () => {
  const [drivers, setDrivers] = useState([]);
  const [teams, setTeams] = useState([]);

  const [latestRace, setLatestRace] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadStandings = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const year = getCurrentYear();

      // ------------------------------------------------------
      // 1. Find the latest completed Race
      // ------------------------------------------------------

      const race = await getLatestRaceSession(year);

      if (!race?.session_key) {
        throw new Error("Latest race session could not be found.");
      }

      setLatestRace(race);

      // ------------------------------------------------------
      // 2. Fetch championship data
      // ------------------------------------------------------

      const [
        championshipDrivers,
        championshipTeams,
        driverData,
      ] = await Promise.all([
        getChampionshipDrivers(race.session_key),
        getChampionshipTeams(race.session_key),
        getDrivers(race.session_key),
      ]);

      // ------------------------------------------------------
      // 3. Create driver lookup
      // ------------------------------------------------------

      const driverMap = new Map();

      (driverData || []).forEach((driver) => {
        driverMap.set(
          Number(driver.driver_number),
          driver
        );
      });

      // ------------------------------------------------------
      // 4. Format driver standings
      // ------------------------------------------------------

      const formattedDrivers = (championshipDrivers || [])
        .map((standing) => {
          const driver = driverMap.get(
            Number(standing.driver_number)
          );

          return {
            position: Number(
              standing.position_current
            ),

            points: Number(
              standing.points_current
            ),

            number: Number(
              standing.driver_number
            ),

            name:
              driver?.full_name ||
              `Driver ${standing.driver_number}`,

            acronym:
              driver?.name_acronym ||
              "",

            team:
              driver?.team_name ||
              "Unknown Team",

            teamColor: driver?.team_colour
              ? `#${driver.team_colour}`
              : "#e10600",

            headshot:
              driver?.headshot_url || "",
          };
        })
        .filter((driver) => Number.isFinite(driver.position))
        .sort(
          (a, b) =>
            a.position - b.position
        );

      // ------------------------------------------------------
      // 5. Format constructor standings
      // ------------------------------------------------------

      const formattedTeams = (championshipTeams || [])
        .map((team) => ({
          position: Number(
            team.position_current
          ),

          points: Number(
            team.points_current
          ),

          name:
            team.team_name ||
            "Unknown Team",
        }))
        .filter((team) => Number.isFinite(team.position))
        .sort(
          (a, b) =>
            a.position - b.position
        );

      setDrivers(formattedDrivers);
      setTeams(formattedTeams);

    } catch (err) {
      console.error(
        "Failed to load championship standings:",
        err
      );

      setError(
        err?.message ||
          "Unable to load live championship standings."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // --------------------------------------------------------
  // INITIAL LOAD + AUTO REFRESH
  // --------------------------------------------------------

  useEffect(() => {
    loadStandings();

    // Refresh once every 60 seconds.
    const interval = setInterval(() => {
      loadStandings(true);
    }, 60_000);

    return () => {
      clearInterval(interval);
    };
  }, [loadStandings]);

  // --------------------------------------------------------
  // LOADING
  // --------------------------------------------------------

  if (loading) {
    return (
      <div className="standings-page">
        <div className="standings-loading">
          <RefreshCw
            size={28}
            className="loading-spin"
          />

          <span>
            Loading {getCurrentYear()} championship
            standings...
          </span>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ERROR
  // --------------------------------------------------------

  if (error) {
    return (
      <div className="standings-page">
        <div className="standings-error">
          <AlertCircle size={30} />

          <div>
            <h3>
              Unable to load standings
            </h3>

            <p>{error}</p>

            <button
              className="retry-button"
              onClick={() => loadStandings()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const year = getCurrentYear();

  const raceName =
    latestRace?.meeting_name ||
    latestRace?.location ||
    "Latest Grand Prix";

  return (
    <div className="standings-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="standings-header">

        <div>
          <div className="section-label">
            FORMULA 1 WORLD CHAMPIONSHIP
          </div>

          <h1>
            Championship Standings
          </h1>

          <p>
            Follow the battle for the Formula 1
            World Championship.
          </p>
        </div>

        <div className="season-badge">
          <Trophy size={18} />
          {year} SEASON
        </div>

      </div>


      {/* ==================================================
          LIVE DATA BAR
      ================================================== */}

      <div className="standings-live-bar">

        <div className="live-indicator">
          <span className="live-dot" />
          LIVE DATA
        </div>

        <div className="standings-session">

          <strong>
            {raceName}
          </strong>

          <span>•</span>

          Championship after latest Race

        </div>

        <button
          className="refresh-button"
          onClick={() => loadStandings(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={15}
            className={
              refreshing
                ? "loading-spin"
                : ""
            }
          />

          {refreshing
            ? "Updating..."
            : "Refresh"}
        </button>

      </div>


      {/* ==================================================
          STANDINGS GRID
      ================================================== */}

      <div className="standings-grid">

        {/* ==================================================
            DRIVER STANDINGS
        ================================================== */}

        <div className="standings-card drivers-card">

          <div className="card-heading">

            <div>
              <span className="card-eyebrow">
                WORLD DRIVERS CHAMPIONSHIP
              </span>

              <h2>
                Driver Standings
              </h2>
            </div>

            <Users size={24} />

          </div>


          {/* TABLE HEADER */}

          <div className="driver-table-header">

            <span>POS</span>

            <span>DRIVER</span>

            <span>TEAM</span>

            <span>WINS</span>

            <span>PTS</span>

          </div>


          {/* DRIVER LIST */}

          <div className="driver-list">

            {drivers.map((driver) => (

              <div
                className="driver-row"
                key={driver.number}
              >

                {/* Position */}

                <div className="driver-position">

                  {driver.position <= 3 ? (
                    <span
                      className={`position-medal position-${driver.position}`}
                    >
                      {driver.position}
                    </span>
                  ) : (
                    <span className="position-number">
                      {driver.position}
                    </span>
                  )}

                </div>


                {/* Driver */}

                <div className="driver-info">

                  {driver.headshot ? (
                    <img
                      src={driver.headshot}
                      alt={driver.name}
                      className="driver-photo"
                    />
                  ) : (
                    <div
                      className="driver-photo-placeholder"
                      style={{
                        background:
                          driver.teamColor,
                      }}
                    >
                      {driver.acronym ||
                        "F1"}
                    </div>
                  )}

                  <div>

                    <strong>
                      {driver.name}
                    </strong>

                    <span>
                      {driver.acronym}
                    </span>

                  </div>

                </div>


                {/* Team */}

                <div className="driver-team">

                  <span
                    className="team-dot"
                    style={{
                      background:
                        driver.teamColor,
                    }}
                  />

                  {driver.team}

                </div>


                {/* Wins */}

                <div className="driver-wins">
                  —
                </div>


                {/* Points */}

                <div className="driver-points">

                  {driver.points}

                  <small>
                    PTS
                  </small>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* ==================================================
            CONSTRUCTOR STANDINGS
        ================================================== */}

        <div className="standings-card constructor-card">

          <div className="card-heading">

            <div>
              <span className="card-eyebrow">
                WORLD CONSTRUCTORS CHAMPIONSHIP
              </span>

              <h2>
                Constructor Standings
              </h2>
            </div>

            <Car size={24} />

          </div>


          <div className="constructor-list">

            {teams.map((team) => (

              <div
                className="constructor-row"
                key={team.name}
              >

                <div className="constructor-position">
                  {team.position}
                </div>

                <div className="constructor-info">

                  <strong>
                    {team.name}
                  </strong>

                  <span>
                    {team.points} championship points
                  </span>

                </div>

                <div className="constructor-points">

                  {team.points}

                  <small>
                    PTS
                  </small>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Standings;
import { useEffect, useState } from "react";
import { Clock3, MapPin, Flag } from "lucide-react";
import { f1Calendar2026 } from "../../services/f1Calendar";

function getNextRace() {
  const now = Date.now();

  return (
    f1Calendar2026
      .filter((race) => new Date(race.raceDate).getTime() > now)
      .sort(
        (a, b) =>
          new Date(a.raceDate).getTime() -
          new Date(b.raceDate).getTime()
      )[0] || null
  );
}

function calculateTimeRemaining(targetDate) {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    total: difference,
    days,
    hours,
    minutes,
    seconds,
  };
}

function RaceCountdown() {
  const [nextRace, setNextRace] = useState(() => getNextRace());

  const [timeLeft, setTimeLeft] = useState(() =>
    nextRace
      ? calculateTimeRemaining(nextRace.raceDate)
      : {
          total: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
  );

  useEffect(() => {
    let timer;

    const updateCountdown = () => {
      const currentRace = getNextRace();

      // Automatically switch to the next race
      if (
        !currentRace ||
        currentRace.raceDate !== nextRace?.raceDate
      ) {
        setNextRace(currentRace);

        if (currentRace) {
          setTimeLeft(
            calculateTimeRemaining(currentRace.raceDate)
          );
        }

        return;
      }

      setTimeLeft(
        calculateTimeRemaining(currentRace.raceDate)
      );

      // Align the next update closely with the next real second
      const now = Date.now();
      const delay = 1000 - (now % 1000);

      timer = setTimeout(updateCountdown, delay);
    };

    updateCountdown();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [nextRace]);

  if (!nextRace) {
    return (
      <div className="card race-countdown-card season-finished">
        <div>
          <p className="countdown-label">FORMULA 1</p>
          <h2>2026 SEASON COMPLETE</h2>
        </div>
      </div>
    );
  }

  const raceDate = new Date(nextRace.raceDate);

  const formattedDate = raceDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const pad = (number) => String(number).padStart(2, "0");

  return (
    <div className="card race-countdown-card">

      {/* LEFT SIDE */}
      <div className="countdown-race-info">

        <div className="countdown-round">
          ROUND {nextRace.round}
        </div>

        <div className="countdown-title-row">

          <span className="countdown-flag">
            {nextRace.flag}
          </span>

          <div>
            <p className="countdown-label">NEXT RACE</p>

            <h2>{nextRace.name}</h2>
          </div>

        </div>

        <div className="countdown-meta">

          <span>
            <MapPin size={14} />
            {nextRace.circuit}
          </span>

          <span>
            <Flag size={14} />
            {formattedDate}
          </span>

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="countdown-section">

        <div className="countdown-heading">
          <Clock3 size={16} />
          RACE STARTS IN
        </div>

        <div className="countdown-values">

          {/* DAYS */}
          <div className="countdown-unit">
            <strong>{pad(timeLeft.days)}</strong>
            <span>DAYS</span>
          </div>

          <div className="countdown-separator">:</div>

          {/* HOURS */}
          <div className="countdown-unit">
            <strong>{pad(timeLeft.hours)}</strong>
            <span>HRS</span>
          </div>

          <div className="countdown-separator">:</div>

          {/* MINUTES */}
          <div className="countdown-unit">
            <strong>{pad(timeLeft.minutes)}</strong>
            <span>MIN</span>
          </div>

          <div className="countdown-separator">:</div>

          {/* SECONDS */}
          <div className="countdown-unit countdown-seconds">
            <strong>{pad(timeLeft.seconds)}</strong>
            <span>SEC</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default RaceCountdown;
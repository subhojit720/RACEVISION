import "./Teams.css";

const teams = [
  {
    name: "Mercedes",
    color: "#27b8aa",
    darkColor: "#087d76",
    logo: "/images/teams/logos/mercedes.avif",
    car: "/images/teams/cars/mercedes f1 2026.avif",
    drivers: [
      {
        first: "George",
        last: "RUSSELL",
        image: "/images/drivers/george russell.avif",
      },
      {
        first: "Kimi",
        last: "ANTONELLI",
        image: "/images/drivers/kimi antonelli.avif",
      },
    ],
  },

  {
    name: "Ferrari",
    color: "#e6002d",
    darkColor: "#9f001e",
    logo: "/images/teams/logos/ferrari.avif",
    car: "/images/teams/cars/ferrari f1 2026.avif",
    drivers: [
      {
        first: "Charles",
        last: "LECLERC",
        image: "/images/drivers/charles leclerc.avif",
      },
      {
        first: "Lewis",
        last: "HAMILTON",
        image: "/images/drivers/lewis hamilton.avif",
      },
    ],
  },

  {
    name: "McLaren",
    color: "#ff8700",
    darkColor: "#b75b00",
    logo: "/images/teams/logos/mclaren.avif",
    car: "/images/teams/cars/mclaren f1 2026.avif",
    drivers: [
      {
        first: "Lando",
        last: "NORRIS",
        image: "/images/drivers/lando norris.avif",
      },
      {
        first: "Oscar",
        last: "PIASTRI",
        image: "/images/drivers/oscar piastri.avif",
      },
    ],
  },

  {
    name: "Red Bull Racing",
    color: "#365d97",
    darkColor: "#1d3459",
    logo: "/images/teams/logos/redbullracing.avif",
    car: "/images/teams/cars/redbull f1 2026.avif",
    drivers: [
      {
        first: "Max",
        last: "VERSTAPPEN",
        image: "/images/drivers/max verstappen.avif",
      },
      {
        first: "Isack",
        last: "HADJAR",
        image: "/images/drivers/isack hadjar.avif",
      },
    ],
  },

  {
    name: "Aston Martin",
    color: "#146b63",
    darkColor: "#0b3f3a",
    logo: "/images/teams/logos/astonmartin.avif",
    car: "/images/teams/cars/aston martin f1 2026.avif",
    drivers: [
      {
        first: "Fernando",
        last: "ALONSO",
        image: "/images/drivers/fernando alonso.avif",
      },
      {
        first: "Lance",
        last: "STROLL",
        image: "/images/drivers/lance stroll.avif",
      },
    ],
  },

  {
    name: "Alpine",
    color: "#ff87bc",
    darkColor: "#a64c75",
    logo: "/images/teams/logos/alpine.avif",
    car: "/images/teams/cars/alpine f1 2026.avif",
    drivers: [
      {
        first: "Pierre",
        last: "GASLY",
        image: "/images/drivers/pierre gasly.avif",
      },
      {
        first: "Franco",
        last: "COLAPINTO",
        image: "/images/drivers/franco colapinto.avif",
      },
    ],
  },

  {
    name: "Williams",
    color: "#1e73be",
    darkColor: "#104b80",
    logo: "/images/teams/logos/williams.avif",
    car: "/images/teams/cars/williams f1 2026.avif",
    drivers: [
      {
        first: "Alexander",
        last: "ALBON",
        image: "/images/drivers/alexander albon.avif",
      },
      {
        first: "Carlos",
        last: "SAINZ",
        image: "/images/drivers/carlos sainz.avif",
      },
    ],
  },

  {
    name: "Haas",
    color: "#b6babd",
    darkColor: "#5f6368",
    logo: "/images/teams/logos/haas.avif",
    car: "/images/teams/cars/haas f1 2026.avif",
    drivers: [
      {
        first: "Esteban",
        last: "OCON",
        image: "/images/drivers/esteban ocon.avif",
      },
      {
        first: "Oliver",
        last: "BEARMAN",
        image: "/images/drivers/oliver bearman.avif",
      },
    ],
  },

  {
    name: "Racing Bulls",
    color: "#6c8cff",
    darkColor: "#314d9c",
    logo: "/images/teams/logos/racingbulls.avif",
    car: "/images/teams/cars/racingbull f1 2026.avif",
    drivers: [
      {
        first: "Yuki",
        last: "TSUNODA",
        image: "/images/drivers/yuki tsunoda.avif",
      },
      {
        first: "Liam",
        last: "LAWSON",
        image: "/images/drivers/liam lawson.avif",
      },
    ],
  },

  {
    name: "Audi",
    color: "#bf1a1a",
    darkColor: "#7c0a0a",
    logo: "/images/teams/logos/audi.avif",
    car: "/images/teams/cars/audi f1 2026.avif",
    drivers: [
      {
        first: "Nico",
        last: "HULKENBERG",
        image: "/images/drivers/nico hulkenberg.avif",
      },
      {
        first: "Gabriel",
        last: "BORTOLETO",
        image: "/images/drivers/gabriel bortoleto.avif",
      },
    ],
  },

  {
    name: "Cadillac",
    color: "#a9a9ad",
    darkColor: "#5f6065",
    logo: "/images/teams/logos/cadillac.avif",
    car: "/images/teams/cars/cadillac f1 2026.avif",
    drivers: [
      {
        first: "Sergio",
        last: "PEREZ",
        image: "/images/drivers/sergio perez.avif",
      },
      {
        first: "Valtteri",
        last: "BOTTAS",
        image: "/images/drivers/valtteri bottas.avif",
      },
    ],
  },
];

function Teams() {
  return (
    <div className="teams-page">
      <div className="teams-hero">
        <h1>F1 TEAMS 2026</h1>
        <p>Find the current Formula 1 teams for the 2026 season</p>
      </div>

      <div className="f1-teams-grid">
        {teams.map((team) => (
          <div
            className="f1-team-card"
            key={team.name}
            style={{
              "--team-color": team.color,
              "--team-dark": team.darkColor,
            }}
          >
            <div className="team-dots"></div>

            <div className="team-content">
              <div className="team-top">
                <div className="team-info">
                  <h2>{team.name}</h2>

                  <div className="team-drivers-row">
                    {team.drivers.map((driver) => (
                      <div
                        className="driver-info"
                        key={`${driver.first}-${driver.last}`}
                      >
                        <div className="driver-photo">
                          <img
                            src={driver.image}
                            alt={`${driver.first} ${driver.last}`}
                          />
                        </div>

                        <span>
                          {driver.first} <strong>{driver.last}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="team-logo-circle">
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                  />
                </div>
              </div>

              <div className="team-car-container">
                <img
                  src={team.car}
                  alt={`${team.name} F1 car`}
                  className="team-car"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;
import { useState } from "react";

import {
  MapPin,
  Gauge,
  Route,
  X,
  Radio,
} from "lucide-react";

import LiveTrackMap from "../components/circuit/LiveTrackMap";


function Circuits() {

  const circuits = [

  {
    name: "Bahrain",
    country: "Bahrain",
    apiCountry: "Bahrain",
    flag: "🇧🇭",
    length: "5.412 km",
    turns: 15,
    rounds: "Round 1",
  },

  {
    name: "Saudi Arabia",
    country: "Jeddah",
    apiCountry: "Saudi Arabia",
    flag: "🇸🇦",
    length: "6.174 km",
    turns: 27,
    rounds: "Round 2",
  },

  {
    name: "Australia",
    country: "Melbourne",
    apiCountry: "Australia",
    flag: "🇦🇺",
    length: "5.278 km",
    turns: 14,
    rounds: "Round 3",
  },

  {
    name: "Japan",
    country: "Suzuka",
    apiCountry: "Japan",
    flag: "🇯🇵",
    length: "5.807 km",
    turns: 18,
    rounds: "Round 4",
  },

  {
    name: "Monaco",
    country: "Monte Carlo",
    apiCountry: "Monaco",
    flag: "🇲🇨",
    length: "3.337 km",
    turns: 19,
    rounds: "Round 5",
  },

  {
    name: "Great Britain",
    country: "Silverstone",
    apiCountry: "Great Britain",
    flag: "🇬🇧",
    length: "5.891 km",
    turns: 18,
    rounds: "Round 12",
  },

  {
    name: "Belgium",
    country: "Spa-Francorchamps",
    apiCountry: "Belgium",
    flag: "🇧🇪",
    length: "7.004 km",
    turns: 19,
    rounds: "Round 13",
  },

  {
    name: "Italy",
    country: "Monza",
    apiCountry: "Italy",
    flag: "🇮🇹",
    length: "5.793 km",
    turns: 11,
    rounds: "Round 16",
  },

  {
    name: "Singapore",
    country: "Marina Bay",
    apiCountry: "Singapore",
    flag: "🇸🇬",
    length: "4.940 km",
    turns: 19,
    rounds: "Round 18",
  },

  {
    name: "United States",
    country: "Austin",
    apiCountry: "United States",
    flag: "🇺🇸",
    length: "5.513 km",
    turns: 20,
    rounds: "Round 19",
  },

  {
    name: "Mexico",
    country: "Mexico City",
    apiCountry: "Mexico",
    flag: "🇲🇽",
    length: "4.304 km",
    turns: 17,
    rounds: "Round 20",
  },

  {
    name: "Brazil",
    country: "São Paulo",
    apiCountry: "Brazil",
    flag: "🇧🇷",
    length: "4.309 km",
    turns: 15,
    rounds: "Round 21",
  },

];


  const [selectedCircuit, setSelectedCircuit] =
    useState(null);


  return (

    <div className="circuits-page">


      {/* PAGE HEADER */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            FORMULA 1 WORLD CHAMPIONSHIP
          </p>

          <h1>
            F1 Circuits
          </h1>

          <p className="page-description">

            Explore Formula 1 circuits with real track
            location data and driver movement replay.

          </p>

        </div>


        <div className="circuit-count">

          <strong>
            {circuits.length}
          </strong>

          <span>
            CIRCUITS
          </span>

        </div>

      </div>


      {/* LIVE TRACK MODAL */}

      {selectedCircuit && (

        <div
          className="circuit-modal-overlay"
          onClick={() =>
            setSelectedCircuit(null)
          }
        >

          <div
            className="circuit-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="close-circuit-modal"
              onClick={() =>
                setSelectedCircuit(null)
              }
            >

              <X size={22} />

            </button>


            <LiveTrackMap
              circuit={selectedCircuit}
            />


          </div>

        </div>

      )}


      {/* CIRCUIT GRID */}

      <div className="circuits-grid">

        {circuits.map((circuit) => (

          <div
            className="circuit-card"
            key={circuit.name}
          >


            <div className="circuit-top">

              <span className="round">
                {circuit.rounds}
              </span>

              <span className="circuit-flag">
                {circuit.flag}
              </span>

            </div>


            {/* TRACK PREVIEW */}

            <div className="circuit-map-placeholder">

              <Radio size={30} />

              <span>
                LIVE TRACK DATA
              </span>

            </div>


            <h2>
              {circuit.name}
            </h2>


            <div className="location">

              <MapPin size={14} />

              <span>
                {circuit.country}
              </span>

            </div>


            <div className="circuit-stats">

              <div>

                <Route size={15} />

                <span>
                  {circuit.length}
                </span>

              </div>


              <div>

                <Gauge size={15} />

                <span>
                  {circuit.turns} Turns
                </span>

              </div>

            </div>


            <button
              className="circuit-button"
              onClick={() =>
                setSelectedCircuit(circuit)
              }
            >

              Explore Live Track →

            </button>


          </div>

        ))}

      </div>

    </div>

  );

}


export default Circuits;
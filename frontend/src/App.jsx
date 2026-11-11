import {
  LayoutDashboard,
  Radio,
  Map,
  Brain,
  BarChart3,
  Trophy,
  Settings,
  Bell,
  Search,
  Users,
} from "lucide-react";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import LiveTiming from "./pages/LiveTiming";
import Circuits from "./pages/Circuits";
import Predictor from "./pages/Predictor";
import Historical from "./pages/Historical";
import Standings from "./pages/Standings";
import Teams from "./pages/Teams";

function App() {
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: Radio,
      label: "Live Timing",
      path: "/live-timing",
    },
    {
      icon: Map,
      label: "Circuits",
      path: "/circuits",
    },

    {
      icon: Users,
      label: "Teams",
      path: "/teams",
    },

    {
      icon: Brain,
      label: "AI Predictor",
      path: "/predictor",
    },
    {
      icon: BarChart3,
      label: "Historical",
      path: "/historical",
    },
    {
      icon: Trophy,
      label: "Standings",
      path: "/standings",
    },
  ];

  return (
    <BrowserRouter>
      <div className="app">

        {/* SIDEBAR */}

        <aside className="sidebar">

          {/* LOGO */}

          <div className="logo">
            <div className="logo-icon">F1</div>

            <div>
              <h2>
                RACE<span>VISION</span>
              </h2>

              <p>F1 ANALYTICS</p>
            </div>
          </div>

          {/* MAIN MENU */}

          <div className="menu">

            <p className="menu-title">
              MAIN MENU
            </p>

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `menu-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={20} />

                  <span>
                    {item.label}
                  </span>

                </NavLink>
              );

            })}

          </div>

          {/* BOTTOM */}

          <div className="sidebar-bottom">

            <div className="menu-item">
              <Settings size={20} />

              <span>
                Settings
              </span>
            </div>

            <div className="season-card">

              <p>FORMULA 1</p>

              <h3>2026 SEASON</h3>

              <span>
                LIVE DATA CENTER
              </span>

            </div>

          </div>

        </aside>

        {/* MAIN CONTENT */}

        <main className="main-content">

          {/* HEADER */}

          <header className="header">

            <div>

              <p className="eyebrow">
                FORMULA 1 ANALYTICS
              </p>

              <h1>
                RaceVision
              </h1>

            </div>

            <div className="header-actions">

              <div className="live-status">

                <span className="live-dot"></span>

                LIVE

              </div>

              <Search
                size={21}
                className="header-icon"
              />

              <Bell
                size={21}
                className="header-icon"
              />

              <div className="profile">
                SD
              </div>

            </div>

          </header>

          {/* ROUTES */}

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/live-timing"
              element={<LiveTiming />}
            />

            <Route
              path="/circuits"
              element={<Circuits />}
            />

            <Route
              path="/teams"
              element={<Teams />}
            />

            <Route
              path="/predictor"
              element={<Predictor />}
            />

            <Route
              path="/historical"
              element={<Historical />}
            />

            <Route
              path="/standings"
              element={<Standings />}
            />

          </Routes>

        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;
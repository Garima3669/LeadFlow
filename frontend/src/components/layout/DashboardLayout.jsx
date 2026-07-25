import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import "../../styles/DashboardLayout.css";


const DashboardLayout = () => {

  const {
    user,
    logout,
  } = useAuth();

  const location =
    useLocation();

  const navigate =
    useNavigate();


  const handleLogout = () => {

    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );

  };


  return (

    <div className="dashboard-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo-icon">
            L
          </div>

          <div>

            <h2>
              LeadFlow
            </h2>

            <span>
              Sales CRM
            </span>

          </div>

        </div>


        <nav className="sidebar-nav">

          <Link
            to="/dashboard"
            className={
              location.pathname ===
              "/dashboard"
                ? "nav-item active"
                : "nav-item"
            }
          >

            <span>
              📊
            </span>

            Dashboard

          </Link>


          <Link
            to="/leads"
            className={
              location.pathname.startsWith(
                "/leads"
              )
                ? "nav-item active"
                : "nav-item"
            }
          >

            <span>
              👥
            </span>

            Leads

          </Link>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="user-card">

            <div className="user-avatar">

              {user?.name
                ?.charAt(0)
                ?.toUpperCase()}

            </div>


            <div className="user-info">

              <strong>
                {user?.name}
              </strong>

              <span>
                {user?.role}
              </span>

            </div>

          </div>


          <button
            className="logout-btn"
            onClick={
              handleLogout
            }
          >

            🚪 Logout

          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="main-content">

        <header className="topbar">

          <div>

            <h1>
              {location.pathname ===
              "/dashboard"
                ? "Dashboard"
                : "Lead Management"}
            </h1>

            <p>
              Manage your sales pipeline
              efficiently.
            </p>

          </div>


          <div className="topbar-user">

            <div className="topbar-avatar">

              {user?.name
                ?.charAt(0)
                ?.toUpperCase()}

            </div>

            <div>

              <strong>
                {user?.name}
              </strong>

              <span>
                {user?.role}
              </span>

            </div>

          </div>

        </header>


        <section className="page-content">

          <Outlet />

        </section>

      </main>

    </div>

  );

};


export default DashboardLayout;
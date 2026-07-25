import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";

import ProtectedRoute from "./components/ProtectedRoute";

import DashboardLayout from "./components/layout/DashboardLayout";

import CreateLead from "./pages/CreateLead";

import LeadDetails from "./pages/LeadDetails";

import Landing from "./pages/Landing";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={
            <Landing />
          }
        />

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        <Route
          path="/register"
          element={
            <Register />
          }
        />


        {/* PROTECTED ROUTES */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "MEMBER",
              ]}
            />
          }
        >
          <Route
            element={
              <DashboardLayout />
            }
          >

            <Route
              path="/dashboard"
              element={
                <Dashboard />
              }
            />

            <Route
              path="/leads"
              element={
                <Leads />
              }
            />

            <Route
              path="/leads/new"
              element={
                <CreateLead />
              }
            />

            <Route
              path="/leads/:id"
              element={
                <LeadDetails />
              }
            />

          </Route>
        </Route>
      </Routes>

    </BrowserRouter>

  );
}


export default App;
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const leadRoutes = require("./routes/leadRoutes");
const errorHandler = require(
  "./middleware/errorMiddleware"
);
const dashboardRoutes = require(
  "./routes/dashboardRoutes"
);

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

// Health check
app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "LeadFlow API is running",
    });
  }
);

// Authentication routes
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/test",
  testRoutes
);

app.use(
  "/api/leads",
  leadRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  errorHandler
);

module.exports = app;
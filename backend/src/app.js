const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/groups");
const eventRoutes = require("./routes/events");
const registrationRoutes = require("./routes/registrations");
const adminRoutes = require("./routes/admin");
const adminUsersRouter = require("./routes/user")
const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/users", adminUsersRouter);

app.get("/", (req, res) => res.send("Event Registration API Running"));

module.exports = app;

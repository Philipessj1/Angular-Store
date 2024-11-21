import express from "express";
import cors from "cors";
import conn from "./db/conn.js";
import { router as routes } from "./routes/router.js";

const app = express();

const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());

app.use(express.json({ limit: '5mb' }));

//Routes
app.use('/api', routes);

// DB connection and server start
conn().then(() =>
  app.listen(PORT, () => console.log(`App running on port: ${PORT}`))
);

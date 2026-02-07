const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDb = require("./config/db");

const PORT = Number(process.env.PORT) || 5000;
const MAX_PORT_TRIES = 10;

const startServer = async () => {
  await connectDb();

  const listenOnPort = (port, attempt = 1) => {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE" && attempt < MAX_PORT_TRIES) {
        const nextPort = port + 1;
        console.warn(
          `Port ${port} in use, retrying on ${nextPort} (attempt ${attempt + 1})`
        );
        server.close(() => listenOnPort(nextPort, attempt + 1));
        return;
      }
      throw err;
    });
  };

  listenOnPort(PORT);
};

startServer();

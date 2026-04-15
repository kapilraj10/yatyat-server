import dotenv from "dotenv";
import path from "path";
import { app } from "./app";
import { connectDB } from "./utils/db";

dotenv.config({
  path: path.resolve(process.cwd(), "src/.env"),
});

async function startServer() {
  try {
    await connectDB();

    const port = Number(process.env.PORT) || 8000;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();

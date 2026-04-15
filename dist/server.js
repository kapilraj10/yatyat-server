"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const app_1 = require("./app");
const db_1 = require("./utils/db");
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), "src/.env"),
});
async function startServer() {
    try {
        await (0, db_1.connectDB)();
        const port = Number(process.env.PORT) || 8000;
        app_1.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}
startServer();

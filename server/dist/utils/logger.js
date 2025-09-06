import winston from "winston";
import path from "path";
import fs from "fs";
// Ensure logs folder exists
const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const logFormat = winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
        ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
        : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.errors({ stack: true }), logFormat),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
        new winston.transports.File({ filename: path.join(logDir, "warn.log"), level: "warn" }),
        new winston.transports.File({ filename: path.join(logDir, "info.log"), level: "info" }),
        new winston.transports.File({ filename: path.join(logDir, "combined.log") }), // everything
    ],
});
// Show logs in console (dev only)
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    }));
}
export default logger;
//# sourceMappingURL=logger.js.map
/**
 * Logger utility for structured logging across the Creator OS.
 * Provides timestamps, levels, and contextual metadata.
 * Ready for integration with observability platforms (DataDog, Splunk, etc.)
 */

type LogLevel = "info" | "warn" | "error" | "debug";

type LogContext = {
    page?: string;
    endpoint?: string;
    userId?: string;
    sessionId?: string;
    duration?: number;
    [key: string]: unknown;
};

class Logger {
    private isDev = typeof window !== "undefined" && window.location?.hostname === "localhost";

    log(level: LogLevel, message: string, context?: LogContext) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            context: {
                environment: this.isDev ? "development" : "production",
                ...context,
            },
        };

        // Console output (development)
        if (this.isDev) {
            const color = {
                info: "color: #0ea5e9",
                warn: "color: #f59e0b",
                error: "color: #ef4444",
                debug: "color: #8b5cf6",
            }[level];
            console.log(`%c[${level.toUpperCase()}] ${message}`, color, logEntry);
        }

        // Send to observability backend (production)
        if (!this.isDev && level === "error") {
            this.sendToBackend(logEntry);
        }
    }

    info(message: string, context?: LogContext) {
        this.log("info", message, context);
    }

    warn(message: string, context?: LogContext) {
        this.log("warn", message, context);
    }

    error(message: string, context?: LogContext) {
        this.log("error", message, context);
    }

    debug(message: string, context?: LogContext) {
        this.log("debug", message, context);
    }

    private sendToBackend(logEntry: unknown) {
        // TODO: Wire to observability platform (DataDog, Splunk, etc.)
        // navigator.sendBeacon('/api/logs', JSON.stringify(logEntry));
    }
}

export const logger = new Logger();

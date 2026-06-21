type LogLevel = 'info' | 'warn' | 'error';

const writeLog = (level: LogLevel, message: string, payload?: Record<string, unknown>): void => {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        payload: payload ?? {},
    };

    const line = JSON.stringify(entry);
    if (level === 'error') {
        console.error(line);
        return;
    }

    if (level === 'warn') {
        console.warn(line);
        return;
    }

    console.log(line);
};

export const logInfo = (message: string, payload?: Record<string, unknown>): void => {
    writeLog('info', message, payload);
};

export const logWarn = (message: string, payload?: Record<string, unknown>): void => {
    writeLog('warn', message, payload);
};

export const logError = (message: string, payload?: Record<string, unknown>): void => {
    writeLog('error', message, payload);
};


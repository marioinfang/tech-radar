import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'admin.log');

const logEvent = (message) => {
    const now = new Date().toISOString();
    const logEntry = `${now} | ${message}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Fehler beim Schreiben in die Admin-Log-Datei:', err);
        }
    });
};

export { logEvent };
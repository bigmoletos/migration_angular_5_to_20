/**
 * Logger partagé pour toutes les phases de migration
 */

import { LogEntry, LogLevel } from '../types';

export class Logger {
  private context: string;
  private logLevel: LogLevel;

  constructor(context: string, logLevel: LogLevel = LogLevel.INFO) {
    this.context = context;
    this.logLevel = logLevel;
  }

  /**
   * Log un message de debug
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log un message d'information
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log un avertissement
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log une erreur
   */
  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  /**
   * Log une erreur critique
   */
  critical(message: string, data?: any): void {
    this.log(LogLevel.CRITICAL, message, data);
  }

  /**
   * Log un message avec un niveau spécifique
   */
  private log(level: LogLevel, message: string, data?: any): void {
    if (this.shouldLog(level)) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level,
        message,
        context: this.context,
        data
      };

      this.output(entry);
    }
  }

  /**
   * Détermine si le message doit être loggé
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.CRITICAL];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Affiche le log
   */
  private output(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.toUpperCase().padEnd(8);
    const context = `[${entry.context}]`;
    const message = entry.message;

    let output = `${timestamp} ${level} ${context} ${message}`;

    if (entry.data) {
      output += `\n${JSON.stringify(entry.data, null, 2)}`;
    }

    // Couleurs pour la console
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(output);
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.ERROR:
        console.error(output);
        break;
      case LogLevel.CRITICAL:
        console.error(`🚨 ${output}`);
        break;
    }
  }

  /**
   * Crée un logger enfant avec un contexte supplémentaire
   */
  child(additionalContext: string): Logger {
    return new Logger(`${this.context}:${additionalContext}`, this.logLevel);
  }

  /**
   * Change le niveau de log
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

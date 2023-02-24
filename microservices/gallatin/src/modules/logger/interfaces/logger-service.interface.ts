export interface ILoggerService {
  logger(message: string, eventType: string): void;
}

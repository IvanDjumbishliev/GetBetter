export interface HealthResponse {
  status: 'ok';
  message: string;
  database: 'up' | 'down';
  timestamp: string;
}

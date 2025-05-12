
export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface Metrics {
  time_to_first_token: number;
  streaming_duration: number;
  total_duration: number;
}

export interface LLMLogEntry {
  timestamp: string;
  user_id: number;
  file_id: number;
  tenant_id: number;
  model: string;
  duration_ms: number;
  status: string;
  request_id: string;
  chat_completion_id: string;
  token_usage: TokenUsage;
  question: string;
  response: string;
  metrics: Metrics;
}

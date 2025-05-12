
import { LLMLogEntry } from "../types/llm";

const sampleLogEntry: LLMLogEntry = {
  "timestamp": "2025-05-12T13:51:54.637330Z",
  "user_id": 1,
  "file_id": 2,
  "tenant_id": 3,
  "model": "llama-3.3-70b-instruct-quantized.w8a8",
  "duration_ms": 8169,
  "status": "success",
  "request_id": "f27334bb-c991-43e0-90eb-2a6ef8900b22",
  "chat_completion_id": "",
  "token_usage": {
    "prompt_tokens": 93,
    "completion_tokens": 24569,
    "total_tokens": 24662
  },
  "question": "Make the following text longer. Return only the resulting text.Text: \"\"\"\nIf you struggling with something or need advice, I here to offer support and guidance. Sometimes, all it takes is someone to talk to, and I happy to be that person. We can work through challenges together and find ways to overcome obstacles. And when you do achieve your goals, we can celebrate together and bask in the joy of success.\r\n\n\"\"\"",
  "response": "If you struggling with something or need advice, I here to offer support and guidance. Sometimes, all it takes is someone to talk to, and I happy to be that person. We can work through challenges together and find ways to overcome obstacles, no matter how daunting they may seem. Whether you facing a difficult decision, dealing with a personal issue, or trying to achieve a long-term goal, I here to listen and provide a fresh perspective. And when you do achieve your goals, we can celebrate together and bask in the joy of success. The feeling of accomplishment and pride that comes with overcoming adversity is truly unbeatable, and I be honored to be a part of your journey. By working together and supporting one another, we can build a strong foundation for success and create a brighter, more fulfilling future. So don hesitate to reach out if you need someone to talk to - I here to offer a helping hand, a sympathetic ear, and a supportive presence whenever you need it. Together, we can navigate life ups and downs and emerge stronger, wiser, and more resilient than ever before.",
  "metrics": {
    "time_to_first_token": 2712,
    "streaming_duration": 5457,
    "total_duration": 8169
  }
};

const models = [
  "llama-3.3-70b-instruct-quantized.w8a8",
  "llama-3.1-8b-instruct",
  "gpt-4-turbo",
  "claude-3-haiku"
];

const statuses = ["success", "error", "timeout"];

function getRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateMockData(count: number): LLMLogEntry[] {
  const data: LLMLogEntry[] = [];
  const now = new Date();
  const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  
  for (let i = 0; i < count; i++) {
    const duration_ms = getRandomNumber(1000, 15000);
    const time_to_first_token = getRandomNumber(500, 3000);
    const streaming_duration = duration_ms - time_to_first_token;
    const prompt_tokens = getRandomNumber(50, 200);
    const completion_tokens = getRandomNumber(5000, 30000);
    const total_tokens = prompt_tokens + completion_tokens;
    
    const entry: LLMLogEntry = {
      timestamp: getRandomDate(startDate, now),
      user_id: getRandomNumber(1, 10),
      file_id: getRandomNumber(1, 20),
      tenant_id: getRandomNumber(1, 5),
      model: models[Math.floor(Math.random() * models.length)],
      duration_ms,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      request_id: `req-${crypto.randomUUID()}`,
      chat_completion_id: Math.random() > 0.3 ? `cc-${crypto.randomUUID()}` : "",
      token_usage: {
        prompt_tokens,
        completion_tokens,
        total_tokens
      },
      question: sampleLogEntry.question,
      response: sampleLogEntry.response,
      metrics: {
        time_to_first_token,
        streaming_duration,
        total_duration: duration_ms
      }
    };
    
    data.push(entry);
  }
  
  return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const getMockLLMData = (count = 100): LLMLogEntry[] => {
  return generateMockData(count);
};

export const getMockLLMDataByFilter = (
  filter: {
    userId?: number;
    tenantId?: number;
    model?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  },
  count = 100
): LLMLogEntry[] => {
  const mockData = generateMockData(count);
  
  return mockData.filter(entry => {
    if (filter.userId !== undefined && entry.user_id !== filter.userId) return false;
    if (filter.tenantId !== undefined && entry.tenant_id !== filter.tenantId) return false;
    if (filter.model !== undefined && entry.model !== filter.model) return false;
    if (filter.status !== undefined && entry.status !== filter.status) return false;
    
    if (filter.dateFrom !== undefined) {
      const entryDate = new Date(entry.timestamp);
      if (entryDate < filter.dateFrom) return false;
    }
    
    if (filter.dateTo !== undefined) {
      const entryDate = new Date(entry.timestamp);
      if (entryDate > filter.dateTo) return false;
    }
    
    return true;
  });
};

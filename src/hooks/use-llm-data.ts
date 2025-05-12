
import { useState } from "react";
import { LLMLogEntry } from "../types/llm";
import { getMockLLMData, getMockLLMDataByFilter } from "../services/mockDataService";

interface FilterOptions {
  userId?: number;
  tenantId?: number;
  model?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export function useLLMData() {
  const [data, setData] = useState<LLMLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});

  const fetchData = async (count = 100) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      const result = Object.keys(filters).length > 0 
        ? getMockLLMDataByFilter(filters, count) 
        : getMockLLMData(count);
      
      setData(result);
    } catch (err) {
      console.error("Error fetching LLM data:", err);
      setError("Failed to fetch LLM data");
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    data,
    loading,
    error,
    filters,
    fetchData,
    updateFilters,
    clearFilters
  };
}

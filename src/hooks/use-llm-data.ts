
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
  searchQuery?: string;
}

export function useLLMData() {
  const [data, setData] = useState<LLMLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});

  // Calculate metrics
  const getTotalRequests = () => data.length;
  
  const getUniqueUsers = () => {
    const uniqueUserIds = new Set(data.map(entry => entry.user_id));
    return uniqueUserIds.size;
  };
  
  const getUniqueTenants = () => {
    const uniqueTenantIds = new Set(data.map(entry => entry.tenant_id));
    return uniqueTenantIds.size;
  };
  
  const getUniqueModels = () => {
    const uniqueModels = new Set(data.map(entry => entry.model));
    return Array.from(uniqueModels);
  };

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

  // Filter data client-side when using the search query
  const filterDataByQuery = (query: string) => {
    if (!query.trim()) return data;
    
    return data.filter(log => 
      log.question.toLowerCase().includes(query.toLowerCase()) ||
      log.response.toLowerCase().includes(query.toLowerCase()) ||
      log.request_id.toLowerCase().includes(query.toLowerCase()) ||
      log.model.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    data,
    loading,
    error,
    filters,
    getTotalRequests,
    getUniqueUsers,
    getUniqueTenants,
    getUniqueModels,
    filterDataByQuery,
    fetchData,
    updateFilters,
    clearFilters
  };
}

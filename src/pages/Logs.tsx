
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { LogsTable } from "@/components/logs/LogsTable";
import { LogsFilter } from "@/components/logs/LogsFilter";
import { useLLMData } from "@/hooks/use-llm-data";
import { Pagination } from "@/components/ui/pagination";

const Logs = () => {
  const { data, loading, error, fetchData, updateFilters, clearFilters } = useLLMData();
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  
  const availableModels = [
    "llama-3.3-70b-instruct-quantized.w8a8",
    "llama-3.1-8b-instruct",
    "gpt-4-turbo",
    "claude-3-haiku"
  ];

  useEffect(() => {
    fetchData(100);
  }, []);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredData(data);
      return;
    }

    const results = data.filter(log => 
      log.question.toLowerCase().includes(query.toLowerCase()) ||
      log.response.toLowerCase().includes(query.toLowerCase()) ||
      log.request_id.toLowerCase().includes(query.toLowerCase()) ||
      log.model.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredData(results);
    setPage(1);
  };

  const handleApplyFilters = (filters: any) => {
    updateFilters(filters);
    fetchData(100);
    setPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    fetchData(100);
    setPage(1);
  };

  // Pagination calculation
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title="Logs" onSearch={handleSearch} />

      <main className="flex-1 space-y-4 p-4 md:p-6">
        <LogsFilter 
          onApplyFilters={handleApplyFilters} 
          onClearFilters={handleClearFilters}
          availableModels={availableModels}
        />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Log Entries</h2>
            <p className="text-sm text-muted-foreground">
              Showing {filteredData.length === 0 ? 0 : indexOfFirstItem + 1} to{" "}
              {indexOfLastItem > filteredData.length ? filteredData.length : indexOfLastItem} of{" "}
              {filteredData.length} entries
            </p>
          </div>
          
          <LogsTable 
            logs={currentItems} 
            isLoading={loading} 
          />
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm ${
                        page === i + 1
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted hover:text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </Pagination>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Logs;

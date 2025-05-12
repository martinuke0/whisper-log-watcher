
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { LogsTable } from "@/components/logs/LogsTable";
import { LogsFilter } from "@/components/logs/LogsFilter";
import { useLLMData } from "@/hooks/use-llm-data";
import { Pagination } from "@/components/ui/pagination";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Database, Users, User, Filter } from "lucide-react";

const Logs = () => {
  const { 
    data, 
    loading, 
    error, 
    fetchData, 
    updateFilters, 
    clearFilters, 
    filterDataByQuery,
    getTotalRequests,
    getUniqueUsers,
    getUniqueTenants,
    getUniqueModels
  } = useLLMData();
  
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get available models for filter dropdown
  const availableModels = getUniqueModels();

  useEffect(() => {
    fetchData(100);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredData(filterDataByQuery(searchQuery));
    } else {
      setFilteredData(data);
    }
  }, [data, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleApplyFilters = (filters: any) => {
    updateFilters(filters);
    fetchData(100);
    setPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchQuery("");
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
        {/* Summary metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Database className="h-4 w-4 mr-2 text-observability-accent" />
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalRequests().toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-observability-accent" />
                Unique Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getUniqueUsers().toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-2 text-observability-accent" />
                Unique Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getUniqueTenants().toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
        
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

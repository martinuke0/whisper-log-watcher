
import { useEffect, useState } from "react";
import { Activity, Database, MonitorIcon, ChartPie, Users, User, Filter } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { ModelDistribution } from "@/components/dashboard/ModelDistribution";
import { LogsTable } from "@/components/logs/LogsTable";
import { Button } from "@/components/ui/button";
import { useLLMData } from "@/hooks/use-llm-data";

const Dashboard = () => {
  const { 
    data, 
    loading, 
    error, 
    fetchData, 
    getTotalRequests, 
    getUniqueUsers, 
    getUniqueTenants 
  } = useLLMData();
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    fetchData(100);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setRecentLogs(data.slice(0, 5));
    }
  }, [data]);

  const totalRequests = getTotalRequests();
  const uniqueUsers = getUniqueUsers();
  const uniqueTenants = getUniqueTenants();
  
  const avgResponseTime = data.length 
    ? Math.round(data.reduce((acc, log) => acc + log.duration_ms, 0) / data.length) 
    : 0;
  const totalTokens = data.length 
    ? data.reduce((acc, log) => acc + log.token_usage.total_tokens, 0) 
    : 0;
  const successRate = data.length 
    ? Math.round((data.filter(log => log.status === "success").length / data.length) * 100)
    : 0;

  // Chart data
  const chartData = Array(7)
    .fill(0)
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toLocaleDateString("en-US", { weekday: "short" });
      
      return {
        name: dateStr,
        responseTime: 2000 + Math.random() * 8000,
        tokenUsage: 5000 + Math.random() * 25000,
      };
    });

  const modelData = [
    { name: "llama-3", value: 65 },
    { name: "gpt-4", value: 20 },
    { name: "claude-3", value: 15 }
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title="LLM Observability" />

      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Requests"
            value={totalRequests.toLocaleString()}
            description="All processed requests"
            icon={<Database className="h-4 w-4 text-observability-accent" />}
            trend={{ value: 12, label: "from last week" }}
          />
          <MetricCard
            title="Unique Users"
            value={uniqueUsers.toLocaleString()}
            description="Individual users making requests"
            icon={<Users className="h-4 w-4 text-observability-accent" />}
          />
          <MetricCard
            title="Unique Tenants"
            value={uniqueTenants.toLocaleString()}
            description="Organizations using the API"
            icon={<User className="h-4 w-4 text-observability-accent" />}
          />
          <MetricCard
            title="Success Rate"
            value={`${successRate}%`}
            description="Successful requests percentage"
            icon={<ChartPie className="h-4 w-4 text-observability-accent" />}
            trend={{ value: 3, label: "from last week" }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <PerformanceChart data={chartData} title="Performance Trends" />
          <ModelDistribution data={modelData} />
          <div className="space-y-2 border rounded-lg p-4">
            <h3 className="font-medium text-lg flex items-center">
              <Filter className="h-4 w-4 mr-2 text-observability-accent" />
              Processing Metrics
            </h3>
            <MetricCard
              title="Average Response Time"
              value={`${avgResponseTime.toLocaleString()} ms`}
              description="Response time per request"
              icon={<Activity className="h-4 w-4 text-observability-accent" />}
              trend={{ value: -5, label: "from last week" }}
              className="border-none shadow-none"
            />
            <MetricCard
              title="Total Tokens Used"
              value={totalTokens.toLocaleString()}
              description="Tokens used in all requests"
              icon={<MonitorIcon className="h-4 w-4 text-observability-accent" />}
              trend={{ value: 8, label: "from last week" }}
              className="border-none shadow-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Recent Logs</h2>
            <Button variant="outline" asChild>
              <a href="/logs">View All</a>
            </Button>
          </div>
          
          <LogsTable logs={recentLogs} isLoading={loading} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

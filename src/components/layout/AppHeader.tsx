
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search } from "lucide-react";

interface AppHeaderProps {
  title: string;
  onSearch?: (query: string) => void;
}

export function AppHeader({ title, onSearch }: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Navigate through different sections of the app.
              </SheetDescription>
            </SheetHeader>
            <nav className="grid gap-2 py-6">
              <a href="/" className="flex items-center gap-2 px-2 py-1 text-lg font-semibold">
                Dashboard
              </a>
              <a href="/logs" className="flex items-center gap-2 px-2 py-1 text-lg font-semibold">
                Logs
              </a>
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden lg:flex lg:gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs..."
              className="w-[200px] pl-8 md:w-[300px] lg:w-[500px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
    </header>
  );
}

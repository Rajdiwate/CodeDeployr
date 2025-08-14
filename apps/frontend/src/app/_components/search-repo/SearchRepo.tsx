"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/redux";
import { setSearchString } from "@/lib/slices/repoSlice";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchRepo() {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();

  let debounceTimeout: ReturnType<typeof setTimeout>;

  function handleInputChange(query: string) {
    clearTimeout(debounceTimeout);
    setSearchQuery(query);

    debounceTimeout = setTimeout(() => {
      dispatch(setSearchString(query));
    }, 300);
  }

  return (
    <Card
      className="mb-8 bg-gray-950/50 border-gray-800/50 shadow-2xl "
      style={{ zIndex: 0 }}
    >
      <CardContent className="p-6">
        <div className="relative " style={{ zIndex: 0 }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          />
        </div>
      </CardContent>
    </Card>
  );
}

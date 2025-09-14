import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { useBuyerStore } from "@/lib/store/buyerStore";

type FilterType = 'city' | 'propertyType' | 'status' | 'timeline';

const filterOptions = {
  city: ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"],
  propertyType: ["Apartment", "Villa", "Plot", "Office", "Retail", "Warehouse", "Industrial", "Other"],
  status: ["New", "Qualified", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"],
  timeline: ["0-3m", "3-6m", ">6m", "Exploring"]
} as const;

const filterLabels: Record<FilterType, string> = {
  city: "City",
  propertyType: "Property Type",
  status: "Status",
  timeline: "Timeline"
};

export function BuyerFilters() {
  const { filters, setFilters } = useBuyerStore();

  const handleFilterChange = (type: FilterType, value: string) => {
    setFilters({
      ...filters,
      [type]: filters[type] === value ? undefined : value
    });
  };

  const clearFilters = () => {
    const { resetFilters } = useBuyerStore.getState();
    resetFilters();
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Filter by:</span>
      
      {Object.entries(filterOptions).map(([type, options]) => (
        <DropdownMenu key={type}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-8 ${filters[type as FilterType] ? 'bg-accent' : ''}`}
            >
              {filters[type as FilterType] || filterLabels[type as FilterType]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{filterLabels[type as FilterType]}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {options.map((option) => (
              <DropdownMenuCheckboxItem
                key={option}
                checked={filters[type as FilterType] === option}
                onCheckedChange={() => handleFilterChange(type as FilterType, option)}
              >
                {option}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={clearFilters}
        className="h-8 text-xs"
      >
        Clear filters
      </Button>
    </div>
  );
}

import { format } from "date-fns";
import { CalendarIcon, ArrowUpDown, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExpenseFilters as FilterType, SortField, SortDirection } from "@/types/expense";

interface ExpenseFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onExport: () => void;
}

export function ExpenseFilters({ filters, onFiltersChange, onExport }: ExpenseFiltersProps) {
  const updateFilter = (updates: Partial<FilterType>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearDateFilters = () => {
    onFiltersChange({
      ...filters,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const hasDateFilters = filters.startDate || filters.endDate;

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border">
      {/* Date Range Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">From:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[160px] justify-start text-left font-normal",
                !filters.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? format(filters.startDate, "PP") : "Start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.startDate}
              onSelect={(date) => updateFilter({ startDate: date })}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">To:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[160px] justify-start text-left font-normal",
                !filters.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate ? format(filters.endDate, "PP") : "End date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.endDate}
              onSelect={(date) => updateFilter({ endDate: date })}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {hasDateFilters && (
        <Button variant="ghost" size="sm" onClick={clearDateFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear dates
        </Button>
      )}

      {/* Sort Controls */}
      <div className="flex items-center gap-2 ml-auto">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <Select
          value={`${filters.sortField}-${filters.sortDirection}`}
          onValueChange={(value) => {
            const [field, direction] = value.split("-") as [SortField, SortDirection];
            updateFilter({ sortField: field, sortDirection: direction });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense_date-desc">Date (Newest first)</SelectItem>
            <SelectItem value="expense_date-asc">Date (Oldest first)</SelectItem>
            <SelectItem value="amount-desc">Amount (Highest first)</SelectItem>
            <SelectItem value="amount-asc">Amount (Lowest first)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Export Button */}
      <Button variant="outline" onClick={onExport}>
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
    </div>
  );
}

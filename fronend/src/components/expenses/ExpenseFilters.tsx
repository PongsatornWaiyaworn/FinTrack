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

export function ExpenseFilters({
  filters,
  onFiltersChange,
  onExport,
}: ExpenseFiltersProps) {
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
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:flex-wrap md:items-center">
      {/* Date filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* From */}
        <div className="flex items-center gap-2">
          <span className="w-12 text-sm font-medium text-muted-foreground">
            From
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal md:w-[160px]",
                  !filters.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate
                  ? format(filters.startDate, "PP")
                  : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => updateFilter({ startDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To */}
        <div className="flex items-center gap-2">
          <span className="w-12 text-sm font-medium text-muted-foreground">
            To
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal md:w-[160px]",
                  !filters.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate
                  ? format(filters.endDate, "PP")
                  : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) => updateFilter({ endDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear date */}
        {hasDateFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateFilters}
            className="self-start md:self-auto"
          >
            <X className="mr-1 h-4 w-4" />
            Clear dates
          </Button>
        )}
      </div>

      {/* Sort */}
      <div className="flex w-full items-center gap-2 md:ml-auto md:w-auto">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <Select
          value={`${filters.sortField}-${filters.sortDirection}`}
          onValueChange={(value) => {
            const [field, direction] = value.split(
              "-"
            ) as [SortField, SortDirection];
            updateFilter({ sortField: field, sortDirection: direction });
          }}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense_date-desc">
              Date (Newest first)
            </SelectItem>
            <SelectItem value="expense_date-asc">
              Date (Oldest first)
            </SelectItem>
            <SelectItem value="amount-desc">
              Amount (Highest first)
            </SelectItem>
            <SelectItem value="amount-asc">
              Amount (Lowest first)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Export */}
      <Button
        variant="outline"
        onClick={onExport}
        className="w-full md:w-auto"
      >
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}

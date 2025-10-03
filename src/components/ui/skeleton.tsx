import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gray-200 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

// Card Skeleton for loading car cards
function CarCardSkeleton() {
  return (
    <div className="h-full flex flex-col rounded-xl border shadow-sm bg-white">
      {/* Image skeleton */}
      <div className="w-full relative flex-shrink-0 overflow-hidden">
        <div className="aspect-video">
          <Skeleton className="w-full h-full rounded-t-xl" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="py-4 px-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <div className="flex gap-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <Skeleton className="h-5 w-20 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        
        {/* Button skeleton */}
        <div className="mt-auto">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

// Table Row Skeleton for admin tables
function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-200">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Stats Card Skeleton for dashboard
function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <Skeleton className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// Activity List Skeleton
function ActivitySkeleton() {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg">
      <div className="flex-shrink-0 mt-1">
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-5 w-12" />
    </div>
  );
}

// Settings Page Skeleton
function SettingsSkeleton() {
  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Activity List Page Skeleton
function ActivityListSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b border-gray-200">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ActivitySkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Listings Management Skeleton
function ListingsManagementSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Filters and Stats */}
      <div className="bg-white rounded-lg border p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b border-gray-200">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-100 bg-gray-50">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
          {/* Table Rows */}
          {Array.from({ length: 6 }).map((_, index) => (
            <TableRowSkeleton key={index} columns={7} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Add/Edit Listing Form Skeleton
function AddEditListingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border p-6">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg border p-6">
          <Skeleton className="h-6 w-16 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg border p-6">
          <Skeleton className="h-6 w-20 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video w-full" />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton, CarCardSkeleton, TableRowSkeleton, StatsCardSkeleton, ActivitySkeleton, SettingsSkeleton, ActivityListSkeleton, ListingsManagementSkeleton, AddEditListingSkeleton };

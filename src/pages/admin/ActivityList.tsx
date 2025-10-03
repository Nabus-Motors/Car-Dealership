import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActivityListSkeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Filter, 
  Calendar as CalendarIcon, 
  Search, 
  RefreshCw, 
  Download,
  Plus,
  Edit,
  Trash2,
  ShoppingCart,
  User,
  Settings,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { subscribeToActivities, ACTIVITY_TYPE_LABELS, ACTIVITY_STATUS_COLORS } from '@/services/activityService';
import type { Activity, ActivityFilters } from '@/types/activity';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

interface ActivityListProps {
  onNavigate: (page: string) => void;
}

const ACTIVITY_TYPE_ICONS: Record<Activity['type'], any> = {
  car_added: Plus,
  car_updated: Edit,
  car_deleted: Trash2,
  car_sold: ShoppingCart,
  user_login: User,
  user_logout: User,
  settings_updated: Settings
};

const STATUS_ICONS: Record<Activity['status'], any> = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info
};

export function ActivityList({ onNavigate: _ }: ActivityListProps) {
  // onNavigate is available for future navigation needs
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ActivityFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    console.log('ActivityList: Current user:', user);
    
    setLoading(true); // Set loading to true when starting subscription
    
    // Set a timeout to ensure loading doesn't persist forever
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);
    
    const unsubscribe = subscribeToActivities((data) => {
      clearTimeout(timeout);
      console.log('ActivityList: Received activities from Firebase:', data.length, 'items');
      console.log('ActivityList: Activity data:', data);
      
      // If no activities from database, show some mock data for demonstration
      if (data.length === 0) {
        console.log('ActivityList: No activities found, showing mock data');
        const mockActivities: Activity[] = [
          {
            id: '1',
            type: 'car_added',
            entityId: 'car1',
            userId: 'admin',
            userName: 'Admin User',
            message: 'Added new 2023 Tesla Model S to inventory',
            details: { price: 89990, brand: 'Tesla', model: 'Model S' },
            timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 30) } as any, // 30 minutes ago
            status: 'success'
          },
          {
            id: '2',
            type: 'car_updated',
            entityId: 'car2',
            userId: 'admin',
            userName: 'Admin User',
            message: 'Updated pricing for 2022 BMW X5',
            details: { oldPrice: 65000, newPrice: 62000 },
            timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 60 * 2) } as any, // 2 hours ago
            status: 'info'
          },
          {
            id: '3',
            type: 'car_sold',
            entityId: 'car3',
            userId: 'admin',
            userName: 'Sales Manager',
            message: 'Marked 2021 Audi A4 as sold',
            details: { salePrice: 45000, buyer: 'John Smith' },
            timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 60 * 5) } as any, // 5 hours ago
            status: 'success'
          },
          {
            id: '4',
            type: 'settings_updated',
            entityId: undefined,
            userId: 'admin',
            userName: 'Admin User',
            message: 'Updated system settings',
            details: { section: 'general' },
            timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 60 * 24) } as any, // 1 day ago
            status: 'info'
          },
          {
            id: '5',
            type: 'user_login',
            entityId: undefined,
            userId: 'admin',
            userName: 'Admin User',
            message: 'Admin user logged into the system',
            details: { ip: '192.168.1.100', browser: 'Chrome' },
            timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) } as any, // 2 days ago
            status: 'success'
          }
        ];
        setActivities(mockActivities);
      } else {
        setActivities(data);
      }
      setLoading(false); // Always set loading to false after receiving data
    }, filters, 100);

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [filters]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Create a test activity to see if activities are working
    if (user) {
      import('@/services/activityService').then(({ logActivity }) => {
        logActivity(
          'user_login',
          'Test activity created from refresh',
          user.uid,
          user.displayName || user.email || 'Test User',
          { status: 'info', details: { testRefresh: true } }
        ).then(() => {
          console.log('Test activity logged successfully');
        }).catch((err) => {
          console.error('Failed to log test activity:', err);
        });
      });
    }
    
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const applyFilters = () => {
    const newFilters: ActivityFilters = {
      ...filters,
      startDate,
      endDate
    };
    setFilters(newFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({});
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm('');
  };

  const filteredActivities = activities.filter(activity => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        activity.message.toLowerCase().includes(searchLower) ||
        activity.userName.toLowerCase().includes(searchLower) ||
        ACTIVITY_TYPE_LABELS[activity.type].toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const exportActivities = () => {
    const csvContent = [
      ['Date', 'Type', 'User', 'Message', 'Status'],
      ...filteredActivities.map(activity => [
        format(activity.timestamp.toDate(), 'yyyy-MM-dd HH:mm:ss'),
        ACTIVITY_TYPE_LABELS[activity.type],
        activity.userName,
        activity.message,
        activity.status
      ])
    ].map(row => row.join(',')).join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <ActivityListSkeleton />;
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600 mt-1">
            {filteredActivities.length} activities found
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={exportActivities}
            disabled={filteredActivities.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-gray-100' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Clear Filters */}
            {(Object.keys(filters).length > 0 || searchTerm) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Activity Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {Object.entries(ACTIVITY_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'MMM dd, yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'MMM dd, yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={applyFilters}>Apply Filters</Button>
                <Button variant="outline" onClick={() => setShowFilters(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">
                {searchTerm || Object.keys(filters).length > 0
                  ? 'Try adjusting your search or filters.'
                  : 'Activities will appear here as users interact with the system.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => {
                const ActivityIcon = ACTIVITY_TYPE_ICONS[activity.type];
                const StatusIcon = STATUS_ICONS[activity.status];
                
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ACTIVITY_STATUS_COLORS[activity.status]}`}>
                        <ActivityIcon className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {activity.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>By {activity.userName}</span>
                            <span>•</span>
                            <span>{getTimeAgo(activity.timestamp)}</span>
                            <span>•</span>
                            <span>{format(activity.timestamp.toDate(), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge className={`text-xs ${ACTIVITY_STATUS_COLORS[activity.status]}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {ACTIVITY_TYPE_LABELS[activity.type]}
                          </Badge>
                        </div>
                      </div>
                      
                      {activity.details && Object.keys(activity.details).length > 0 && (
                        <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded p-2">
                          <strong>Details:</strong> {JSON.stringify(activity.details, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
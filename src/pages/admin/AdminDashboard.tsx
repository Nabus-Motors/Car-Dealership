import { useState, useEffect } from 'react';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, DollarSign, CheckCircle, Plus, List, BarChart3, ShoppingCart, Edit, RefreshCw } from 'lucide-react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/firebase/firebase';
import type { Car as CarType } from '@/types/car';
import { normalizeImageUrls } from '@/utils/images';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch cars from Firebase
  useEffect(() => {
    const carsQuery = query(
      collection(db, COLLECTIONS.CARS),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(carsQuery, (snapshot) => {
      const carsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CarType[];
      carsData.forEach(c => { (c as any).imageUrls = normalizeImageUrls(c); });
      setCars(carsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching cars:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate dynamic stats
  const totalCars = cars.length;
  const publishedCars = cars.filter(car => car.status === 'published').length;
  const soldCars = cars.filter(car => car.status === 'sold').length;
  const draftCars = cars.filter(car => car.status === 'draft').length;
  const newCars = cars.filter(car => car.status === 'new').length;
  const totalValue = cars
    .filter(car => car.status === 'published' || car.status === 'new')
    .reduce((sum, car) => sum + car.price, 0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const statsData = [
    {
      title: 'Total Inventory',
      value: totalCars,
      icon: Car,
      change: {
        value: `${publishedCars} published`,
        trend: 'up' as const
      },
      description: 'All cars in system'
    },
    {
      title: 'Inventory Value',
      value: `$${(totalValue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      change: {
        value: `${cars.filter(car => car.status === 'published' || car.status === 'new').length} available`,
        trend: 'up' as const
      },
      description: 'Total active value'
    },
    {
      title: 'Published Listings',
      value: publishedCars,
      icon: CheckCircle,
      change: {
        value: `${newCars} new listings`,
        trend: newCars > 0 ? 'up' as const : 'neutral' as const
      },
      description: 'Live on website'
    },
    {
      title: 'Sold Cars',
      value: soldCars,
      icon: ShoppingCart,
      change: {
        value: `${draftCars} drafts`,
        trend: soldCars > 0 ? 'up' as const : 'neutral' as const
      },
      description: 'Completed sales'
    }
  ];

  // Generate recent activities from car data
  const generateRecentActivities = () => {
    const activities: Array<{
      id: number;
      type: string;
      message: string;
      time: string;
      status: string;
      icon: any;
    }> = [];
    const sortedCars = [...cars]
      .sort((a, b) => {
        const aTime = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt);
        const bTime = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt);
        return bTime.getTime() - aTime.getTime();
      })
      .slice(0, 5);

    sortedCars.forEach((car, index) => {
      const timeAgo = getTimeAgo(car.updatedAt);
      const isNew = car.createdAt?.toString() === car.updatedAt?.toString();
      
      activities.push({
        id: index + 1,
        type: car.status === 'sold' ? 'sold' : (isNew ? 'added' : 'edited'),
        message: car.status === 'sold' 
          ? `${car.year} ${car.brand} ${car.model} marked as sold`
          : isNew 
            ? `New ${car.year} ${car.brand} ${car.model} listing added`
            : `${car.year} ${car.brand} ${car.model} listing updated`,
        time: timeAgo,
        status: car.status === 'sold' ? 'success' : (isNew ? 'success' : 'info'),
        icon: car.status === 'sold' ? ShoppingCart : (isNew ? Plus : Edit)
      });
    });

    // If no activities, show placeholder
    if (activities.length === 0) {
      activities.push({
        id: 1,
        type: 'info',
        message: 'No recent activity. Add your first car listing to get started!',
        time: 'Welcome',
        status: 'info',
        icon: Plus
      });
    }

    return activities;
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const recentActivities = generateRecentActivities();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your car dealership</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              description={stat.description}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Activity
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Last 7 days
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        <activity.icon className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button variant="outline" className="w-full" size="sm">
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => onNavigate('add-listing')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Car
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate('listings')}
                >
                  <List className="mr-2 h-4 w-4" />
                  View All Listings
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Report
                  <Badge className="ml-2 bg-gray-100 text-gray-500 text-xs">Soon</Badge>
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <Badge className="bg-green-100 text-green-800 text-xs">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Image Storage</span>
                  <Badge className="bg-green-100 text-green-800 text-xs">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Gateway</span>
                  <Badge className="bg-green-100 text-green-800 text-xs">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Backup</span>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">Running</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}
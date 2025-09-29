import { AdminHeader } from './AdminHeader';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, DollarSign, CheckCircle, Clock, Plus, List, BarChart3, ShoppingCart, Edit, Trash2 } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  onToggleMobileMenu?: () => void;
}

export function AdminDashboard({ onNavigate, onToggleMobileMenu }: AdminDashboardProps) {
  const statsData = [
    {
      title: 'Total Cars Listed',
      value: 24,
      icon: Car,
      change: {
        value: '+3 this week',
        trend: 'up' as const
      },
      description: 'Active inventory'
    },
    {
      title: 'Cars Sold',
      value: 127,
      icon: DollarSign,
      change: {
        value: '+12 this month',
        trend: 'up' as const
      },
      description: 'Total sales'
    },
    {
      title: 'Active Listings',
      value: 18,
      icon: CheckCircle,
      change: {
        value: 'No change',
        trend: 'neutral' as const
      },
      description: 'Currently available'
    },
    {
      title: 'Pending Approvals',
      value: 3,
      icon: Clock,
      change: {
        value: '+1 today',
        trend: 'up' as const
      },
      description: 'Awaiting review'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'added',
      message: 'New 2024 BMW M5 Sedan listing added',
      time: '2 hours ago',
      status: 'success',
      icon: Plus
    },
    {
      id: 2,
      type: 'sold',
      message: '2023 Ferrari 488 GTB marked as sold',
      time: '4 hours ago',
      status: 'success',
      icon: ShoppingCart
    },
    {
      id: 3,
      type: 'edited',
      message: 'Tesla Model S listing price updated',
      time: '6 hours ago',
      status: 'info',
      icon: Edit
    },
    {
      id: 4,
      type: 'deleted',
      message: '2022 Audi Q7 listing removed',
      time: '1 day ago',
      status: 'warning',
      icon: Trash2
    },
    {
      id: 5,
      type: 'added',
      message: 'New 2024 Mercedes S-Class listing added',
      time: '2 days ago',
      status: 'success',
      icon: Plus
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <AdminHeader title="Dashboard" onToggleMobileMenu={onToggleMobileMenu} />
      
      <div className="p-6 space-y-6">
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
    </div>
  );
}
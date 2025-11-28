import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  description?: string;
}

export function StatsCard({ title, value, icon, change, description }: StatsCardProps) {
  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-2 border-slate-200 rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-[#001F3F] mb-1">{value}</p>
            
            {change && (
              <div className={`flex items-center text-sm ${getTrendColor(change.trend)}`}>
                <span className="mr-1">{getTrendIcon(change.trend)}</span>
                <span>{change.value}</span>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-slate-500 mt-1">{description}</p>
            )}
          </div>
          
          <div className="bg-[#FFD700]/20 p-3 rounded-lg">
            {React.createElement(icon, { className: "h-6 w-6 text-[#FFD700]" })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
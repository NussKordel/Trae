'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { 
  Calendar, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Dumbbell,
  Target,
  MapPin
} from 'lucide-react';

interface ScheduledWorkout {
  id: number;
  title: string;
  time: string;
  duration: number;
  type: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'missed';
}

const SchedulePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // TODO: Replace with actual user scheduled workouts from store
  const scheduledWorkouts: ScheduledWorkout[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'strength':
        return 'bg-purple-100 text-purple-800';
      case 'cardio':
        return 'bg-orange-100 text-orange-800';
      case 'flexibility':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Workout Schedule</h1>
          <p className="text-gray-600 mt-2">Plan and track your fitness routine</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Schedule Workout</span>
        </Button>
      </div>

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-2xl font-bold">4.5h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-2xl font-bold">7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateDate('prev')}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="text-center">
              <CardTitle className="text-xl">{formatDate(selectedDate)}</CardTitle>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateDate('next')}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Daily Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>
            Your planned workouts for {selectedDate.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledWorkouts.length > 0 ? (
              scheduledWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary-600">{workout.time}</p>
                      <p className="text-xs text-gray-500">{workout.duration} min</p>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{workout.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getTypeColor(workout.type)}>
                          {workout.type}
                        </Badge>
                        {workout.location && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span>{workout.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(workout.status)}>
                      {workout.status.charAt(0).toUpperCase() + workout.status.slice(1)}
                    </Badge>
                    
                    {workout.status === 'scheduled' && (
                      <Button size="sm">
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No workouts scheduled for this day</p>
                <Button className="mt-4 flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Workout</span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Plus className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Schedule Workout</h3>
            <p className="text-sm text-gray-600">Add a new workout to your calendar</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Set Goals</h3>
            <p className="text-sm text-gray-600">Define your weekly fitness targets</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">View Calendar</h3>
            <p className="text-sm text-gray-600">See your full monthly schedule</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchedulePage;
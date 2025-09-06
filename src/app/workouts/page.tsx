'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { useWorkoutStore } from '@/store/useAppStore';
import { 
  Dumbbell, 
  Clock, 
  Target, 
  TrendingUp,
  Play,
  Plus
} from 'lucide-react';

const WorkoutsPage: React.FC = () => {
  const router = useRouter();
  const { savedWorkouts, getRecentWorkouts } = useWorkoutStore();
  
  // Calculate dynamic stats from user workouts
  const totalWorkouts = savedWorkouts.length;
  const totalTime = savedWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
  const thisWeekWorkouts = 0; // TODO: Calculate workouts from this week
  const currentStreak = 0; // TODO: Calculate current workout streak
  const recentWorkouts = getRecentWorkouts(3);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Workouts</h1>
          <p className="text-gray-600 mt-2">Discover and track your fitness routines</p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => router.push('/workouts/generate')}
        >
          <Plus className="h-4 w-4" />
          <span>Create Workout</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Total Workouts</p>
                <p className="text-2xl font-bold">{totalWorkouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-2xl font-bold">{Math.floor(totalTime / 60)}h {totalTime % 60}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{thisWeekWorkouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-2xl font-bold">{currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workout Library */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Workout Library</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedWorkouts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts yet</h3>
              <p className="text-gray-500 mb-6">Create your first workout to get started on your fitness journey!</p>
              <Button 
                onClick={() => router.push('/workouts/generate')}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Your First Workout</span>
              </Button>
            </div>
          ) : (
            savedWorkouts.map((workout) => (
              <Card key={workout.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{workout.title}</CardTitle>
                    {workout.difficulty && (
                      <Badge className={getDifficultyColor(workout.difficulty)}>
                        {workout.difficulty}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{workout.description || 'Custom workout'}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{workout.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Dumbbell className="h-4 w-4" />
                      <span>{workout.equipment?.join(', ') || 'Various'}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full flex items-center space-x-2"
                    onClick={() => router.push(`/workouts/execute?workout=${encodeURIComponent(JSON.stringify(workout))}`)}
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Workout</span>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest workout sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentWorkouts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No recent workouts</p>
                <p className="text-sm text-gray-400 mt-1">Start your fitness journey by creating your first workout!</p>
              </div>
            ) : (
              recentWorkouts.map((workout, index) => (
                <div key={workout.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">{workout.title || 'Workout'}</p>
                      <p className="text-sm text-gray-600">
                        {workout.completedAt ? `Completed ${new Date(workout.completedAt).toLocaleDateString()}` : 'Not completed'}
                      </p>
                    </div>
                  </div>
                  <Badge className={workout.completedAt ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                    {workout.completedAt ? 'Completed' : 'Saved'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutsPage;
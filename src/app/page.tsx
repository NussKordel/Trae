'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, TrendingUp, Flame, Target, Clock, Play, MoreHorizontal } from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '@/components/ui';
import { useUserStore } from '@/store/useAppStore';

export default function HomePage() {
  const { profile } = useUserStore();
  
  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get actual user data from store
  const recentWorkouts: Array<{
    id: string;
    name: string;
    date: string;
    duration: number;
    exercises: number;
    completed: boolean;
  }> = [];
  const stats = {
    weeklyWorkouts: 0,
    totalMinutes: 0,
    streak: 0,
    caloriesBurned: 0
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Greeting */}
      <section className="bg-white dark:bg-gray-800 px-4 py-6 shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {getGreeting()}{profile?.name ? `, ${profile.name}` : ''}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Ready for your next workout?
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Button */}
      <section className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <Link href={profile ? "/workouts/questionnaire" : "/onboarding"}>
            <Button className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
              <Play className="mr-2 h-5 w-5" />
              {profile ? 'Generate Today\'s Workout' : 'Get Started'}
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            This Week's Progress
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.weeklyWorkouts}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Workouts</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalMinutes}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Minutes</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.streak}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.caloriesBurned}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Calories</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Workouts Section */}
      <section className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Workouts
            </h2>
            <Link href="/workouts">
              <Button variant="ghost" size="sm" className="text-primary-600 dark:text-primary-400">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentWorkouts.length > 0 ? (
              recentWorkouts.map((workout) => (
                <Card key={workout.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          workout.completed 
                            ? 'bg-green-500' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`} />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {workout.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(workout.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {workout.duration}min
                            </span>
                            <span>{workout.exercises} exercises</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <MoreHorizontal className="h-5 w-5 text-gray-400" />
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent workouts yet</p>
                <p className="text-sm">Start your fitness journey by generating your first workout!</p>
              </div>
            )}
          </div>
          
          {!profile && (
            <Card className="p-6 text-center mt-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Start Your Fitness Journey
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create your profile to get personalized workouts and track your progress.
              </p>
              <Link href="/onboarding">
                <Button size="sm">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </section>


    </div>
  )
}
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { useUserStore } from '@/store/useAppStore';
import { useWorkoutStore } from '@/store/useAppStore';
import { 
  User, 
  Edit, 
  Trophy, 
  Target, 
  Calendar,
  TrendingUp,
  Award,
  Activity,
  Clock,
  Zap
} from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  earned: boolean;
  earnedDate?: string;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { profile, updateProfile } = useUserStore();
  const { savedWorkouts } = useWorkoutStore();
  
  // Get user profile data from store
  const userProfile = {
    name: profile?.name || 'User',
    email: profile?.email || '',
    joinDate: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recently',
    fitnessLevel: profile?.fitnessLevel || 'Beginner',
    goals: profile?.fitnessGoal ? [profile.fitnessGoal.replace('_', ' ')] : [],
    avatar: ''
  };

  // Calculate achievements based on actual data
  const completedWorkouts = savedWorkouts.filter(w => w.completedAt).length;
  const totalWorkouts = savedWorkouts.length;
  const achievements: Achievement[] = [
    {
      id: 1,
      title: 'First Workout',
      description: 'Complete your first workout',
      icon: Activity,
      earned: completedWorkouts > 0,
      earnedDate: completedWorkouts > 0 ? savedWorkouts.find(w => w.completedAt)?.completedAt?.toLocaleDateString() : undefined
    },
    {
      id: 2,
      title: 'Workout Streak',
      description: 'Complete 5 workouts',
      icon: Trophy,
      earned: completedWorkouts >= 5,
      earnedDate: completedWorkouts >= 5 ? 'Recently' : undefined
    },
    {
      id: 3,
      title: 'Consistency King',
      description: 'Complete 10 workouts',
      icon: Award,
      earned: completedWorkouts >= 10,
      earnedDate: completedWorkouts >= 10 ? 'Recently' : undefined
    }
  ];

  // Calculate real stats from workout data
  const totalHours = Math.round(savedWorkouts.reduce((acc, workout) => {
    return acc + (workout.duration || 0);
  }, 0) / 60);
  
  const earnedAchievements = achievements.filter(a => a.earned).length;
  const totalAchievements = achievements.length;
  
  const stats: Stat[] = [
    {
      label: 'Total Workouts',
      value: totalWorkouts.toString(),
      change: completedWorkouts > 0 ? `${completedWorkouts} completed` : '',
      trend: completedWorkouts > 0 ? 'up' : 'neutral',
      icon: Activity
    },
    {
      label: 'Hours Trained',
      value: totalHours.toString(),
      change: totalHours > 0 ? 'Keep it up!' : '',
      trend: totalHours > 0 ? 'up' : 'neutral',
      icon: Clock
    },
    {
      label: 'Current Streak',
      value: completedWorkouts > 0 ? `${Math.min(completedWorkouts, 7)} days` : '0 days',
      change: completedWorkouts > 0 ? 'Active' : 'Start your journey',
      trend: completedWorkouts > 0 ? 'up' : 'neutral',
      icon: TrendingUp
    },
    {
      label: 'Achievements',
      value: `${earnedAchievements}/${totalAchievements}`,
      change: earnedAchievements > 0 ? 'Well done!' : 'Get started',
      trend: earnedAchievements > 0 ? 'up' : 'neutral',
      icon: Trophy
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600 mt-2">Track your fitness journey and achievements</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <User className="h-16 w-16 text-white" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">{userProfile.name}</h2>
              <p className="text-gray-600 mb-2">{userProfile.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <Badge className="bg-blue-100 text-blue-800">
                  {userProfile.fitnessLevel}
                </Badge>
                <Badge className="bg-gray-100 text-gray-800">
                  Member since {userProfile.joinDate}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Fitness Goals:</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {userProfile.goals.map((goal, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${getTrendColor(stat.trend)}`}>
                      {stat.change}
                    </p>
                  </div>
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            Your fitness milestones and accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.id} 
                  className={`p-4 border rounded-lg transition-all duration-200 ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-md' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-full ${
                      achievement.earned 
                        ? 'bg-yellow-100 text-yellow-600' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      {achievement.earned && achievement.earnedDate && (
                        <p className="text-xs text-gray-600">
                          Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest fitness activities and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Completed Full Body Strength workout</p>
                <p className="text-sm text-gray-600">2 hours ago • 45 minutes</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Earned "Early Bird" achievement</p>
                <p className="text-sm text-gray-600">Yesterday • 10 morning workouts</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Achievement</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Reached 7-day workout streak</p>
                <p className="text-sm text-gray-600">2 days ago • Personal best</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Milestone</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
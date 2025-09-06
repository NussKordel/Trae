'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Alert, AlertDescription, Badge } from '@/components/ui';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Settings, 
  Zap,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { OpenRouterService } from '@/services/openrouter';
import { WorkoutGeneratorService } from '@/services/ai/workoutGenerator';
import { APIKeyManager } from '@/components/settings/APIKeyManager';
import { AIModelSelector } from '@/components/ui/AIModelSelector';
import { AIModelType } from '@/types/ai';
import { RPEScale, Equipment } from '@/types/fitness';

interface TestResult {
  test: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

const AITestPage: React.FC = () => {
  const [openRouterService, setOpenRouterService] = useState<OpenRouterService | null>(null);
  const [workoutService, setWorkoutService] = useState<WorkoutGeneratorService | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModelType>(AIModelType.SCHNELL);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [workoutPrompt, setWorkoutPrompt] = useState('Create a 30-minute full-body workout for a beginner with no equipment');
  const [generatedWorkout, setGeneratedWorkout] = useState<string>('');
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);

  // Initialize services when API key is available
  useEffect(() => {
    const initializeServices = () => {
      const apiKey = localStorage.getItem('openrouter_api_key');
      if (apiKey) {
        const openRouter = new OpenRouterService(apiKey);
        const workout = new WorkoutGeneratorService();
        setOpenRouterService(openRouter);
        setWorkoutService(workout);
      } else {
        setOpenRouterService(null);
        setWorkoutService(null);
      }
    };

    initializeServices();
    
    // Listen for API key changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'openrouter_api_key') {
        initializeServices();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateTestResult = (testName: string, status: TestResult['status'], message?: string, duration?: number) => {
    setTestResults(prev => prev.map(test => 
      test.test === testName 
        ? { ...test, status, message, duration }
        : test
    ));
  };

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    const startTime = Date.now();
    updateTestResult(testName, 'running');
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      updateTestResult(testName, 'passed', 'Test completed successfully', duration);
    } catch (error) {
      const duration = Date.now() - startTime;
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      updateTestResult(testName, 'failed', message, duration);
    }
  };

  const runAllTests = async () => {
    if (!openRouterService) {
      alert('Please configure your OpenRouter API key first');
      return;
    }

    setIsRunningTests(true);
    
    // Initialize test results
    const tests: TestResult[] = [
      { test: 'API Key Validation', status: 'pending' },
      { test: 'Connection Test', status: 'pending' },
      { test: 'Model List Retrieval', status: 'pending' },
      { test: 'Basic Chat Completion', status: 'pending' },
      { test: 'Workout Generation', status: 'pending' },
      { test: 'Error Handling', status: 'pending' }
    ];
    
    setTestResults(tests);

    // Test 1: API Key Validation
    await runTest('API Key Validation', async () => {
      if (!openRouterService.hasApiKey()) {
        throw new Error('No API key configured');
      }
      if (openRouterService.getMaskedApiKey() === 'Not configured') {
        throw new Error('API key is not properly configured');
      }
    });

    // Test 2: Connection Test
    await runTest('Connection Test', async () => {
      const isConnected = await openRouterService.testConnection();
      if (!isConnected) {
        throw new Error('Failed to connect to OpenRouter API');
      }
    });

    // Test 3: Model List Retrieval
    await runTest('Model List Retrieval', async () => {
      const models = await openRouterService.getAvailableModels();
      if (!models || models.length === 0) {
        throw new Error('No models available or failed to retrieve models');
      }
    });

    // Test 4: Basic Chat Completion
    await runTest('Basic Chat Completion', async () => {
      const request = {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user' as const, content: 'Say "Hello, World!" and nothing else.' }],
        max_tokens: 50
      };
      const response = await openRouterService.generateResponse(
        request,
        { modelType: selectedModel }
      );
      if (!response || !response.choices || response.choices.length === 0 || !response.choices[0].message.content.trim()) {
        throw new Error('Empty response from chat completion');
      }
    });

    // Test 5: Workout Generation
    await runTest('Workout Generation', async () => {
      if (!workoutService) {
        throw new Error('Workout service not initialized');
      }
      const request = {
        userProfile: {
          id: 'test-user',
          name: 'Test User',
          age: 25,
          fitnessLevel: 'beginner' as const,
          fitnessGoal: 'strength' as const,
          workoutFrequency: '1-2' as const,
          availableEquipment: 'none' as const,
          workoutDuration: 30,
          injuries: [],
          noGoExercises: [],
          painAreas: [],
          medicalConditions: [],
          rpeUnderstanding: true,
          workoutMode: 'guided' as const,
          humorLevel: 'light' as const,
          musicPreference: true,
          restDayPreference: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          onboardingCompleted: true,
          profileType: 'complete' as const,
          notifications: true
        },
        sessionParameters: {
          duration: 30,
          goal: 'strength' as const,
          mode: 'classic' as const,
          targetMuscleGroups: ['full_body' as const],
          equipment: ['bodyweight'] as Equipment[],
          intensity: 7 as RPEScale
        }
      };
      const workout = await workoutService.generateWorkout(request, selectedModel);
      if (!workout || !workout.workout || !workout.workout.title) {
        throw new Error('Empty workout generated');
      }
    });

    // Test 6: Error Handling
    await runTest('Error Handling', async () => {
      try {
        // Test with invalid model to trigger error handling
        const request = {
          model: 'openai/gpt-3.5-turbo',
          messages: [{ role: 'user' as const, content: 'Test' }],
          max_tokens: -1 // Invalid maxTokens
        };
        await openRouterService.generateResponse(
          request,
          { modelType: selectedModel }
        );
        throw new Error('Expected error was not thrown');
      } catch (error) {
        // This should throw an error, which is expected
        if (error instanceof Error && error.message === 'Expected error was not thrown') {
          throw error;
        }
        // Any other error is expected and means error handling is working
      }
    });

    setIsRunningTests(false);
  };

  const generateWorkout = async () => {
    if (!workoutService) {
      alert('Please configure your OpenRouter API key first');
      return;
    }

    setIsGeneratingWorkout(true);
    setGeneratedWorkout('');

    try {
      const request = {
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user' as const, content: workoutPrompt }],
        max_tokens: 1000
      };
      if (!openRouterService) {
        throw new Error('OpenRouter service not initialized');
      }
      const response = await openRouterService.generateResponse(request, { modelType: selectedModel });
      setGeneratedWorkout(response?.choices?.[0]?.message?.content || 'No response generated');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setGeneratedWorkout(`Error generating workout: ${message}`);
    } finally {
      setIsGeneratingWorkout(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Integration Test Suite</h1>
        <p className="text-gray-600">Test and validate the OpenRouter AI integration system</p>
      </div>

      {/* API Key Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure your OpenRouter API key to enable AI features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <APIKeyManager />
        </CardContent>
      </Card>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Model Selection</CardTitle>
          <CardDescription>
            Choose the AI model type for testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </CardContent>
      </Card>

      {/* Test Suite */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Test Suite</CardTitle>
          <CardDescription>
            Run comprehensive tests to validate the AI integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runAllTests} 
            disabled={isRunningTests || !openRouterService}
            className="w-full"
          >
            {isRunningTests ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>

          {testResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Test Results:</h3>
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.test}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result.duration && (
                      <span className="text-sm text-gray-500">
                        {result.duration}ms
                      </span>
                    )}
                    {getStatusBadge(result.status)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {testResults.some(test => test.status === 'failed') && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Some tests failed. Check the error messages above and ensure your API key is valid.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Manual Workout Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Workout Generation</CardTitle>
          <CardDescription>
            Test workout generation with custom prompts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Workout Prompt:
            </label>
            <textarea
              value={workoutPrompt}
              onChange={(e) => setWorkoutPrompt(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
              placeholder="Describe the workout you want to generate..."
            />
          </div>
          
          <Button 
            onClick={generateWorkout}
            disabled={isGeneratingWorkout || !openRouterService}
            className="w-full"
          >
            {isGeneratingWorkout ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Workout...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Generate Workout
              </>
            )}
          </Button>

          {generatedWorkout && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Generated Workout:</h3>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <pre className="whitespace-pre-wrap text-sm">{generatedWorkout}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current status of AI integration components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>OpenRouter Service:</strong> {openRouterService ? 'Initialized' : 'Not configured'}
              </AlertDescription>
            </Alert>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Workout Service:</strong> {workoutService ? 'Ready' : 'Not available'}
              </AlertDescription>
            </Alert>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>API Key:</strong> {openRouterService?.getMaskedApiKey() || 'Not configured'}
              </AlertDescription>
            </Alert>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Selected Model:</strong> {selectedModel}
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITestPage;
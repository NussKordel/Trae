import React, { useState, useEffect } from 'react';
import { Settings, Zap, AlertCircle, CheckCircle, Info, Cpu, Database } from 'lucide-react';
import { AIModelType } from '@/types/ai';
import { APIKeyManager } from './APIKeyManager';
import { AIModelSelector } from '@/components/ui/AIModelSelector';
import { OpenRouterService } from '@/services/openrouter';
import { cn } from '@/lib/utils';

interface AISettingsProps {
  className?: string;
}

export function AISettings({ className }: AISettingsProps) {
  const [selectedModel, setSelectedModel] = useState<AIModelType>(AIModelType.SCHNELL);
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<{
    apiConnection: boolean;
    modelsAvailable: boolean;
    lastChecked: Date | null;
  }>({ apiConnection: false, modelsAvailable: false, lastChecked: null });

  // Load saved settings on mount
  useEffect(() => {
    const savedModel = localStorage.getItem('ai_selected_model') as AIModelType;
    if (savedModel && Object.values(AIModelType).includes(savedModel)) {
      setSelectedModel(savedModel);
    }

    // Check if API key exists and validate system status
    const apiKey = localStorage.getItem('openrouter_api_key');
    if (apiKey) {
      checkSystemStatus(apiKey);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkSystemStatus = async (apiKey: string) => {
    try {
      const openRouterService = new OpenRouterService(apiKey);
      const isConnected = await openRouterService.testConnection();
      
      setSystemStatus({
        apiConnection: isConnected,
        modelsAvailable: isConnected, // If connected, models should be available
        lastChecked: new Date()
      });
      setIsApiKeyValid(isConnected);
    } catch (error) {
      console.error('System status check failed:', error);
      setSystemStatus({
        apiConnection: false,
        modelsAvailable: false,
        lastChecked: new Date()
      });
      setIsApiKeyValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (model: AIModelType) => {
    setSelectedModel(model);
    localStorage.setItem('ai_selected_model', model);
  };

  const handleApiKeyValidated = (isValid: boolean) => {
    setIsApiKeyValid(isValid);
    if (isValid) {
      const apiKey = localStorage.getItem('openrouter_api_key');
      if (apiKey) {
        checkSystemStatus(apiKey);
      }
    } else {
      setSystemStatus({
        apiConnection: false,
        modelsAvailable: false,
        lastChecked: new Date()
      });
    }
  };

  const refreshSystemStatus = () => {
    const apiKey = localStorage.getItem('openrouter_api_key');
    if (apiKey) {
      setIsLoading(true);
      checkSystemStatus(apiKey);
    }
  };

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Lade AI-Einstellungen...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Settings className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              AI-Einstellungen
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Konfiguriere deine AI-Modelle und API-Verbindung
            </p>
          </div>
        </div>
        
        {/* System Status Indicator */}
        <div className="flex items-center space-x-2">
          {systemStatus.apiConnection ? (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">System bereit</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Konfiguration erforderlich</span>
            </div>
          )}
        </div>
      </div>

      {/* System Status Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Cpu className="h-5 w-5 mr-2" />
            System-Status
          </h3>
          <button
            onClick={refreshSystemStatus}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Aktualisieren
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center">
              <Database className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                API-Verbindung
              </span>
            </div>
            <div className="flex items-center">
              {systemStatus.apiConnection ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={cn(
                'ml-2 text-sm font-medium',
                systemStatus.apiConnection ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {systemStatus.apiConnection ? 'Verbunden' : 'Getrennt'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI-Modelle
              </span>
            </div>
            <div className="flex items-center">
              {systemStatus.modelsAvailable ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={cn(
                'ml-2 text-sm font-medium',
                systemStatus.modelsAvailable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {systemStatus.modelsAvailable ? 'Verfügbar' : 'Nicht verfügbar'}
              </span>
            </div>
          </div>
        </div>
        
        {systemStatus.lastChecked && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
            Zuletzt geprüft: {systemStatus.lastChecked.toLocaleString('de-DE')}
          </p>
        )}
      </div>

      {/* API Key Management */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        <APIKeyManager onKeyValidated={handleApiKeyValidated} />
      </div>

      {/* AI Model Selection */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        <AIModelSelector
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          disabled={!isApiKeyValid}
          showDetails={true}
        />
        
        {!isApiKeyValid && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                  API-Schlüssel erforderlich
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Bitte gib einen gültigen OpenRouter API-Schlüssel ein, um AI-Modelle auswählen zu können.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Settings */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Erweiterte Einstellungen
        </h3>
        
        <div className="space-y-4">
          {/* Request Timeout */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Request-Timeout
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Maximale Wartezeit für API-Anfragen
              </p>
            </div>
            <select 
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              defaultValue="60"
            >
              <option value="30">30 Sekunden</option>
              <option value="60">60 Sekunden</option>
              <option value="120">120 Sekunden</option>
            </select>
          </div>
          
          {/* Retry Attempts */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Wiederholungsversuche
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Anzahl der Versuche bei fehlgeschlagenen Anfragen
              </p>
            </div>
            <select 
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              defaultValue="3"
            >
              <option value="1">1 Versuch</option>
              <option value="2">2 Versuche</option>
              <option value="3">3 Versuche</option>
              <option value="5">5 Versuche</option>
            </select>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          Hilfe & Tipps
        </h3>
        
        <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
          <div>
            <p className="font-medium mb-1">🚀 Schnell-Modus</p>
            <p>Ideal für schnelle, effiziente Workouts. Nutzt bewährte Übungen und Strukturen.</p>
          </div>
          
          <div>
            <p className="font-medium mb-1">🎯 Präzise-Modus</p>
            <p>Wissenschaftlich fundierte Workouts mit detaillierten Anweisungen und Sicherheitsfokus.</p>
          </div>
          
          <div>
            <p className="font-medium mb-1">✨ Kreativ-Modus</p>
            <p>Innovative und motivierende Workouts mit einzigartigen Übungen und Themen.</p>
          </div>
          
          <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
            <p className="font-medium mb-1">💡 Tipp</p>
            <p>Du kannst den AI-Modus jederzeit in den Workout-Einstellungen ändern.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AISettings;
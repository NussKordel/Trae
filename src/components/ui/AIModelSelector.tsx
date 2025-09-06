import React, { useState } from 'react';
import { Zap, Target, Sparkles, Info, Clock, Brain, Palette } from 'lucide-react';
import { AIModelType, AI_MODELS } from '@/types/ai';
import { cn } from '@/lib/utils';

interface AIModelSelectorProps {
  selectedModel: AIModelType;
  onModelChange: (model: AIModelType) => void;
  disabled?: boolean;
  showDetails?: boolean;
  className?: string;
}

const MODEL_CONFIGS = {
  [AIModelType.SCHNELL]: {
    icon: Zap,
    title: 'Schnell',
    subtitle: 'Schnelle Workouts',
    description: 'Effiziente, bewährte Übungen für schnelle Ergebnisse',
    features: ['⚡ Blitzschnelle Generierung', '🎯 Fokus auf Effizienz', '⏱️ 20-45 Min Workouts'],
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-300',
    time: '~30 Sek',
    complexity: 'Einfach'
  },
  [AIModelType.PRAEZISE]: {
    icon: Target,
    title: 'Präzise',
    subtitle: 'Detaillierte Planung',
    description: 'Wissenschaftlich fundierte, präzise Workout-Erstellung',
    features: ['🔬 Wissenschaftlich fundiert', '📋 Detaillierte Anweisungen', '🛡️ Sicherheitsfokus'],
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
    time: '~60 Sek',
    complexity: 'Mittel'
  },
  [AIModelType.KREATIV]: {
    icon: Sparkles,
    title: 'Kreativ',
    subtitle: 'Innovative Workouts',
    description: 'Kreative, motivierende und einzigartige Workout-Erlebnisse',
    features: ['🎨 Innovative Übungen', '🎭 Motivierende Elemente', '🎪 Thematische Workouts'],
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
    time: '~90 Sek',
    complexity: 'Komplex'
  },
  [AIModelType.CUSTOM]: {
    icon: Palette,
    title: 'Benutzerdefiniert',
    subtitle: 'Wissenschaftlich fundiert',
    description: 'DeepSeek AI für wissenschaftlich fundierte, kostenlose Workouts',
    features: ['🧬 Wissenschaftlich fundiert', '💰 Kostenlos', '⚙️ Anpassbar'],
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-300',
    time: '~45 Sek',
    complexity: 'Wissenschaftlich'
  }
};

export function AIModelSelector({
  selectedModel,
  onModelChange,
  disabled = false,
  showDetails = true,
  className
}: AIModelSelectorProps) {
  const [hoveredModel, setHoveredModel] = useState<AIModelType | null>(null);

  return (
    <div className={cn('space-y-4', className)}>
      {showDetails && (
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <Brain className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI-Modus wählen
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Wähle den AI-Modus, der am besten zu deinen Bedürfnissen passt
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(MODEL_CONFIGS).map(([modelType, config]) => {
          const IconComponent = config.icon;
          const isSelected = selectedModel === modelType;
          const isHovered = hoveredModel === modelType;
          const models = AI_MODELS[modelType as AIModelType];
          const primaryModel = models?.[0];

          return (
            <button
              key={modelType}
              onClick={() => !disabled && onModelChange(modelType as AIModelType)}
              onMouseEnter={() => setHoveredModel(modelType as AIModelType)}
              onMouseLeave={() => setHoveredModel(null)}
              disabled={disabled}
              className={cn(
                'group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left',
                'hover:shadow-lg hover:scale-105 transform',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                isSelected
                  ? `${config.borderColor} ${config.bgColor} shadow-md`
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600',
                disabled && 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none'
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center',
                    `bg-gradient-to-r ${config.color}`
                  )}>
                    <Target className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300',
                `bg-gradient-to-r ${config.color}`,
                'group-hover:scale-110 shadow-lg'
              )}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>

              {/* Title and subtitle */}
              <div className="mb-3">
                <h4 className={cn(
                  'text-xl font-bold mb-1 transition-colors',
                  isSelected ? config.textColor : 'text-gray-900 dark:text-gray-100'
                )}>
                  {config.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {config.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                {config.description}
              </p>

              {/* Features */}
              {showDetails && (
                <div className="space-y-2 mb-4">
                  {config.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                      <span className="mr-2">{feature.split(' ')[0]}</span>
                      <span>{feature.split(' ').slice(1).join(' ')}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Model info */}
              {showDetails && primaryModel && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{config.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      <span>{config.complexity}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {primaryModel.provider} • {primaryModel.name}
                  </div>
                </div>
              )}

              {/* Hover effect */}
              <div className={cn(
                'absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none',
                `bg-gradient-to-r ${config.color} opacity-0`,
                isHovered && !isSelected && 'opacity-5'
              )} />
            </button>
          );
        })}
      </div>

      {/* Selected model details */}
      {showDetails && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <Palette className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ausgewählter Modus: {MODEL_CONFIGS[selectedModel].title}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {MODEL_CONFIGS[selectedModel].description}
          </p>
          
          {AI_MODELS[selectedModel] && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              Verfügbare Modelle: {AI_MODELS[selectedModel].length} • 
              Primär: {AI_MODELS[selectedModel][0]?.name}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Compact version for smaller spaces
export function AIModelSelectorCompact({
  selectedModel,
  onModelChange,
  disabled = false,
  className
}: Omit<AIModelSelectorProps, 'showDetails'>) {
  return (
    <div className={cn('flex space-x-2', className)}>
      {Object.entries(MODEL_CONFIGS).map(([modelType, config]) => {
        const IconComponent = config.icon;
        const isSelected = selectedModel === modelType;

        return (
          <button
            key={modelType}
            onClick={() => !disabled && onModelChange(modelType as AIModelType)}
            disabled={disabled}
            className={cn(
              'group relative p-3 rounded-xl border-2 transition-all duration-200',
              'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500',
              isSelected
                ? `${config.borderColor} ${config.bgColor}`
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            title={`${config.title}: ${config.description}`}
          >
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
              `bg-gradient-to-r ${config.color}`,
              'group-hover:scale-110'
            )}>
              <IconComponent className="h-4 w-4 text-white" />
            </div>
            <div className="mt-1 text-xs font-medium text-center text-gray-700 dark:text-gray-300">
              {config.title}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default AIModelSelector;
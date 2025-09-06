import { getOpenRouterService } from '../openrouter';
import {
  WorkoutGenerationRequest,
  WorkoutGenerationResponse,
  EnhancedWorkoutResponse,
  AIModelType,
  AIRequestOptions,
  AIError,
  OpenRouterRequest,
  AI_MODELS,
  DEFAULT_MODELS
} from '@/types/ai';
import { UserProfile } from '@/types/user';
import {
  SessionParameters,
  WorkoutBlock,
  WorkoutExercise,
  WorkoutMode,
  BlockType,
  RPEScale,
  RIRScale,
  MuscleGroup,
  Equipment
} from '@/types/fitness';

class WorkoutGeneratorService {
  private openRouterService = getOpenRouterService();

  private buildSystemPrompt(modelType: AIModelType, mode: WorkoutMode): string {
    const basePrompt = `You are an expert fitness trainer and workout designer specializing in evidence-based, personalized workout programming. Your task is to create safe, effective, and engaging workout routines.

CORE PRINCIPLES:
- Prioritize safety and proper movement patterns
- Apply progressive overload principles
- Consider individual limitations and pain points
- Integrate RPE (Rate of Perceived Exertion) and RIR (Reps in Reserve) guidance
- Provide clear exercise progressions and regressions
- Include comprehensive safety analysis

RPE/RIR GUIDELINES:
- RPE Scale: 1-10 (1=very easy, 10=maximum effort)
- RIR Scale: 0-5+ (0=failure, 1=1 rep left, 2=2 reps left, etc.)
- Beginner: Target RPE 5-7, RIR 2-4
- Intermediate: Target RPE 6-8, RIR 1-3
- Advanced: Target RPE 7-9, RIR 0-2
- Always provide specific RPE/RIR targets for each exercise
- Include progression notes based on RPE feedback

WORKOUT MODES:
1. EMOM+AMRAP: 12-18 min EMOM block + 8-12 min AMRAP block
2. Classic Sets×Reps: 4-6 exercises, 3-5 sets, rep ranges based on goals
3. Circuit: Continuous movement patterns
4. Tabata: High-intensity intervals
5. Pyramid: Progressive loading patterns

SAFETY ANALYSIS REQUIREMENTS:
- Assess overall workout risk level (low/medium/high)
- Identify contraindications for each exercise
- Provide modifications for different ability levels
- Include specific warnings for high-risk movements
- Consider user's pain points and restrictions
- Ensure JSON schema compliance for all safety fields

RESPONSE FORMAT:
You must respond with a valid JSON object matching this EXACT structure:
{
  "workout": {
    "id": "unique-workout-id",
    "title": "Workout Name",
    "description": "Brief description",
    "totalDuration": 45,
    "difficulty": "medium",
    "mode": "${mode}",
    "warmup": {
      "id": "warmup-block",
      "type": "warmup",
      "name": "Dynamic Warm-up",
      "duration": 5,
      "exercises": [
        {
          "name": "Exercise Name",
          "description": "Purpose and benefits",
          "duration": 30,
          "restTime": 0,
          "difficulty": "easy",
          "equipment": ["bodyweight"],
          "muscleGroups": ["full_body"],
          "instructions": ["Step 1", "Step 2"],
          "modifications": ["Easier option"],
          "safetyNotes": ["Important safety note"]
        }
      ]
    },
    "blocks": [
      {
        "id": "main-block-1",
        "type": "strength",
        "name": "Block Name",
        "description": "Block purpose",
        "duration": 20,
        "exercises": [
          {
            "name": "Exercise Name",
            "description": "What this exercise does",
            "sets": 3,
            "reps": 12,
            "restTime": 60,
            "difficulty": "medium",
            "equipment": ["bodyweight"],
            "muscleGroups": ["chest", "triceps"],
            "instructions": ["Step 1", "Step 2", "Step 3"],
            "modifications": ["Easier: ...", "Harder: ..."],
            "targetRPE": 7,
            "targetRIR": 2,
            "safetyNotes": ["Form cue"],
            "contraindications": ["Avoid if..."]
          }
        ],
        "rounds": 3,
        "restBetweenExercises": 60
      }
    ],
    "cooldown": {
      "id": "cooldown-block",
      "type": "cooldown",
      "name": "Recovery & Mobility",
      "duration": 5,
      "exercises": [
        {
          "name": "Stretch Name",
          "description": "Targets specific muscles",
          "duration": 30,
          "restTime": 0,
          "difficulty": "easy",
          "equipment": ["bodyweight"],
          "muscleGroups": ["chest"],
          "instructions": ["Hold position"],
          "modifications": ["Use wall for support"]
        }
      ]
    },
    "tips": ["Performance tip 1", "Recovery tip 2"],
    "safetyNotes": ["General safety guideline"],
    "warnings": ["Important warning if applicable"]
  },
  "personalizedMessage": "Motivational message tailored to user",
  "modelUsed": "model-name",
  "rpeGuidance": {
    "targetIntensity": 7,
    "rpeScale": {
      "1": "Very easy - minimal effort",
      "2": "Easy - light effort",
      "3": "Moderate - noticeable effort",
      "4": "Somewhat hard - getting challenging",
      "5": "Hard - significant effort required",
      "6": "Harder - could do 4+ more reps",
      "7": "Very hard - could do 2-3 more reps",
      "8": "Extremely hard - could do 1-2 more reps",
      "9": "Near maximum - could do 1 more rep",
      "10": "Maximum effort - no more reps possible"
    },
    "adjustmentTips": [
      "Start conservatively and adjust based on how you feel",
      "If RPE is too low, increase weight/reps next set",
      "If RPE is too high, reduce weight/reps immediately",
      "Listen to your body and prioritize form over intensity"
    ],
    "progressionNotes": [
      "Week 1-2: Focus on form and movement patterns",
      "Week 3-4: Gradually increase intensity based on RPE feedback",
      "Week 5+: Progressive overload while maintaining target RPE ranges"
    ],
    "recoveryRecommendations": [
      "Take 48-72 hours rest between intense sessions",
      "Include active recovery on off days",
      "Monitor sleep and stress levels for optimal recovery"
    ]
  },
  "safetyAnalysis": {
    "riskLevel": "low",
    "contraindications": [
      "Avoid if experiencing acute pain in target areas",
      "Skip exercises that cause joint discomfort"
    ],
    "modifications": [
      "Reduce range of motion if flexibility is limited",
      "Use assistance or reduce load for proper form",
      "Substitute exercises based on equipment availability"
    ],
    "warnings": [
      "Stop immediately if sharp pain occurs",
      "Maintain proper breathing throughout exercises",
      "Ensure adequate warm-up before intense efforts"
    ],
    "emergencyGuidelines": [
      "Stop exercise if experiencing chest pain, dizziness, or severe shortness of breath",
      "Seek medical attention for any concerning symptoms"
    ]
  }
}`;

    const modeSpecificGuidance = this.getModeSpecificGuidance(mode);
    
    switch (modelType) {
      case AIModelType.SCHNELL:
        return basePrompt + modeSpecificGuidance + `\n\nAI PERSONALITY: SCHNELL (Fast & Efficient)
- Create time-efficient, proven workout structures
- Focus on compound movements and functional patterns
- Keep instructions clear and actionable
- Optimize for maximum results in minimum time
- Use straightforward exercise progressions`;
      
      case AIModelType.PRAEZISE:
        return basePrompt + modeSpecificGuidance + `\n\nAI PERSONALITY: PRÄZISE (Precise & Scientific)
- Apply exercise science principles and biomechanics
- Include detailed form cues and movement analysis
- Provide comprehensive safety assessments
- Explain physiological adaptations and training rationale
- Use precise RPE/RIR targeting for optimal load management
- Include detailed progression and regression pathways`;
      
      case AIModelType.KREATIV:
        return basePrompt + modeSpecificGuidance + `\n\nAI PERSONALITY: KREATIV (Creative & Engaging)
- Design innovative and enjoyable workout experiences
- Include creative exercise variations and flow patterns
- Add motivational elements and achievement milestones
- Incorporate themed workouts and storytelling elements
- Use gamification principles to enhance engagement
- Adapt communication style to user's humor preferences`;
      
      default:
        return basePrompt + modeSpecificGuidance;
    }
  }

  private getModeSpecificGuidance(mode: WorkoutMode): string {
    switch (mode) {
      case 'combined':
        return `\n\nWORKOUT MODE: EMOM + AMRAP
Structure:
1. EMOM Block (12-18 minutes): Every Minute on the Minute exercises
   - Choose 2-3 exercises that can be completed in 40-50 seconds
   - Focus on compound movements for maximum efficiency
   - Target RPE 6-7 to maintain consistency across all rounds
   - Progression: Increase reps per minute or exercise complexity
2. AMRAP Block (8-12 minutes): As Many Rounds As Possible
   - 3-5 exercises in a circuit format
   - Aim for sustainable pace, target RPE 7-8
   - Track total rounds completed for progression
   - Focus on metabolic conditioning and work capacity
- Block Structure: { "blocks": [{ "type": "emom", "duration": 15 }, { "type": "amrap", "duration": 10 }] }`;
      
      case 'classic':
        return `\n\nWORKOUT MODE: Classic Sets × Reps
Structure:
- 4-6 primary exercises focusing on major movement patterns
- 3-5 sets per exercise based on training goal
- Rep ranges and RPE targets:
  * Strength: 3-6 reps at RPE 8-9 (RIR 1-2)
  * Hypertrophy: 8-12 reps at RPE 7-8 (RIR 2-3)
  * Endurance: 15+ reps at RPE 6-7 (RIR 3-4)
- Rest periods: Strength (2-3 min), Hypertrophy (60-90s), Endurance (30-60s)
- Progression: Increase weight when RPE drops below target range
- Block Structure: { "blocks": [{ "type": "strength", "exercises": [{ "sets": 4, "reps": "8-12", "targetRPE": 7 }] }] }`;
      
      case 'emom':
        return `\n\nWORKOUT MODE: EMOM Training
- 6-10 exercises performed in sequence
- Work time: 30-60 seconds per exercise
- Rest: 10-15 seconds between exercises, 2-3 minutes between rounds
- 3-5 total rounds depending on fitness level
- Target RPE 6-8, focus on movement quality over speed
- Mix of strength and cardio movements for metabolic conditioning
- Progression: Increase work time, decrease rest, or add rounds
- Block Structure: { "blocks": [{ "type": "circuit", "rounds": 4, "workTime": 45, "restTime": 15 }] }`;
      
      case 'amrap':
        return `\n\nWORKOUT MODE: AMRAP Protocol
- 20 seconds maximum effort, 10 seconds complete rest
- 8 rounds total (4 minutes per Tabata block)
- Target RPE 9-10 during work intervals
- Can chain 2-4 Tabata blocks with 2-3 minutes rest between
- Best for single, explosive movements (burpees, mountain climbers, etc.)
- Progression: Increase total rounds completed or add movement complexity
- Block Structure: { "blocks": [{ "type": "tabata", "workTime": 20, "restTime": 10, "rounds": 8 }] }`;
      
      default:
        return `\n\nWORKOUT MODE: Standard Training
- Follow basic workout structure with appropriate rest periods
- Focus on proper form and progressive overload
- Adjust intensity based on experience level
- Target RPE increases with weight: 6→7→8→9→8→7→6
- Progression: Increase starting weight or add pyramid levels
- Block Structure: { "blocks": [{ "type": "pyramid", "pattern": "diamond", "repScheme": [12,10,8,6,8,10,12] }] }`;
    }
  }

  private buildUserPrompt(request: WorkoutGenerationRequest): string {
    const { userProfile, sessionParameters, workoutType, focus, additionalInstructions } = request;
    
    // Ensure required data exists
    if (!userProfile) {
      throw new Error('User profile is required for workout generation');
    }
    if (!sessionParameters) {
      throw new Error('Session parameters are required for workout generation');
    }
    
    let prompt = `Create a personalized workout for:\n\n`;
    
    // User Profile
    prompt += `USER PROFILE:\n`;
    prompt += `- Name: ${userProfile.name || 'User'}\n`;
    prompt += `- Age: ${userProfile.age || 25}\n`;
    prompt += `- Fitness Level: ${userProfile.fitnessLevel || 'beginner'}\n`;
    prompt += `- Primary Goal: ${userProfile.fitnessGoal || 'general_fitness'}\n`;
    prompt += `- Workout Frequency: ${userProfile.workoutFrequency || 'twice_week'}\n`;
    
    // Equipment
    const equipment = sessionParameters.equipment || this.getEquipmentFromCategory(userProfile.availableEquipment) || [];
    if (equipment.length > 0) {
      prompt += `- Available Equipment: ${equipment.join(', ')}\n`;
    } else {
      prompt += `- Available Equipment: Bodyweight only\n`;
    }
    
    // Session Parameters
    prompt += `\nSESSION PARAMETERS:\n`;
    prompt += `- Duration: ${sessionParameters.duration} minutes\n`;
    prompt += `- Goal: ${sessionParameters.goal}\n`;
    prompt += `- Mode: ${sessionParameters.mode}\n`;
    prompt += `- Target Muscle Groups: ${sessionParameters.targetMuscleGroups.join(', ')}\n`;
    
    if (sessionParameters.intensity) {
      prompt += `- Target Intensity (RPE): ${sessionParameters.intensity}/10\n`;
    }
    
    // Safety Analysis
    prompt += `\nSAFETY CONSIDERATIONS:\n`;
    
    // Pain level assessment
    if (sessionParameters.painLevel !== undefined) {
      prompt += `- Current Pain Level: ${sessionParameters.painLevel}/10\n`;
      if (sessionParameters.painLevel >= 3) {
        prompt += `- ⚠️ ELEVATED PAIN DETECTED: Modify intensity and avoid aggravating movements\n`;
      }
      if (sessionParameters.painLevel >= 6) {
        prompt += `- 🚨 HIGH PAIN LEVEL: Focus on gentle mobility and recovery exercises only\n`;
      }
    }
    
    // Pain points from profile
    if (userProfile.painAreas && userProfile.painAreas.length > 0) {
      prompt += `- Chronic Pain Areas: ${userProfile.painAreas.join(', ')}\n`;
    }
    
    // No-Go exercises
    const noGoExercises = [
      ...(sessionParameters.noGoExercises || []),
      ...(userProfile.noGoExercises || [])
    ];
    if (noGoExercises.length > 0) {
      prompt += `- STRICTLY AVOID: ${noGoExercises.join(', ')}\n`;
    }
    
    // Advanced Personalization Analysis
    prompt += `\nADVANCED PERSONALIZATION:\n`;
    
    // Fitness level adaptations
    const fitnessAdaptations = this.getFitnessLevelAdaptations(userProfile.fitnessLevel);
    prompt += `- Fitness Level Adaptations: ${fitnessAdaptations}\n`;
    
    // Goal-specific customizations
    const goalCustomizations = this.getGoalSpecificCustomizations(userProfile.fitnessGoal, sessionParameters.goal);
    prompt += `- Goal-Specific Focus: ${goalCustomizations}\n`;
    
    // Equipment optimization
    const equipmentStrategy = this.getEquipmentOptimization(equipment);
    prompt += `- Equipment Strategy: ${equipmentStrategy}\n`;
    
    // Frequency-based adjustments
    const frequencyAdjustments = this.getFrequencyAdjustments(userProfile.workoutFrequency);
    prompt += `- Frequency Adjustments: ${frequencyAdjustments}\n`;
    
    // Personal preferences
    if (userProfile.humorLevel) {
      prompt += `- Humor Level: ${userProfile.humorLevel}\n`;
    }
    
    if (userProfile.workoutMode) {
      prompt += `- Coaching Style: ${userProfile.workoutMode}\n`;
    }
    
    // Adaptive recommendations
    const adaptiveRecommendations = this.getAdaptiveRecommendations(userProfile, sessionParameters);
    if (adaptiveRecommendations.length > 0) {
      prompt += `- Adaptive Recommendations: ${adaptiveRecommendations.join(', ')}\n`;
    }
    
    // Additional context
    if (workoutType) {
      prompt += `\nWORKOUT TYPE: ${workoutType}\n`;
    }
    
    if (focus) {
      prompt += `FOCUS AREA: ${focus}\n`;
    }
    
    if (additionalInstructions) {
      prompt += `\nADDITIONAL INSTRUCTIONS: ${additionalInstructions}\n`;
    }
    
    // Safety warnings
    prompt += `\n🔒 SAFETY REQUIREMENTS:\n`;
    prompt += `- Perform comprehensive safety analysis\n`;
    prompt += `- Include contraindications for each exercise\n`;
    prompt += `- Provide modifications for different ability levels\n`;
    prompt += `- Flag any high-risk movements\n`;
    prompt += `- Consider user's pain points and restrictions\n`;
    
    prompt += `\nPlease create a complete workout routine following the specified JSON structure. Prioritize safety above all else.`;
    
    return prompt;
  }

  // Safety check method
  private performSafetyChecks(sessionParameters: SessionParameters, userProfile: UserProfile): string[] {
    const warnings: string[] = [];
    
    // Pain level warnings
    if (sessionParameters.painLevel && sessionParameters.painLevel >= 6) {
      warnings.push('HIGH PAIN LEVEL: Consider postponing intense exercise and focusing on gentle mobility');
    } else if (sessionParameters.painLevel && sessionParameters.painLevel >= 3) {
      warnings.push('MODERATE PAIN: Reduce intensity and avoid movements that aggravate symptoms');
    }
    
    // Age-related considerations
    if (userProfile.age && userProfile.age >= 65) {
      warnings.push('SENIOR CONSIDERATIONS: Emphasize balance, fall prevention, and joint-friendly movements');
    }
    
    // Beginner safety
    if (userProfile.fitnessLevel === 'beginner' && sessionParameters.intensity && sessionParameters.intensity >= 8) {
      warnings.push('BEGINNER + HIGH INTENSITY: Consider reducing target RPE to build proper movement patterns');
    }
    
    // Equipment safety
    const hasWeights = sessionParameters.equipment?.some(eq => 
      ['dumbbells', 'barbell', 'kettlebell'].includes(eq)
    );
    if (hasWeights && userProfile.fitnessLevel === 'beginner') {
      warnings.push('BEGINNER + WEIGHTS: Emphasize proper form over load progression');
    }
    
    return warnings;
  }

  // Equipment Helper Method
  private getEquipmentFromCategory(category: string): Equipment[] {
    switch (category) {
      case 'none':
        return [];
      case 'basic':
        return ['dumbbells', 'resistance_bands', 'yoga_mat'];
      case 'home_gym':
        return ['dumbbells', 'barbell', 'resistance_bands', 'pull_up_bar', 'bench', 'yoga_mat'];
      case 'full_gym':
        return ['dumbbells', 'barbell', 'kettlebell', 'resistance_bands', 'pull_up_bar', 'bench', 'yoga_mat', 'stability_ball', 'treadmill', 'stationary_bike', 'rowing_machine'];
      default:
        return [];
    }
  }

  // Advanced Personalization Helper Methods
  private getFitnessLevelAdaptations(fitnessLevel: string): string {
    switch (fitnessLevel) {
      case 'beginner':
        return 'Focus on movement quality, basic patterns, bodyweight progressions, longer rest periods';
      case 'intermediate':
        return 'Moderate complexity, compound movements, progressive overload, balanced intensity';
      case 'advanced':
        return 'Complex movements, advanced techniques, higher intensity, shorter rest periods';
      default:
        return 'Moderate approach with scalable options';
    }
  }

  private getGoalSpecificCustomizations(primaryGoal: string, sessionGoal: string): string {
    const goals = [primaryGoal, sessionGoal].filter(Boolean);
    const customizations: string[] = [];

    goals.forEach(goal => {
      switch (goal) {
        case 'strength':
          customizations.push('Heavy compound movements, lower reps, longer rest');
          break;
        case 'muscle_gain':
        case 'hypertrophy':
          customizations.push('Moderate weights, 8-12 rep range, muscle isolation');
          break;
        case 'weight_loss':
        case 'fat_loss':
          customizations.push('Higher intensity, circuit training, metabolic focus');
          break;
        case 'endurance':
          customizations.push('Higher reps, shorter rest, cardiovascular integration');
          break;
        case 'flexibility':
          customizations.push('Dynamic stretching, mobility work, range of motion focus');
          break;
        case 'general_fitness':
          customizations.push('Balanced approach, functional movements, varied intensity');
          break;
      }
    });

    return customizations.join('; ') || 'Balanced fitness approach';
  }

  private getEquipmentOptimization(equipment: string[]): string {
    if (!equipment || equipment.length === 0) {
      return 'Bodyweight-only exercises with creative progressions and variations';
    }

    const strategies: string[] = [];

    if (equipment.includes('dumbbells')) {
      strategies.push('Unilateral training, functional patterns');
    }
    if (equipment.includes('barbell')) {
      strategies.push('Heavy compound lifts, bilateral strength');
    }
    if (equipment.includes('resistance_bands')) {
      strategies.push('Variable resistance, joint-friendly options');
    }
    if (equipment.includes('kettlebell')) {
      strategies.push('Ballistic movements, functional strength');
    }
    if (equipment.includes('pull_up_bar')) {
      strategies.push('Upper body pulling, bodyweight progressions');
    }

    return strategies.length > 0 
      ? strategies.join('; ')
      : 'Optimize available equipment for maximum effectiveness';
  }

  private getFrequencyAdjustments(frequency: string): string {
    switch (frequency) {
      case 'once_week':
        return 'Full-body focus, higher volume per session, longer recovery';
      case 'twice_week':
        return 'Upper/lower split or full-body, moderate volume';
      case 'three_times_week':
        return 'Push/pull/legs or full-body, balanced programming';
      case 'four_times_week':
        return 'Upper/lower split, higher frequency, moderate volume per session';
      case 'five_plus_week':
        return 'Body part splits, higher frequency, lower volume per session';
      default:
        return 'Flexible programming based on recovery capacity';
    }
  }

  private getAdaptiveRecommendations(userProfile: UserProfile, sessionParameters: SessionParameters): string[] {
    const recommendations: string[] = [];

    // Age-based recommendations
    if (userProfile.age && userProfile.age >= 50) {
      recommendations.push('Include mobility work and joint-friendly exercises');
    }
    if (userProfile.age && userProfile.age >= 65) {
      recommendations.push('Emphasize balance and fall prevention exercises');
    }

    // Pain-based adaptations
    if (userProfile.painAreas && userProfile.painAreas.length > 0) {
      recommendations.push('Include corrective exercises and avoid aggravating movements');
    }

    // Intensity adaptations
    if (sessionParameters.painLevel && sessionParameters.painLevel >= 3) {
      recommendations.push('Reduce intensity and focus on gentle movement');
    }

    // Equipment limitations
    if (!sessionParameters.equipment || sessionParameters.equipment.length === 0) {
      recommendations.push('Emphasize bodyweight progressions and isometric holds');
    }

    // Goal alignment
    if (userProfile.fitnessGoal !== sessionParameters.goal) {
      recommendations.push('Balance long-term goals with immediate session objectives');
    }

    // Frequency considerations
    if (userProfile.workoutFrequency === '1-2') {
      recommendations.push('Maximize session efficiency with compound movements');
    }

    return recommendations;
  }

  private selectModel(modelType: AIModelType): string {
    const models = AI_MODELS[modelType];
    if (!models || models.length === 0) {
      const defaultModel = DEFAULT_MODELS[modelType];
      if (!defaultModel) {
        throw new Error(`No models available for model type: ${modelType}`);
      }
      return defaultModel.id;
    }
    return models[0].id;
  }

  private convertToEnhancedResponse(legacyResponse: WorkoutGenerationResponse, safetyAnalysis: any): EnhancedWorkoutResponse {
    const workout = legacyResponse.workout;
    
    return {
      workout: {
        id: `workout_${Date.now()}`,
        title: workout.title,
        description: workout.description,
        totalDuration: workout.duration,
        difficulty: workout.difficulty,
        mode: 'Classic Sets×Reps',
        warmup: {
           id: 'warmup',
           type: 'warmup',
           name: 'Dynamic Warmup',
           duration: 5,
           exercises: workout.warmup.map((exercise: any, index: number) => ({
             id: `warmup_${index}`,
             name: exercise.name,
             description: exercise.instructions || exercise.description || '',
             sets: 1,
             reps: 10,
             duration: exercise.duration || 30,
             restTime: 30,
             difficulty: 'easy' as const,
             equipment: ['bodyweight'] as Equipment[],
             muscleGroups: ['full_body'] as MuscleGroup[],
             instructions: [exercise.instructions || exercise.description || ''],
             modifications: ['Reduce intensity if needed'],
             rpe: 3 as RPEScale,
             rir: 7 as RIRScale
           })),
           restBetweenExercises: 30
         },
        blocks: [{
          id: 'main_block',
          type: 'strength',
          name: 'Main Workout',
          duration: workout.duration - 10,
          exercises: workout.exercises.map((exercise: any, index: number) => ({
            id: `exercise_${index}`,
            name: exercise.name,
            description: exercise.description,
            sets: exercise.sets || 3,
            reps: exercise.reps || 10,
            duration: exercise.duration,
            restTime: exercise.restTime,
            difficulty: exercise.difficulty,
            equipment: exercise.equipment as Equipment[],
            muscleGroups: exercise.muscleGroups as MuscleGroup[],
            instructions: exercise.instructions || [],
            modifications: exercise.modifications || [],
            rpe: 6 as RPEScale,
            rir: 4 as RIRScale
          })),
          restBetweenExercises: 60
        }],
        cooldown: {
          id: 'cooldown',
          type: 'cooldown',
          name: 'Cool Down & Stretch',
          duration: 5,
          exercises: workout.cooldown.map((exercise: any, index: number) => ({
            id: `cooldown_${index}`,
            name: exercise.name,
            description: exercise.instructions || exercise.description || '',
            sets: 1,
            reps: 1,
            duration: exercise.duration || 30,
            restTime: 0,
            difficulty: 'easy' as const,
            equipment: ['bodyweight'] as Equipment[],
            muscleGroups: ['full_body'] as MuscleGroup[],
            instructions: [exercise.instructions || exercise.description || ''],
            modifications: ['Hold stretch for comfort'],
            rpe: 2 as RPEScale,
            rir: 8 as RIRScale
          })),
          restBetweenExercises: 0
        },
        tips: workout.tips,
        safetyNotes: workout.safetyNotes
      },
      personalizedMessage: legacyResponse.personalizedMessage,
      modelUsed: legacyResponse.modelUsed,
      rpeGuidance: {
        targetIntensity: 6 as RPEScale,
        progressionNotes: ['Start conservatively', 'Focus on form over intensity'],
        recoveryRecommendations: ['Take rest days between sessions', 'Listen to your body']
      },
      safetyAnalysis: {
        riskLevel: safetyAnalysis.riskLevel || 'low',
        contraindications: safetyAnalysis.contraindications || [],
        modifications: safetyAnalysis.modifications || []
      }
    };
  }

  private parseWorkoutResponse(content: string, modelUsed: string): WorkoutGenerationResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      
      let parsed;
      try {
        parsed = JSON.parse(jsonString);
      } catch (jsonError) {
        // Provide more specific JSON parsing error information
        const errorMessage = jsonError instanceof Error ? jsonError.message : 'Unknown JSON error';
        console.error('JSON parsing failed:', errorMessage);
        console.error('Problematic JSON substring:', jsonString.substring(Math.max(0, this.extractPositionFromError(errorMessage) - 50), this.extractPositionFromError(errorMessage) + 50));
        throw new Error(`JSON parsing failed at position ${this.extractPositionFromError(errorMessage)}: ${errorMessage}`);
      }
      
      // Ensure the response has the correct structure
      if (!parsed.workout) {
        throw new Error('Invalid workout response structure');
      }
      
      // Add model information
      parsed.modelUsed = modelUsed;
      
      // Validate required fields
      const workout = parsed.workout;
      if (!workout.title || !workout.exercises || !Array.isArray(workout.exercises)) {
        throw new Error('Missing required workout fields');
      }
      
      // Set defaults for missing fields
      workout.duration = workout.duration || 30;
      workout.difficulty = workout.difficulty || 'medium';
      workout.warmup = workout.warmup || [];
      workout.cooldown = workout.cooldown || [];
      workout.tips = workout.tips || [];
      workout.safetyNotes = workout.safetyNotes || [];
      
      // Validate exercises
      workout.exercises = workout.exercises.map((exercise: any) => ({
        name: exercise.name || 'Unknown Exercise',
        description: exercise.description || '',
        sets: exercise.sets || null,
        reps: exercise.reps || null,
        duration: exercise.duration || null,
        restTime: exercise.restTime || 60,
        difficulty: exercise.difficulty || 'medium',
        equipment: exercise.equipment || ['bodyweight'],
        muscleGroups: exercise.muscleGroups || [],
        instructions: exercise.instructions || [],
        modifications: exercise.modifications || []
      }));
      
      parsed.personalizedMessage = parsed.personalizedMessage || 'Great workout ahead! Let\'s get started!';
      
      return parsed as WorkoutGenerationResponse;
    } catch (error) {
      console.error('Failed to parse workout response:', error);
      console.error('Raw content:', content);
      
      throw new Error(`Failed to parse AI workout response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractAndCleanJson(content: string): string {
    // Remove markdown code blocks if present
    let cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to find JSON object boundaries
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    
    // Remove any text before the first { or after the last }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    
    return cleaned.trim();
  }

  private aggressiveJsonClean(content: string): string {
    // More aggressive cleaning for malformed JSON
    let cleaned = content;
    
    // Remove any non-JSON content at the beginning
    const jsonStart = cleaned.search(/\{/);
    if (jsonStart > 0) {
      cleaned = cleaned.substring(jsonStart);
    }
    
    // Find the last complete JSON object
    let braceCount = 0;
    let lastValidIndex = -1;
    
    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === '{') {
        braceCount++;
      } else if (cleaned[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          lastValidIndex = i;
        }
      }
    }
    
    if (lastValidIndex > -1) {
      cleaned = cleaned.substring(0, lastValidIndex + 1);
    }
    
    // Fix common JSON issues
    cleaned = this.attemptJsonFix(cleaned);
    
    return cleaned;
  }

  private attemptJsonFix(jsonString: string): string {
    // Remove any trailing incomplete content after the last complete brace
    let fixed = jsonString.trim();
    
    // Count braces to find where JSON might be truncated
    let braceCount = 0;
    let lastValidIndex = -1;
    
    for (let i = 0; i < fixed.length; i++) {
      if (fixed[i] === '{') {
        braceCount++;
      } else if (fixed[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          lastValidIndex = i;
        }
      }
    }
    
    // If we found a complete JSON object, truncate there
    if (lastValidIndex > -1) {
      fixed = fixed.substring(0, lastValidIndex + 1);
    } else if (braceCount > 0) {
      // Try to close incomplete JSON by adding missing braces
      const missingBraces = '}' .repeat(braceCount);
      fixed = fixed + missingBraces;
    }
    
    // Remove any trailing commas before closing braces
    fixed = fixed.replace(/,\s*}/g, '}');
    fixed = fixed.replace(/,\s*]/g, ']');
    
    // Fix common array issues
    fixed = fixed.replace(/,\s*,/g, ','); // Remove double commas
    fixed = fixed.replace(/\[\s*,/g, '['); // Remove leading commas in arrays
    fixed = fixed.replace(/,\s*\]/g, ']'); // Remove trailing commas in arrays
    
    // Remove any incomplete string literals at the end
    fixed = fixed.replace(/"[^"]*$/g, '""');
    
    return fixed;
  }

  private extractPositionFromError(errorMessage: string): number {
    // Extract position from JSON error messages like "Expected ',' or ']' after array element in JSON at position 12519"
    const positionMatch = errorMessage.match(/position (\d+)/);
    return positionMatch ? parseInt(positionMatch[1], 10) : 0;
  }

  private parseEnhancedWorkoutResponse(content: string, modelUsed: string): EnhancedWorkoutResponse {
    try {
      // Clean and extract JSON from the response
      let jsonString = this.extractAndCleanJson(content);
      
      // Attempt to fix common JSON issues
      jsonString = this.attemptJsonFix(jsonString);
      
      let parsed;
      try {
        parsed = JSON.parse(jsonString);
      } catch (jsonError) {
        // Provide more specific JSON parsing error information
        const errorMessage = jsonError instanceof Error ? jsonError.message : 'Unknown JSON error';
        const position = this.extractPositionFromError(errorMessage);
        console.error('Enhanced JSON parsing failed:', errorMessage);
        console.error('Error position:', position);
        console.error('JSON around error position:', jsonString.substring(Math.max(0, position - 100), position + 100));
        throw new Error(`Enhanced JSON parsing failed at position ${position}: ${errorMessage}`);
      }
      
      // Ensure the response has the correct structure
      if (!parsed.workout) {
        throw new Error('Invalid enhanced workout response structure');
      }
      
      // Add model information
      parsed.modelUsed = modelUsed;
      
      // Validate required fields
      const workout = parsed.workout;
      if (!workout.title) {
        throw new Error('Missing required workout title');
      }
      
      // Set defaults for missing fields
      workout.duration = workout.duration || 30;
      workout.difficulty = workout.difficulty || 'medium';
      workout.warmup = workout.warmup || { exercises: [] };
      workout.cooldown = workout.cooldown || { exercises: [] };
      workout.blocks = workout.blocks || [];
      workout.tips = workout.tips || [];
      workout.safetyNotes = workout.safetyNotes || [];
      
      // Validate blocks and exercises
      if (workout.blocks && Array.isArray(workout.blocks)) {
        workout.blocks = workout.blocks.map((block: any) => ({
          id: block.id || `block_${Date.now()}_${Math.random()}`,
          type: block.type || 'strength',
          name: block.name || 'Workout Block',
          description: block.description || '',
          duration: block.duration || 15,
          exercises: (block.exercises || []).map((exercise: any) => ({
            name: exercise.name || 'Unknown Exercise',
            description: exercise.description || '',
            sets: exercise.sets || null,
            reps: exercise.reps || null,
            duration: exercise.duration || null,
            restTime: exercise.restTime || 60,
            difficulty: exercise.difficulty || 'medium',
            equipment: exercise.equipment || ['bodyweight'],
            muscleGroups: exercise.muscleGroups || [],
            instructions: exercise.instructions || [],
            modifications: exercise.modifications || [],
            targetRPE: exercise.targetRPE || null,
            targetRIR: exercise.targetRIR || null,
            safetyNotes: exercise.safetyNotes || [],
            contraindications: exercise.contraindications || []
          })),
          rounds: block.rounds || 1,
          restBetweenExercises: block.restBetweenExercises || 60
        }));
      }
      
      // Set defaults for enhanced features
      parsed.rpeGuidance = parsed.rpeGuidance || {
        targetIntensity: 7,
        progressionNotes: ['Start conservatively and adjust based on how you feel'],
        recoveryRecommendations: ['Take adequate rest between sessions']
      };
      
      parsed.safetyAnalysis = parsed.safetyAnalysis || {
        riskLevel: 'low',
        contraindications: [],
        modifications: [],
        warnings: []
      };
      
      parsed.personalizedMessage = parsed.personalizedMessage || 'Great workout ahead! Let\'s get started!';
      
      return parsed as EnhancedWorkoutResponse;
    } catch (error) {
      console.error('Failed to parse enhanced workout response:', error);
      console.error('Raw content length:', content.length);
      console.error('Raw content preview:', content.substring(0, 500) + '...');
      
      // Try one more time with aggressive cleaning
      try {
        const cleanedContent = this.aggressiveJsonClean(content);
        const parsed = JSON.parse(cleanedContent);
        if (parsed.workout) {
          console.log('Successfully recovered with aggressive cleaning');
          return this.parseEnhancedWorkoutResponse(cleanedContent, modelUsed);
        }
      } catch (secondError) {
        console.error('Aggressive cleaning also failed:', secondError);
      }
      
      throw new Error(`Failed to parse AI enhanced workout response: ${error instanceof Error ? error.message : 'Unknown error'}. The AI response may be malformed or truncated.`);
    }
  }



  async generateWorkout(
    request: WorkoutGenerationRequest,
    modelType: AIModelType = AIModelType.PRAEZISE
  ): Promise<EnhancedWorkoutResponse> {
    try {
      // Perform safety checks first
      const safetyWarnings = request.sessionParameters ? 
        this.performSafetyChecks(request.sessionParameters, request.userProfile) : [];
      
      // Build prompts with workout mode
      const workoutMode = request.sessionParameters?.mode || 'classic';
      const systemPrompt = this.buildSystemPrompt(modelType, workoutMode);
      const userPrompt = this.buildUserPrompt(request);
      
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: userPrompt }
      ];
      
      const options: AIRequestOptions = {
        modelType,
        temperature: modelType === AIModelType.KREATIV ? 0.8 : 0.7,
        maxTokens: 3000
      };
      
      // Create proper OpenRouterRequest
      const openRouterRequest: OpenRouterRequest = {
        model: this.selectModel(modelType),
        messages,
        max_tokens: options.maxTokens,
        temperature: options.temperature
      };
      
      const response = await this.openRouterService.generateResponse(openRouterRequest, options);
      
      // Use enhanced parsing for the new workout structure
      const parsedResponse = this.parseEnhancedWorkoutResponse(response?.choices?.[0]?.message?.content || '', response?.model || 'unknown');
      
      // Add safety analysis to the parsed response
      parsedResponse.safetyAnalysis = {
        riskLevel: safetyWarnings.length > 2 ? 'high' : safetyWarnings.length > 0 ? 'medium' : 'low' as const,
        contraindications: safetyWarnings,
        modifications: ['Adjust intensity based on comfort level']
      };
      
      // Add safety warnings to the workout
      if (safetyWarnings.length > 0) {
        parsedResponse.workout.warnings = [...(parsedResponse.workout.warnings || []), ...safetyWarnings];
      }
      
      return parsedResponse;
    } catch (error) {
      console.error('Workout generation failed:', error);
      
      // If it's an AI error, re-throw it
      if (error && typeof error === 'object' && 'type' in error) {
        throw error as AIError;
      }
      
      // Re-throw the error for proper error handling
      throw error;
    }
  }

  async generateQuickWorkout(
    userProfile: UserProfile,
    focus?: string
  ): Promise<EnhancedWorkoutResponse> {
    const request: WorkoutGenerationRequest = {
      userProfile,
      sessionParameters: {
        duration: userProfile.workoutDuration || 30,
        goal: userProfile.fitnessGoal || 'general_fitness',
        mode: 'classic',
        targetMuscleGroups: ['full_body'],
        equipment: this.getEquipmentFromCategory(userProfile.availableEquipment),
        intensity: 6
      },
      focus
    };
    
    return this.generateWorkout(request, AIModelType.SCHNELL);
  }

  async generateDetailedWorkout(
    userProfile: UserProfile,
    workoutType?: 'strength' | 'cardio' | 'flexibility' | 'mixed',
    additionalInstructions?: string
  ): Promise<EnhancedWorkoutResponse> {
    const request: WorkoutGenerationRequest = {
      userProfile,
      sessionParameters: {
        duration: userProfile.workoutDuration || 45,
        goal: userProfile.fitnessGoal || 'general_fitness',
        mode: 'classic',
        targetMuscleGroups: ['full_body'],
        equipment: this.getEquipmentFromCategory(userProfile.availableEquipment),
        intensity: 7
      },
      workoutType,
      additionalInstructions
    };
    
    return this.generateWorkout(request, AIModelType.PRAEZISE);
  }

  async generateCreativeWorkout(
    userProfile: UserProfile,
    theme?: string
  ): Promise<EnhancedWorkoutResponse> {
    const request: WorkoutGenerationRequest = {
      userProfile,
      sessionParameters: {
        duration: userProfile.workoutDuration || 30,
        goal: userProfile.fitnessGoal || 'general_fitness',
        mode: 'emom',
        targetMuscleGroups: ['full_body'],
        equipment: this.getEquipmentFromCategory(userProfile.availableEquipment),
        intensity: 7
      },
      additionalInstructions: theme ? `Create a ${theme}-themed workout` : undefined
    };
    
    return this.generateWorkout(request, AIModelType.KREATIV);
  }
}

// Singleton instance
let workoutGeneratorService: WorkoutGeneratorService | null = null;

export function getWorkoutGeneratorService(): WorkoutGeneratorService {
  if (!workoutGeneratorService) {
    workoutGeneratorService = new WorkoutGeneratorService();
  }
  return workoutGeneratorService;
}

export { WorkoutGeneratorService };
export default getWorkoutGeneratorService;
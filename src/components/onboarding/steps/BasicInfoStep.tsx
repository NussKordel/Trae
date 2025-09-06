import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { FormField } from '@/components/forms/FormField';
import { QuickStartProfile, CompleteProfile } from '@/types/user';

interface BasicInfoStepProps {
  register: UseFormRegister<QuickStartProfile | CompleteProfile>;
  errors: FieldErrors<QuickStartProfile | CompleteProfile>;
  watch: UseFormWatch<QuickStartProfile | CompleteProfile>;
  setValue: UseFormSetValue<QuickStartProfile | CompleteProfile>;
  getValues: UseFormGetValues<QuickStartProfile | CompleteProfile>;
}

export function BasicInfoStep({ register, errors }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Let's start with some basic information about you.
        </p>
      </div>

      <FormField
        name="name"
        label="What's your name?"
        type="text"
        placeholder="Enter your first name"
        register={register}
        error={errors.name}
        required
        helperText="We'll use this to personalize your experience"
      />

      <FormField
        name="age"
        label="How old are you?"
        type="number"
        placeholder="Enter your age"
        register={register}
        error={errors.age}
        required
        helperText="This helps us create age-appropriate workout plans"
      />
    </div>
  );
}
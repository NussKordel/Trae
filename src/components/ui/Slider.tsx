'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min: number
  max: number
  step: number
  className?: string
  disabled?: boolean
}

export function Slider({
  value,
  onValueChange,
  min,
  max,
  step,
  className,
  disabled = false
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const currentValue = value[0] || min

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100
  }

  const getValueFromPosition = (clientX: number) => {
    if (!sliderRef.current) return currentValue
    
    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const rawValue = min + percentage * (max - min)
    const steppedValue = Math.round(rawValue / step) * step
    return Math.max(min, Math.min(max, steppedValue))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    setIsDragging(true)
    const newValue = getValueFromPosition(e.clientX)
    onValueChange([newValue])
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return
    const newValue = getValueFromPosition(e.clientX)
    onValueChange([newValue])
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    
    let newValue = currentValue
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, currentValue - step)
        break
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, currentValue + step)
        break
      case 'Home':
        newValue = min
        break
      case 'End':
        newValue = max
        break
      default:
        return
    }
    
    e.preventDefault()
    onValueChange([newValue])
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div
        ref={sliderRef}
        className={cn(
          'relative h-2 w-full cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onMouseDown={handleMouseDown}
      >
        {/* Track fill */}
        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600"
          style={{ width: `${getPercentage(currentValue)}%` }}
        />
        
        {/* Thumb */}
        <div
          className={cn(
            'absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg transition-transform',
            isDragging && 'scale-110',
            !disabled && 'hover:scale-110',
            disabled && 'cursor-not-allowed'
          )}
          style={{ left: `${getPercentage(currentValue)}%` }}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-disabled={disabled}
        />
      </div>
    </div>
  )
}
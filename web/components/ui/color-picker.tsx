'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value?: string;
  onChange: (value: string) => void;
  colors: { value: string; label: string; color: string }[];
  placeholder?: string;
}

export function ColorPicker({ value, onChange, colors, placeholder = 'Select color' }: ColorPickerProps) {
  const selectedColor = colors.find(color => color.value === value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            {selectedColor ? (
              <>
                <div
                  className="h-4 w-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: selectedColor.color }}
                />
                <span>{selectedColor.label}</span>
              </>
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="grid grid-cols-4 gap-2 p-4">
          {colors.map((color) => (
            <button
              key={color.value}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md p-2 text-xs hover:bg-gray-100 transition-colors",
                value === color.value && "bg-gray-100 ring-2 ring-blue-500"
              )}
              onClick={() => onChange(color.value)}
            >
              <div
                className="h-8 w-8 rounded-full border border-gray-300"
                style={{ backgroundColor: color.color }}
              />
              <span className="text-center leading-tight">{color.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

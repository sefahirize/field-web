'use client';

import * as React from 'react';

interface SwitchProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ checked = false, onCheckedChange, disabled = false, className = '' }, ref) => {
        return (
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                ref={ref}
                onClick={() => onCheckedChange?.(!checked)}
                className={`
          relative inline-flex h-6 w-[40px] items-center rounded-full !outline-none
          transition-colors duration-200 ease-in-out border border-natural-gray-border
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${checked ? 'bg-app-blue' : 'bg-white'}
          focus:outline-none !ring-0
          ${className}
        `}
            >
                <span
                    className={`
            inline-block h-4 w-4 transform rounded-full shadow-lg
            transition duration-200 ease-in-out
            ${checked ? 'translate-x-[19px] bg-white' : 'translate-x-[3px] bg-gray-tint'}
          `}
                />
            </button>
        );
    }
);

Switch.displayName = 'Switch';

export default Switch;
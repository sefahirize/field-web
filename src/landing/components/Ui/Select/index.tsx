"use client"

import { useState, useRef, useEffect, useMemo, type KeyboardEvent } from 'react';

interface SelectOption {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    icon?: string | React.ReactNode;
}

interface SelectProps<T extends SelectOption> {
    options: T[];
    value?: string | T;
    onChange?: (value: string | T) => void;
    placeholder?: string;
    className?: string;
    rounded?: boolean;
    labelKey?: string;
    valueKey?: string;
    returnObject?: boolean;
    selectedClassName?: string;
    textClassNames?: {
        notSelected?: string;
        selected?: string;
    };
    addLine?: boolean;
    preventIcon?: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hideItems?: any[];
    /** Show a search field above the option list and filter options by query */
    searchable?: boolean;
    searchPlaceholder?: string;
    /** Option keys to concatenate for matching (defaults to label + value keys) */
    searchKeys?: string[];
    /** Extra classes for the floating panel (e.g. min-width wider than trigger) */
    dropdownPanelClassName?: string;
}

const Select = <T extends SelectOption>({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    className = '',
    rounded = false,
    labelKey = 'label',
    valueKey = 'value',
    hideItems = [],
    selectedClassName = '',
    textClassNames = {
        notSelected: 'text-gray-400',
        selected: 'text-gray-700'
    },
    returnObject = false,
    addLine = false,
    preventIcon = false,
    searchable = false,
    searchPlaceholder = 'Search…',
    searchKeys,
    dropdownPanelClassName = '',
}: SelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [selectedOption, setSelectedOption] = useState<T | null>(() => {
        if (!value) return null;
        if (typeof value === 'string') {
            return options.find(opt => opt[valueKey] === value) || null;
        }
        return value as T;
    });

    const selectRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: T) => {
        setSelectedOption(option);
        setIsOpen(false);
        setSearchQuery('');
        if (onChange) {
            onChange(returnObject ? option : option[valueKey]);
        }
    };

    const effectiveSearchKeys = useMemo(
        () => searchKeys ?? [labelKey, valueKey],
        [searchKeys, labelKey, valueKey],
    );

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredOptions = useMemo(() => {
        if (!searchable || !normalizedQuery) {
            return options;
        }
        return options.filter((option) => {
            const haystack = effectiveSearchKeys
                .map((key) => String(option[key] ?? ''))
                .join(' ')
                .toLowerCase();
            return haystack.includes(normalizedQuery);
        });
    }, [options, searchable, normalizedQuery, effectiveSearchKeys]);

    useEffect(() => {
        if (isOpen && searchable) {
            searchInputRef.current?.focus();
        }
    }, [isOpen, searchable]);

    const handleToggleOpen = () => {
        setIsOpen((open) => {
            if (open) {
                setSearchQuery('');
            }
            return !open;
        });
    };

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        event.stopPropagation();
        if (event.key === 'Escape') {
            setIsOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <div className={`relative ${className}`} ref={selectRef}>
            {/* Select trigger button */}
            <div
                className={`flex items-center justify-between w-full px-4 py-2 text-left bg-white ${rounded ? 'rounded-full' : 'rounded-md'
                    } cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0px_0px_0px_1px_rgba(9,25,72,0.13),0px_1px_2px_0px_rgba(18,55,105,0.08)] 
                ${selectedClassName}`}
                onClick={handleToggleOpen}
            >
                <div className="flex items-center">
                    {preventIcon ? preventIcon : ""}
                    {selectedOption?.icon && (
                        typeof selectedOption.icon === 'string' ? (
                            <img
                                src={selectedOption.icon}
                                alt=""
                                className="w-5 h-5 mr-2 object-contain"
                            />
                        ) : (
                            <div className="w-5 h-5 mr-2">
                                {selectedOption.icon}
                            </div>
                        )
                    )}
                    <span className={`text-sm ${!selectedOption ? textClassNames.notSelected : textClassNames.selected}`}>
                        {selectedOption ? selectedOption[labelKey] : placeholder}
                    </span>
                </div>
                {addLine && <div className="w-[1px] h-[16px] mx-2 bg-natural-gray-border"></div>}
                <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
                        }`}
                    fill="none"
                    stroke="#A4ACB9"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            <div className={`absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg ${isOpen ? 'block' : 'hidden'} ${dropdownPanelClassName}`}>
                {searchable && (
                    <div className="px-3 pt-3 pb-1 border-b border-gray-100">
                        <input
                            ref={searchInputRef}
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={searchPlaceholder}
                            aria-label={searchPlaceholder}
                            className="w-full rounded-lg border border-natural-gray-border px-3 py-2 text-sm placeholder:text-natural-gray-default focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="off"
                        />
                    </div>
                )}
                <ul className="py-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {filteredOptions.length === 0 && (
                        <li className="px-4 py-3 text-sm text-natural-gray-default">
                            No matches
                        </li>
                    )}
                    {filteredOptions.map((option) => (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        !hideItems.includes(option[valueKey] as any) && (
                            <li
                                key={option[valueKey]}
                                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedOption?.[valueKey] === option[valueKey] ? 'bg-blue-50' : ''
                                    }`}
                                onClick={() => handleSelect(option)}
                            >
                                {option.icon && (
                                    typeof option.icon === 'string' ? (
                                        <img
                                            src={option.icon}
                                            alt=""
                                            className="w-5 h-5 mr-2 object-contain"
                                        />
                                    ) : (
                                        <div className="w-5 h-5 mr-2">
                                            {option.icon}
                                        </div>
                                    )
                                )}
                                <span className='text-sm font-medium text-nature-black'>
                                    {option[labelKey]}
                                </span>
                            </li>
                        )
                    ))}
                </ul>
            </div>

            {/* Dropdown menu */}
            {/* {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg">
                    <ul className="py-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
                            <li
                                key={option[valueKey]}
                                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedOption?.[valueKey] === option[valueKey] ? 'bg-blue-50' : ''
                                    }`}
                                onClick={() => handleSelect(option)}
                            >
                                {option.icon && (
                                    typeof option.icon === 'string' ? (
                                        <img
                                            src={option.icon}
                                            alt=""
                                            className="w-5 h-5 mr-2 object-contain"
                                        />
                                    ) : (
                                        <div className="w-5 h-5 mr-2">
                                            {option.icon}
                                        </div>
                                    )
                                )}
                                <span className='text-sm font-medium text-nature-black'>
                                    {option[labelKey]}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}
        </div>
    );
};

export default Select;


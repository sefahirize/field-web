import React, { useState } from 'react';
import { Divider, ListSubheader, Menu, MenuItem } from '@mui/material';
import { useThemeMode } from '@dashboard/libs/themeMode';

const icon = props => ({ width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, ...props });

const Icons = {
  light: () => (
    <svg {...icon()}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </svg>
  ),
  dark: () => (
    <svg {...icon()}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
    </svg>
  ),
  system: () => (
    <svg {...icon()}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
};

const LAYOUT_OPTIONS = [
  { value: 'classic', label: 'Classic', hint: 'Light navigation, white page' },
  { value: 'rail', label: 'Rail', hint: 'Dark navigation that folds to icons, cream page' },
];

const Check = () => (
  <svg className="ThemeToggle-Check" {...icon({ width: 16, height: 16, strokeWidth: 2.4 })}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

const OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

/**
 * The header's theme switch: one icon (the sun in light, the moon in dark) that
 * opens Light / Dark / System. "System" follows the device and keeps following
 * it while the page is open. The same menu picks the layout (Classic / Rail).
 */
export const ThemeToggle = () => {
  const { preference, resolved, setPreference, layout, setLayout } = useThemeMode();
  const [anchor, setAnchor] = useState(null);
  const Current = Icons[resolved] ?? Icons.light;
  const current = OPTIONS.find(option => option.value === preference);

  return (
    <>
      <button
        type="button"
        className="ThemeToggle"
        aria-label={`Theme: ${current?.label ?? 'Light'}. Change theme`}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchor)}
        onClick={event => setAnchor(event.currentTarget)}
      >
        <Current />
      </button>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ list: { 'aria-label': 'Theme' } }}
      >
        <ListSubheader className="ThemeToggle-Heading" disableSticky>
          Theme
        </ListSubheader>
        {OPTIONS.map(option => {
          const OptionIcon = Icons[option.value];
          const selected = option.value === preference;
          return (
            <MenuItem
              key={option.value}
              role="menuitemradio"
              aria-checked={selected}
              selected={selected}
              className="ThemeToggle-Item"
              onClick={() => {
                setPreference(option.value);
                setAnchor(null);
              }}
            >
              <span className="ThemeToggle-ItemIcon">
                <OptionIcon />
              </span>
              <span className="ThemeToggle-ItemLabel">{option.label}</span>
              {selected && <Check />}
            </MenuItem>
          );
        })}
        <Divider component="li" />
        <ListSubheader className="ThemeToggle-Heading" disableSticky>
          Layout
        </ListSubheader>
        {LAYOUT_OPTIONS.map(option => {
          const selected = option.value === layout;
          return (
            <MenuItem
              key={option.value}
              role="menuitemradio"
              aria-checked={selected}
              selected={selected}
              className="ThemeToggle-Item ThemeToggle-Item--layout"
              onClick={() => {
                setLayout(option.value);
                setAnchor(null);
              }}
            >
              <span className="ThemeToggle-ItemText">
                <span className="ThemeToggle-ItemLabel">{option.label}</span>
                <span className="ThemeToggle-ItemHint">{option.hint}</span>
              </span>
              {selected && <Check />}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

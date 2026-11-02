import { createTheme } from '@mui/material/styles';
import { IconCheckboxChecked as IconChecked } from '@dashboard/components/icons';
import { IconCheckboxUnchecked as IconUnChecked } from '@dashboard/components/icons';
import { IconCheckboxIndeterminate as IconIndeterminate } from '@dashboard/components/icons';

/* const fontFamily = ['Inter', 'sans-serif'].join(','); */

const themeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1025,
      lg: 1272,
      xl: 1272,
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    // G — Mono: the ink is the primary colour; the accent lives in the SCSS
    // (`$Color-Accent`) and is only used for small marks.
    primary: { main: '#0e0e0c', contrastText: '#fff' },
    error: { main: '#c2183c' },
    text: { primary: '#0e0e0c', secondary: '#5b5e5c' },
    black: {
      main: '#000',
      darker: '#fff',
    },
    white: {
      main: '#fff',
      contrastText: '#000',
    },
    transparent: {
      main: '#fff',
      contrastText: '#000',
    },
    navy: {
      main: '#000',
    },
    gray: {
      main: '#000',
    },
    red: {
      main: '#000',
    },
  },
  components: {
    // Name of the component
    MuiCheckbox: {
      defaultProps: {
        icon: <IconUnChecked />,
        checkedIcon: <IconChecked />,
        indeterminateIcon: <IconIndeterminate />,
      },
    },

    Tooltip: {
      defaultProps: {
        disableFocusListener: true,
        disableHoverListener: true,
        disableTouchListener: true,
        arrow: true,
        placement: 'bottom-end',
      },
    },
  },
};

// Light is the original theme, untouched.
const lightTheme = createTheme(themeOptions);

// Dark only changes the palette: the same ink, inverted, on the dark surfaces from
// styles/_tokens.scss. Everything else (type, breakpoints, components) is shared.
const darkTheme = createTheme(themeOptions, {
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff', contrastText: '#0b0b0a' },
    error: { main: '#ff8fa6' },
    text: { primary: '#ffffff', secondary: '#9a9b98' },
    background: { default: '#0b0b0a', paper: '#151614' },
    divider: '#2c2e2b',
  },
});

export const getTheme = mode => (mode === 'dark' ? darkTheme : lightTheme);

export default lightTheme;

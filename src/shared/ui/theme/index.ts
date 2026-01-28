/**
 * App Theme Configuration
 *
 * Central location for all color, spacing, and typography definitions.
 */

/**
 * Color palette for the app
 */
export const colors = {
  // Primary brand colors
  primary: '#4F46E5', // Indigo
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',

  // Secondary colors
  secondary: '#10B981', // Emerald (success/complete)
  secondaryLight: '#34D399',
  secondaryDark: '#059669',

  // Neutral colors
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F4F6',

  // Text colors
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Semantic colors
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  success: '#10B981',
  successLight: '#D1FAE5',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Border colors
  border: '#E5E7EB',
  borderFocused: '#4F46E5',

  // Specific UI elements
  cardBackground: '#FFFFFF',
  inputBackground: '#F9FAFB',
  tabBarBackground: '#FFFFFF',
  headerBackground: '#FFFFFF',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

/**
 * Spacing scale (in pixels)
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Border radius values
 */
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

/**
 * Typography scale
 */
export const typography = {
  // Font sizes
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },

  // Font weights
  weight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

/**
 * Shadow definitions
 */
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

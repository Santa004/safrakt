// Central theme for Mantorpskliniken
export const colors = {
  forest: '#1F3D2B',
  forestDeep: '#152B1E',
  cream: '#F7F3EC',
  creamAlt: '#EFE9DD',
  sage: '#C5D1C0',
  sageSoft: '#DCE4D8',
  ink: '#1C1C1C',
  inkSoft: '#4A4A4A',
  gold: '#C4A574',
  white: '#FFFFFF',
  danger: '#B4341F',
  success: '#2E7D4F',
  warning: '#C4A574',
  border: '#E4DFD3',
  muted: '#8A8577',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const font = {
  // System-safe stack — clean, warm and clinical
  sans: 'System',
  display: 'Georgia',
};

export const type = {
  h1: { fontSize: 30, fontWeight: '700', lineHeight: 36, color: colors.forest },
  h2: { fontSize: 22, fontWeight: '700', lineHeight: 28, color: colors.forest },
  h3: { fontSize: 18, fontWeight: '700', lineHeight: 24, color: colors.forest },
  body: { fontSize: 15, lineHeight: 22, color: colors.ink },
  bodyMuted: { fontSize: 15, lineHeight: 22, color: colors.inkSoft },
  small: { fontSize: 13, lineHeight: 18, color: colors.inkSoft },
  label: { fontSize: 12, lineHeight: 16, color: colors.muted, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '600' },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
};

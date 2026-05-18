import { colors, typography, spacing, radius, Theme } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';

export function useTheme(): Theme {
  const mode = useThemeStore((state) => state.mode);
  const isDark = mode === 'dark';

  return {
    colors: isDark ? colors.dark : colors.light,
    typography,
    spacing,
    radius,
  };
}
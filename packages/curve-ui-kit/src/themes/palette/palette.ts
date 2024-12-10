import { DesignSystem } from '../design'
import { PaletteOptions } from '@mui/material'

export const createPalette = (
  mode: 'light' | 'dark',
  { Layer, Color, Feedback, Text }: DesignSystem,
): PaletteOptions => ({
  mode,
  primary: { main: Color.Primary[500] },
  secondary: { main: Color.Secondary[500] },
  error: { main: Feedback.Error },
  info: { main: Feedback.Info },
  warning: { main: Feedback.Warning },
  success: { main: Feedback.Success },
  text: {
    primary: Text.TextColors.Primary,
    secondary: Text.TextColors.Secondary,
    tertiary: Text.TextColors.Tertiary,
    disabled: Text.TextColors.Disabled,
    highlight: Text.TextColors.Highlight,
  },
  action: {
    // active: Layer.Highlight.Fill,
    hover: Layer[2].Fill,
    // selected: Layer.Highlight.Fill,
    // disabled: string,
    // disabledBackground: string,
    // focus: string,
  },
  background: { default: Layer.App.Background, paper: Layer[3].Fill },
})

export type Palette = ReturnType<typeof createPalette>

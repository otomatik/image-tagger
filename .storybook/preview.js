import GlobalStyles from 'styles/global'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'

export const decorators = [
  (Story) => (
    <>
      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    </>
  )
]

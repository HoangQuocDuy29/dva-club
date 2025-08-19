import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { queryClient } from './services/api/client'
import { AppRouter } from './router/AppRouter'

// ✅ Tạo theme MUI tạm thời (có thể tách ra file riêng sau)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Volleyball blue
    },
    secondary: {
      main: '#dc004e', // Volleyball red
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          {/* ✅ Bỏ div tạm thời, thay bằng AppRouter */}
          <AppRouter />
        </BrowserRouter>
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App

import { store, persistor } from './redux/store'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PersistGate } from 'redux-persist/integration/react'
import { TimeOfDayProvider } from './store/TimeofDay.tsx'
import { HabitProvider } from './store/HabitProvider.tsx'
import { ThemeProvider } from './store/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ThemeProvider>
        <TimeOfDayProvider>
          <HabitProvider>
            <App />
          </HabitProvider>
        </TimeOfDayProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>
)

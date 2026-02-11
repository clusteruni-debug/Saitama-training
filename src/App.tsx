import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-[var(--color-bg-dark)]">
        <Routes>
          <Route path="/" element={
            <main className="flex flex-col items-center justify-center min-h-dvh px-4">
              <h1 className="text-4xl font-black text-[var(--color-hero-yellow)] mb-2">
                SAITAMA TRAINING
              </h1>
              <p className="text-[var(--color-text-secondary)] text-center">
                100 Push-ups. 100 Sit-ups. 100 Squats. 10km Run. Every single day.
              </p>
            </main>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

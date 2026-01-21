import { useState } from 'react'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center font-display">
      <div className="glass p-8 rounded-2xl flex flex-col items-center gap-6">
        <div className="flex gap-8">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="w-24 h-24 hover:drop-shadow-[0_0_2em_#646cffaa] transition-all" alt="Vite logo" />
          </a>
        </div>
        <h1 className="text-5xl font-black bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-transparent">
          Vite + React + Router v7
        </h1>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-brand-500 hover:bg-brand-600 px-6 py-2 rounded-lg font-bold transition-colors cursor-pointer"
          >
            count is {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

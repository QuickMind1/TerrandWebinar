import { useState } from 'react'

// En dev usa el proxy de Vite (/api) para evitar CORS; en prod va directo al backend
const BASE_URL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_BASE_URL

function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)

  const handleStart = async () => {
    setLoading(true)
    setError(null)
    try {
      // GET sin headers custom = "simple request": el navegador no manda preflight OPTIONS
      const res = await fetch(`${BASE_URL}/trigger-analysis`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // El backend puede responder 2xx con cuerpo vacío (p. ej. 204): no llamar a res.json() a ciegas
      const text = await res.text()
      setResult(text ? JSON.parse(text) : { status: res.status, ok: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <button
        type="button"
        onClick={handleStart}
        disabled={loading}
        className="rounded-lg bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Cargando...' : 'Iniciar'}
      </button>
      {error && <p className="text-red-600">{error}</p>}
      {result !== null && (
        <pre className="max-w-xl overflow-auto rounded bg-gray-100 p-4 text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  )
}

export default App

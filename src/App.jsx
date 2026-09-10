import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Feed from './pages/Feed'
import Upload from './pages/Upload'
import Login from './pages/Login'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>Loading...</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Feed session={session} />} />
        <Route path="/upload" element={session ? <Upload session={session} /> : <Navigate to="/login" />} />
        <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
      </Routes>
    </BrowserRouter>
  )
}

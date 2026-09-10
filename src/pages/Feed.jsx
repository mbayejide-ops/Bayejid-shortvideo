import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

const CATEGORIES = ['All', 'Comedy', 'Music', 'Dance', 'Sports', 'Food', 'Travel', 'Gaming', 'Education', 'Fashion', 'Tech', 'Movies', 'Pets', 'News', 'Fitness', 'Nature']

export default function Feed({ session }) {
  const [videos, setVideos] = useState([])
  const [category, setCategory] = useState('All')

  useEffect(() => {
    const fetchVideos = async () => {
      let query = supabase.from('videos').select('*').order('created_at', { ascending: false })
      if (category !== 'All') query = query.eq('category', category)
      const { data } = await query
      setVideos(data || [])
    }
    fetchVideos()
  }, [category])

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', overflowX: 'auto', gap: 8, padding: 10, position: 'sticky', top: 0, background: '#000', zIndex: 10 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c} onClick={() => setCategory(c)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', whiteSpace: 'nowrap',
              background: category === c ? 'white' : '#333',
              color: category === c ? 'black' : 'white',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <Link to={session ? '/upload' : '/login'} style={{ color: 'white' }}>+ Upload</Link>
      </div>

      <div style={{ scrollSnapType: 'y mandatory', overflowY: 'scroll', height: 'calc(100vh - 60px)' }}>
        {videos.map((v) => (
          <div key={v.id} style={{ scrollSnapAlign: 'start', height: 'calc(100vh - 60px)', position: 'relative' }}>
            <video
              src={v.catbox_link} controls autoPlay loop muted playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', bottom: 20, left: 10, textShadow: '0 0 4px black' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>@{v.uploaded_by}</p>
              <p style={{ margin: 0 }}>{v.title}</p>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>{v.category}</p>
            </div>
          </div>
        ))}
        {videos.length === 0 && <p style={{ textAlign: 'center', marginTop: 40 }}>No videos in this category yet.</p>}
      </div>
    </div>
  )
      }

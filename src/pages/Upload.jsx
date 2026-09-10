import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['Comedy', 'Music', 'Dance', 'Sports', 'Food', 'Travel', 'Gaming', 'Education', 'Fashion', 'Tech', 'Movies', 'Pets', 'News', 'Fitness', 'Nature']

export default function Upload({ session }) {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return setError('Select a video file first')
    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('reqtype', 'fileupload')
      formData.append('fileToUpload', file)

      const res = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData,
      })
      const catboxUrl = await res.text()

      if (!catboxUrl.startsWith('http')) throw new Error('Catbox upload failed')

      const { error: dbError } = await supabase.from('videos').insert({
        user_id: session.user.id,
        catbox_link: catboxUrl.trim(),
        title,
        category,
        uploaded_by: session.user.email.split('@')[0],
      })
      if (dbError) throw dbError

      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: '40px auto', color: 'white', fontFamily: 'sans-serif' }}>
      <h2>Upload Video</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} style={{ marginBottom: 10 }} />
        <input
          type="text" placeholder="Title" value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, boxSizing: 'border-box' }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 10 }}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={uploading} style={{ width: '100%', padding: 10 }}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
    }

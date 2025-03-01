import { useState, useRef, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import Login from './components/Login'
import Register from './components/Register'
import './App.css'

function App() {
  const [images, setImages] = useState([])
  const [user, setUser] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const fileInputRef = useRef(null)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    handleFiles(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    handleFiles(files)
  }

  const handleFiles = (files) => {
    const validImageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    )

    validImageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleDelete = (indexToDelete) => {
    setImages(prev => prev.filter((_, index) => index !== indexToDelete))
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Помилка при виході:', error)
    }
  }
  
  if (!user) {
    return (
      <div className="container">
        <h1>Фотогалерея</h1>
        {isRegistering ? (
          <>
            <Register onSuccess={() => setIsRegistering(false)} />
            <div className="auth-toggle">
              <button onClick={() => setIsRegistering(false)}>
                Вже маєте акаунт? Увійдіть
              </button>
            </div>
          </>
        ) : (
          <>
            <Login onSuccess={() => {}} />
            <div className="auth-toggle">
              <button onClick={() => setIsRegistering(true)}>
                Немає акаунту? Зареєструйтесь
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Завантаження зображень</h1>
        <button onClick={handleLogout} className="logout-button">
          Вийти
        </button>
      </div>
      
      <div 
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <p>Натисніть тут або перетягніть зображення для завантаження</p>
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
      </div>

      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-container">
            <img src={image} alt={`Зображення ${index + 1}`} />
            <button 
              className="delete-button"
              onClick={() => handleDelete(index)}
              title="Видалити зображення"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

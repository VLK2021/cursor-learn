import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [images, setImages] = useState([])
  const fileInputRef = useRef(null)
  
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
  
  return (
    <div className="container">
      <h1>Завантаження зображень</h1>
      
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

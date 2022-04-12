import { useState, useEffect, FormEvent } from 'react'
import * as style from './App.styles'
import * as Photos from './services/photos'
import { Photo } from './types/Photo'
import {PhotoItem} from './components/PhotoItem'

const App = () => {
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true)
      setPhotos(await Photos.getAll())
      setLoading(false)
    }
    getPhotos()
  }, [])

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const file = formData.get('image') as File

    if(file && file.size > 0) {
      setUploading(true)
      let result = await Photos.insert(file)
      setUploading(false)

      if(result instanceof Error) {
        alert(`${result.name} - ${result.message}`)
      }else {
        let newPhotosList = [...photos]
        newPhotosList.push(result)
        setPhotos(newPhotosList)
      }
    }
  }

  return (
    <style.Container>
      <style.Area>
        <style.Header>Galeria de Fotos</style.Header>

        <style.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" value="Enviar" />
          {uploading && "Enviando..."}
        </style.UploadForm>

        {loading &&
          <style.ScreenWarning>
            <div className='emoji'>🤚</div>
            <div>Carregando...</div>
          </style.ScreenWarning>
        }

        {!loading && photos.length > 0 &&
          <style.PhotoList>
            {photos.map((item, index) => (
              <PhotoItem key={index} url={item.url} name={item.name}/>
            ))}
          </style.PhotoList>
        }

        {!loading && photos.length === 0 &&
          <style.ScreenWarning>
            <div className='emoji'>😔</div>
            <div>Não há fotos cadastradas</div>
          </style.ScreenWarning>
        }
      </style.Area>
    </style.Container>
  )
}

export default App
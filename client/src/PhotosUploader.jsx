import { useState } from "react";
import axios from "axios";
function PhotosUploader({addedPhotos, onChange}){
    const [photos, setPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    async function addPhotoByLink(ev){
    ev.preventDefault();
    const {data:filename} = await axios.post('/upload-by-link', {link: photoLink});
    onChange(prev => {
      return [...prev, filename];
    });
    setPhotoLink('');
    }

    function uploadPhoto(ev){
    ev.preventDefault();
    const files = ev.target.files;
    const data = new FormData();
    for(let i=0; i<files.length; i++){
      data.append('photos', files[i]);
    }
    axios.post('/upload' , data , {
      headers: {'Content-Type' : 'multipart/form-data',}
    }).then(response => {
      const {data : filenames} = response;
      setPhotos(prev => {
        return [...prev, ...filenames];
      });
    
    })
  }

    return (
        <>
            <div className="flex gap-2">
            <input type="text" placeholder={'Add using a link ...jpg'} value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} />

            <button onClick={addPhotoByLink} className="bg-gray-300 px-4 rounded-2xl">Add Photo</button>
          </div>
          
          <div className="grid mt-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {photos.length > 0 && photos.map((filename, index) => {
            
              const imageurl = `http://localhost:4000/uploads/${filename}`;
              return (
                <div className="photo-item flex" key={index} >
                  <img className="rounded-2xl w-full object-cover" src={imageurl} alt={'Photo'} />
                </div>
              )
            })}
            <label className="border cursor-pointer bg-transparent rounded-xl p-8 text-xl flex text-gray-400 justify-center items-center gap-1">
              <input type="file" multiple className="hidden" onChange={uploadPhoto} />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
              </svg>
              Upload
            </label>
          </div>

        </>
    );
}

export default PhotosUploader;
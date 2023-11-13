import './App.css'
import { useEffect, useState } from 'react';
import axios from "axios"
function App() { 
  const[file,setFile]= useState()
  const[img, setImages]=useState()

  const handle_uploade = (e) => {
    e.preventDefault()
    const uploade = "http://127.0.0.1:3000/compressImage";
    
    const formdata = new FormData()
    formdata.append('file', file);
    console.log(formdata)
   axios.post(uploade,formdata)
   .then(result=>setImages(result.data[0].image))
   .catch(err => console.log(err.message))
  };
useEffect(()=>{
 axios.get("http://127.0.0.1:3000/upload")
  .then(result=>setImages(result.data[0].image))
  .catch(err=>console.log(err))
},[])
  return (
    <>
      <form>
        <input
          className="input"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      <input type="submit" onClick={handle_uploade} value="submit"/>
    <br />
    <img src={`http://localhost:3000/${img}`} alt="" width="100px" />
      </form>
    </>
  )
}

export default App
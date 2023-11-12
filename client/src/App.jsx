import './App.css'
import { useState } from 'react';
import axios from "axios"
function App() { 
  const[file,setFile]= useState()

  const handle_uploade = (e) => {
    e.preventDefault()
    const uploade = "http://127.0.0.1:3000/upload";
    
    const formdata = new FormData()
    formdata.append('file', file);
    console.log(formdata)
   axios.post(uploade,formdata)
   .then(result =>console.log(result))
   .catch(err => console.log(err.message))
  };

  return (
    <>
      <form>
        <input
          className="input"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      <input type="submit" onClick={handle_uploade} value="submit"/>
      </form>
    </>
  )
}

export default App
 // fetch(uploade, {
    //   method: "post",
    //   body: file,
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data)
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
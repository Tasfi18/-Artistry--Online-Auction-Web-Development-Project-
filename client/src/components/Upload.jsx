import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Upload.css';

const Upload = () => {
    const { loggedinfo} = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState()

    const upload = () => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('ID', loggedinfo.ID)
        if(loggedinfo.UserType == 'buyer'){

            axios.post('http://localhost:8000/api/upload/buyer',formData )
            .then( res => {})
            .catch(er => console.log(er))
            location.reload()
        }
        else if(loggedinfo.UserType == 'artist'){
            axios.post('http://localhost:8000/api/upload/artist', formData, {
                timeout: 5000 
              }) 
            .then( res => {})
            .catch(er => console.log(er))
            location.reload()
        }
      
        
    }
    return (
        <div className="upload-container">
      <div className="form-group">
        <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      <button type="button" onClick={upload}>
        Upload
      </button>
    </div>
    )
};

export default Upload;

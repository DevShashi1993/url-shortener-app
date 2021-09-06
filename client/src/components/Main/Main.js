import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import "./Main.css";

const Main = (props) => {
  let history = useHistory();
  const [urlData, setUrlData] = useState('');
  const [shortURL, setShortURL] = useState('');

  const handleUrlData = (event) => {
    let inputAreaValue = event.target.value;
    setUrlData(inputAreaValue);
  }

  const submitHandler = async () => {
    const data = { url: urlData, key: props.userData.apiKey};
    const res = await axios.post('/api/shorturl', data);
    
    if(res.status === 200) {
      console.log(res.data);
      setShortURL(res.data.short_url);
    }
  };

  useEffect(() => {
    if(!props.isLoggedin) {
      history.push('/login');
    }
  }, [history, props.isLoggedin]);

  return (
    <div className="main-container">
      <div className="input-section">
        <input
          type="url"
          placeholder="Enter url"
          value={urlData}
          onChange={(e) => handleUrlData(e)}
        />
        <button onClick={submitHandler}>Create Short URL</button>
      </div>

      {shortURL && (
        <div className="generated-url">
          <a href={shortURL}>{shortURL}</a>
        </div>
      )}
    </div>
  );
};

export default Main;

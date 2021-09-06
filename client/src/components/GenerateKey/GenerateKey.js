import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./GenerateKey.css";

export default function GenerateKey(props) {
  const history = useHistory();
  const { userData, isLoggedin, setUserData } = props;
  const [generatedApiKey, setGeneratedApiKey] = useState(userData.apiKey);

  const submitHandler = async () => {
    const data = { userEmailId: userData.email };
    const res = await axios.post("/api/generatekey", data);
    if (res.status === 200) {
      if (res.data.api_key) {
        setGeneratedApiKey(res.data.api_key);
        const updatedUserData = { ...userData, apiKey: res.data.api_key };
        setUserData(updatedUserData);
        localStorage.setItem("usappuser", JSON.stringify(updatedUserData));
      }
    }
  };

  useEffect(() => {
    if (!isLoggedin) {
      history.push("/login");
    }
  }, [history, isLoggedin]);

  return (
    <div className="apikey-container">
      <div className="apikey-input-area">
        <input type="text" value={generatedApiKey} disabled />
        <button onClick={submitHandler}>Generate Api Key</button>
      </div>
      <div className="instruction-section">
        <h3>
          Please use the API with above generated API key as shown below :{" "}
        </h3>
        <p>{`--request: POST Method`}</p>
        <p>{`--api url: http://localhost:5000/api/shorturl`}</p>
        <p>{`--data: {url: 'url_to_be_shortend', key: '${generatedApiKey}'}`}</p>
      </div>
    </div>
  );
}

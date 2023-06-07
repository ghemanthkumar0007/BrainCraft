import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../database/firebase';

function Askai() {
  const [selectedAI, setSelectedAI] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const sendQueryToAI = async () => {
    if (!userQuery.trim()) return;

    setIsWaiting(true);
    const response = await fetch(`URL_TO_YOUR_BACKEND_API/${selectedAI}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: userQuery })
    });
    const data = await response.json();
    setAiResponse(data.message);
    setIsWaiting(false);
  }

  return (
    <div className="chat-container">
        <h1 className=''>Ask AI</h1>
      <div className="ai-selection">
        <select value={selectedAI} onChange={e => setSelectedAI(e.target.value)}>
          <option value="">Select an AI model</option>
          <option value="chatgpt">ChatGPT</option>
          <option value="bard">BARD</option>
        </select>
      </div>
      <div className="chatbox">
        <div className="messages">
          {aiResponse && (
            <div className="ai-response">
              <div>{aiResponse}</div>
            </div>
          )}
        </div>
        <div className="user-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={userQuery}
            onChange={e => setUserQuery(e.target.value)}
          />
          <button onClick={sendQueryToAI} disabled={!selectedAI || !userQuery.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Askai;

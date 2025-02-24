import React, { useState } from 'react'
import './App.css'

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  const handleSubmit = async(e) => {
    e.preventDefault(); 
    if (question.trim() === "") {
      alert("Please enter a question before submitting!");
      return; 
    } 
    setLoading(true); // Set loading to true
    setError(null);    // Clear any previous errors
    setAnswer(null);
    
    try {
      const res = await fetch('http://localhost:3001/describe-world', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({question}),
      });

      const data = await res.json();
      if (data.success) {
        const text = JSON.parse(data.data).candidates[0].content.parts[0].text;
        setAnswer(text);
      } else {
        setError(data.message);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qna-container">
      <div className="question">
        <h1>Build a World</h1>
        <form className="question-form" onSubmit={handleSubmit} >
          <textarea 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question here..."
          />
          <br/>
          <button type="submit" disabled={loading || question.trim() === ""}>
            {loading ? "Asking..." : "Ask"}
          </button>
        </form>
      </div>
      
      <div >
        
      </div>
      <div className="answer">
        {
          error &&  <p className="error">Error: {error}</p>
        }
        {
          answer && <p>{answer}</p>
        }
      </div> 
    
    </div>
  );
}

export default App;

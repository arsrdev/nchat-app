import React, { useState, useEffect, useRef } from 'react';

import ReactMarkdown from 'react-markdown';


const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="copy-btn"
      title="Copy to clipboard"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
};


const TypingMessage = ({ text, speed = 10, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <div className="markdown-container">
      <ReactMarkdown>{displayedText}</ReactMarkdown>
    </div>
  );
};

const styles = `
  :root {
    --bg-color: rgb(10, 10, 10);
    --card-bg: rgb(20, 20, 20);
    --accent-primary: #00f2ff;
    --accent-secondary: #7000ff;
    --text-main: #ffffff;
    --text-muted: #a0a0a0;
    --glass-border: rgba(255, 255, 255, 0.08);
    --input-bg: rgb(15, 15, 15);
    --nav-height: 70px;
  }

  * { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
  }

  /* REMOVE SCROLLBAR BACKGROUND COLOR */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent; /* Makes the scrollbar track invisible */
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--accent-primary);
  }

  /* FOR FIREFOX */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }

  /* MARKDOWN SPECIFIC STYLES */
  .markdown-container h1, .markdown-container h2, .markdown-container h3 {
    margin: 1rem 0 0.5rem 0;
    color: var(--accent-primary);
  }
  .markdown-container p { margin-bottom: 0.8rem; }
  .markdown-container ul, .markdown-container ol { margin-left: 1.5rem; margin-bottom: 1rem; }
  .markdown-container strong { color: #fff; font-weight: 700; }
  .markdown-container code { background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px; }

  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--nav-height);
    background: rgb(20, 20, 20);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 0 2rem;
  }

  .nav-content {
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-brand {
    font-size: 2.0rem;
    font-weight: 800;
    color: var(--accent-primary);
    text-decoration: none;
    letter-spacing: -1px;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav-link {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
    cursor: pointer;
  }

  .nav-link:hover { color: var(--text-main); }

  .signin-btn {
    background: white;
    color: black;
    padding: 8px 20px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.9rem;
    border: none;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .app-wrapper {
    min-height: 100vh;
    background-color: var(--bg-color);
    color: var(--text-main);
    font-family: 'Inter', sans-serif;
    padding: calc(var(--nav-height) + 2rem) 1.5rem 2rem 1.5rem;
    display: flex;
    justify-content: center;
    background-image: radial-gradient(circle at 50% -20%, #1a1a1a, transparent);
  }

  .glass-card {
    background: var(--card-bg);
    border: 1px solid var(--glass-border);
    border-radius: 32px;
    padding: 2rem;
    width: 100%;
    max-width: 850px;
    display: flex;
    flex-direction: column;
    height: 80vh;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
  }

  .chat-container {
    flex-grow: 1;
    overflow-y: auto;
    padding-right: 10px;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .message {
    max-width: 85%;
    padding: 1.25rem;
    border-radius: 20px;
    line-height: 1.6;
    animation: fadeIn 0.4s ease-out;
    position: relative;
  }

  .user-message {
    align-self: flex-end;
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border-bottom-right-radius: 4px;
  }

  .ai-message {
    align-self: flex-start;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--glass-border);
    color: #d1d1d1;
    border-bottom-left-radius: 4px;
  }

  .copy-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--glass-border);
    color: var(--text-muted);
    font-size: 0.7rem;
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    opacity: 0;
  }

  .message:hover .copy-btn { opacity: 1; }

  .input-section {
    background: var(--input-bg);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .custom-textarea {
    background: transparent;
    border: none;
    color: white;
    padding: 1rem;
    flex-grow: 1;
    resize: none;
    font-size: 1rem;
    outline: none;
  }

  .send-btn {
    background: var(--accent-primary);
    color: black;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .dot { width: 6px; height: 6px; background: white; border-radius: 50%; animation: bounce 0.6s infinite alternate; }
  @keyframes bounce { to { transform: translateY(-4px); opacity: 0.3; } }
`;

const AIContentGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('https://nchat-api.vercel.app/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const result = await res.json();
      
      if (result.success) {
        setMessages((prev) => [...prev, { role: 'ai', content: result.data, isNew: true }]);
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection failed. Please check your backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <>
      <style>{styles}</style>
      
      <nav className="navbar">
        <div className="nav-content">
          <a href="#" className="nav-brand">Chat N</a>
          <div className="nav-links">
            <span className="nav-link">About</span>
            <span className="nav-link">Subscriptions</span>
            <button className="signin-btn">Sign In</button>
          </div>
        </div>
      </nav>

      <div className="app-wrapper">
        <div className="glass-card">
          <div className="chat-container" ref={scrollRef}>
            {messages.length === 0 && (
              <h1 style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '20%' }}>
                Start a conversation <br/> Your Personal AI Assistant
              </h1>
            )}
            
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                <div style={{ fontSize: '0.65rem', opacity: 0.6, marginBottom: '8px', fontWeight: 'bold' }}>
                  {msg.role === 'user' ? 'YOU' : 'AI'}
                </div>

                {msg.role === 'ai' && <CopyButton text={msg.content} />}
                
                {msg.role === 'ai' && msg.isNew ? (
                  <TypingMessage 
                    text={msg.content} 
                    speed={10} 
                    onComplete={() => { msg.isNew = false; }}
                  />
                ) : (
                  <div className="markdown-container">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
                
              </div>
            ))}

            {loading && (
              <div className="message ai-message">
                <div style={{ display: 'flex', gap: '5px' }}>
                  <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                </div>
              </div>
            )}
          </div>

          {error && <div style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

          <div className="input-section">
            <textarea
              className="custom-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows="1"
            />
            <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="send-btn">
              {loading ? '...' : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIContentGenerator;
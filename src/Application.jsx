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
    <button onClick={handleCopy} className="copy-button" title="Copy Message">
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      )}
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

const AIContentGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true); // Theme State
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
      const res = await fetch('http://localhost:3000/generate', {
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

  // Dynamic Styles based on darkMode state
  const themeStyles = `
    :root {
      --bg-color: ${darkMode ? 'rgb(10, 10, 10)' : '#f5f7f8'};
      --card-bg: ${darkMode ? 'rgb(20, 20, 20)' : '#ffffff'};
      --accent-primary: #00f2ff;
      --accent-secondary: #7000ff;
      --text-main: ${darkMode ? '#ffffff' : '#1a1a1a'};
      --text-muted: ${darkMode ? '#a0a0a0' : '#666666'};
      --glass-border: ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'};
      --input-bg: ${darkMode ? 'rgb(15, 15, 15)' : '#f0f2f5'};
      --nav-height: 70px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { 
        background: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}; 
        border-radius: 10px; 
    }

    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: var(--nav-height);
      background: var(--card-bg);
      border-bottom: 1px solid var(--glass-border);
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
      font-size: 1.5rem;
      font-weight: 800;
      color: ${darkMode ? 'var(--accent-primary)' : 'rgb(3, 3, 3)'};
      text-decoration: none;
    }

    .nav-right-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .theme-toggle {
      background: var(--input-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-main);
      padding: 8px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .theme-toggle:hover {
      transform: rotate(15deg);
      background: var(--glass-border);
    }

    .app-wrapper {
      min-height: 100vh;
      background-color: var(--bg-color);
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      padding: calc(var(--nav-height) + 2rem) 1.5rem 2rem 1.5rem;
      display: flex;
      justify-content: center;
      transition: background-color 0.3s ease;
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
      box-shadow: ${darkMode ? '0 40px 100px rgba(0, 0, 0, 0.8)' : '0 20px 50px rgba(0, 0, 0, 0.1)'};
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
      background: ${darkMode ? 'rgba(255, 255, 255, 0.05)' : '#00f2ff20'};
      color: var(--text-main);
      border-bottom-right-radius: 4px;
    }

    .ai-message {
      align-self: flex-start;
      background: ${darkMode ? 'rgba(255, 255, 255, 0.03)' : '#f0f2f5'};
      border: 1px solid var(--glass-border);
      color: var(--text-main);
      border-bottom-left-radius: 4px;
    }
      .copy-button {
      position: absolute;
      top: 8px;
      right: 8px;
      opacity: 0;
      background: ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
      border: 1px solid var(--glass-border);
      color: var(--text-muted);
      border-radius: 8px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
      .ai-message:hover .copy-button {
      opacity: 1;
    }

    .copy-button:hover {
      background: var(--accent-primary);
      color: white;
    }

    .custom-textarea {
      background: transparent;
      border: none;
      color: var(--text-main);
      padding: 1rem;
      flex-grow: 1;
      resize: none;
      outline: none;
    }

    .dot { width: 6px; height: 6px; background: var(--text-main); border-radius: 50%; animation: bounce 0.6s infinite alternate; }
    @keyframes bounce { to { transform: translateY(-4px); opacity: 0.3; } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .markdown-container code { background: var(--input-bg); padding: 2px 4px; border-radius: 4px; }
  `;

  return (
    <>
      <style>{themeStyles}</style>
      
      <nav className="navbar">
        <div className="nav-content">
          <a href="#" className="nav-brand">Chat N</a>
          <div className="nav-right-section">
            <span className="nav-link" style={{color: 'var(--text-muted)', cursor: 'pointer'}}>About</span>
            
            {/* THEME TOGGLE BUTTON */}
            <button 
                className="theme-toggle" 
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>
              )}
            </button>

            <button style={{
                background: darkMode ? 'white' : 'black',
                color: darkMode ? 'black' : 'white',
                padding: '8px 20px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer'
            }}>Sign In</button>
          </div>
        </div>
      </nav>

      <div className="app-wrapper">
        <div className="glass-card">
          <div className="chat-container" ref={scrollRef} style={{flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {messages.length === 0 && (
              <h1 style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '20%', fontSize: '1.5rem' }}>
                Start a conversation <br/> <span style={{fontSize: '1rem', fontWeight: '400'}}>Your Personal AI Assistant</span>
              </h1>
            )}
            
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                <div style={{ fontSize: '0.65rem', opacity: 0.6, marginBottom: '8px', fontWeight: 'bold' }}>
                  {msg.role === 'user' ? 'YOU' : 'AI'}
                </div>
                {msg.role === 'ai' && <CopyButton text={msg.content} />}
                {msg.role === 'ai' && msg.isNew ? (
                  <TypingMessage text={msg.content} onComplete={() => { msg.isNew = false; }} />
                ) : (
                  <div className="markdown-container"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
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

          <div className="input-section" style={{background: 'var(--input-bg)', borderRadius: '20px', padding: '0.5rem', display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)'}}>
            <textarea
              className="custom-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows="1"
            />
            <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="send-btn" style={{background: 'var(--accent-primary)', border: 'none', width: '45px', height: '45px', borderRadius: '12px', cursor: 'pointer'}}>
              <svg viewBox="0 0 24 24" fill="black" width="20" height="20">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIContentGenerator;
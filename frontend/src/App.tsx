import { useEffect, useRef, useState} from "react"
import "./index.css"
import ReactMarkdown, { type Components } from 'react-markdown';

import remarkGfm from 'remark-gfm'; 

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';



declare global {
  interface Window {
    electronAPI: {
      sendButtonClick: (message: string) => void;
      startGenerateStream: (prompt: string) => void; // Changed to void as it's a one-way trigger
      onAiTextChunk: (callback: (chunk: string) => void) => () => void; // Returns a cleanup function
      onAiStreamEnd: (callback: () => void) => () => void; // Returns a cleanup function
      onAiStreamError: (callback: (errorMsg: string) => void) => () => void; // Returns a cleanup function
    };
  }
}



function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState<string | null>(null);
  const [isSuggestionShowing, setIsSuggestionShowing] = useState(false);
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if(inputRef.current){
      inputRef.current.focus()


    }
  },[])

  useEffect(() => {
    if (isSuggestionShowing) {
      window.resizeTo(600, 400);
    } 
  }, [isSuggestionShowing]);


  useEffect(() => {
    console.log(displayedText);
  },[displayedText])


  useEffect(() => {
    console.log(window.electronAPI);
    const cleanupChunkListener = window.electronAPI.onAiTextChunk((chunk) => {
      setDisplayedText((prev) => prev + chunk);
    });

    const cleanupEndListener = window.electronAPI.onAiStreamEnd(() => {
      setIsGenerating(false);
      console.log("AI Stream Ended.");
    });

    const cleanupErrorListener = window.electronAPI.onAiStreamError((errorMsg) => {
      setGenerationError(errorMsg);
      setIsGenerating(false);
      setDisplayedText(""); // Clear any partial text if an error occurs
      console.error("AI Stream Error:", errorMsg);
    });

    // Return cleanup functions
    return () => {
      cleanupChunkListener();
      cleanupEndListener();
      cleanupErrorListener();
    };
  }, []);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInput(inputValue);


    if (inputValue.trim().length > 0) {
      setDisplayedText("");
      setGenerationError(null);
      setIsGenerating(false); // Stop any ongoing generation if user types
  }


    setIsSuggestionShowing(inputValue.trim().length > 0);
  };
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSuggestionShowing(false);
      if (input && input.trim().length > 0 && !isGenerating) { // Prevent multiple generations
        setIsGenerating(true); // Start loading
        setDisplayedText(""); // Clear previous response
        setGenerationError(null); // Clear previous error
        
        // Start the streaming generation from the main process
        window.electronAPI.startGenerateStream(input);
        
        setInput(""); // Clear input field immediately
        if (inputRef.current) {
            inputRef.current.value = "";
        }
      }
    } else if (e.key === "Escape") {
      setIsSuggestionShowing(false);
      setDisplayedText(""); // Clear displayed text on escape
      setGenerationError(null); // Clear error on escape
      setIsGenerating(false); // Stop any ongoing generation
    }
  };

  const components: Components = {
    // @ts-ignore //Solve the type error
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={ dracula}
          language={match[1]}
          PreTag="div"
          // {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };


  return (
    <>
    <div className="search-container">
        <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7Z" fill="rgba(255,255,255,0.6)"/>
        </svg>
        <input 
            onKeyDown={handleKeyDown}
            ref={inputRef}
            onChange={handleInputChange}
            type="text" 
            className="search-input" 
            placeholder="Search AI models... (/g for Gemini, /gpt for GPT, /claude for Claude)"
            id="searchInput"
            />
        <div className="command-hint" id="commandHint">Ctrl+K</div>
    </div>

  { isSuggestionShowing && (
    <div className="suggestions" id="suggestions">
        <div className="suggestion-item" data-command="g">
            <div className="suggestion-command">/g</div>
            <div className="suggestion-description">Chat with Google Gemini</div>
        </div>
        <div className="suggestion-item" data-command="gpt">
            <div className="suggestion-command">/gpt</div>
            <div className="suggestion-description">Chat with OpenAI GPT</div>
        </div>
        <div className="suggestion-item" data-command="claude">
            <div className="suggestion-command">/claude</div>
            <div className="suggestion-description">Chat with Anthropic Claude</div>
        </div>
    </div>
  )}

{(isGenerating || displayedText.length > 0 || generationError) && (
        <div className="ai-response-container">
          {isGenerating && (
            <div className="loading-spinner"></div>
          )}
          {generationError ? (
            <p className="ai-text error-text" style={{ color: '#ff6b6b' }}>{generationError}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={components}
            >
              {displayedText}
            </ReactMarkdown>
          )}
        </div>
      )}
  </>
  )
}

export default App

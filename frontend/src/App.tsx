import { useEffect, useRef, useState} from "react"
import "./index.css"


declare global {
  interface Window {
    electronAPI : {
      sendButtonClick : (message : string) => void;
    }
  }
}
function App() {
  const inputRef = useRef<HTMLInputElement >(null);
  const [input, setInput] = useState<string | null>(null);
  const [isSuggestionShowing, setIsSuggestionShowing] = useState(false);

  useEffect(() => {
    if(inputRef.current){
      inputRef.current.focus()
    }
  },[])

  useEffect(() => {
    if (isSuggestionShowing) {
      window.resizeTo(600, 400);
    } else {
      window.resizeTo(600, 80);
    }
  }, [isSuggestionShowing]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInput(inputValue);


    setIsSuggestionShowing(inputValue.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSuggestionShowing(false);
      console.log(window);
      window.electronAPI.sendButtonClick("Hello I a clicked")
      console.log("Input submitted:", input);
    } else if (e.key === "Escape") {
      setIsSuggestionShowing(false);
      
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
  )

}
  </>
  )
}

export default App

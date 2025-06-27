✨ AI Searchbar: A Desktop AI Companion

A sleek, minimalistic desktop searchbar powered by Electron and React, featuring real-time AI text generation using Google's Gemini API. Access your AI assistant instantly with a global hotkey, get streamed responses, and enjoy beautifully highlighted code snippets.
🌟 Features

    Global Hotkey Activation: Instantly summon or dismiss the searchbar with Ctrl + K (or Cmd + K on macOS).

    AI-Powered Responses: Integrates with Google's Gemini 2.0 Flash model for intelligent text generation.

    Real-time Streaming: Experience AI responses appearing character-by-character, mimicking a true streaming conversation.

    Syntax Highlighting: Automatically formats and highlights code blocks in AI-generated responses for readability.

    Dynamic Window Resizing: The application window intelligently expands to show suggestions or AI responses and retracts to a compact searchbar when idle.

    Transparent & Always On Top: A discreet overlay that seamlessly integrates into your desktop workflow.

    Security Best Practices: IPC communication between Electron's main and renderer processes is handled securely using contextBridge.

    Environment Variable API Key: Safely manages your Gemini API key via environment variables.

🚀 Technologies Used

    Electron: For building cross-platform desktop applications with web technologies.

    React: Frontend framework for building the user interface.

    Google Generative AI SDK (@google/genai): For interacting with the Gemini API.

    TypeScript: For type-safe and robust code.

    react-markdown & remark-gfm: For parsing and rendering Markdown content.

    react-syntax-highlighter: For beautiful syntax highlighting of code blocks.

    electron-is-dev: Utility to determine if the app is running in development mode.

⚙️ Setup & Installation
Prerequisites

    Node.js (LTS version recommended)

    Yarn && bun

Steps

    Clone the repository:

    git clone git@github.com:rajgupta-ml/ai-seachbar.git # Replace with your repo URL
    cd ai-searchbar

    Install dependencies:
    Navigate to the root of the project and install both Electron and React dependencies.

    yarn install
    # If your React app is in a subfolder (e.g., 'frontend'), you might also need:
    # cd frontend
    # bun install
    # cd ..

    Set up your Gemini API Key:
    Obtain a Gemini API key from the Google AI Studio.
    It is crucial to set this as an environment variable for security.

        set the gemini key onto the .env file

        Using a .env file (for development convenience - requires dotenv):
        Create a file named .env in the root of your project:

        GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE

        Then, at the very top of your main.js, add: require('dotenv').config(); (Make sure dotenv is installed: npm install dotenv). Remember to add .env to your .gitignore!

    Linux Sandbox Fix (If you encounter errors like SUID sandbox helper binary...):
    If you're on Linux and see an error about chrome-sandbox permissions, run these commands:

    sudo chown root node_modules/electron/dist/chrome-sandbox
    sudo chmod 4755 node_modules/electron/dist/chrome-sandbox

    (You might need to replace node_modules/electron/dist/chrome-sandbox with the exact path mentioned in your error.)

🚀 Running the Application
Development Mode

To run the application in development mode (with hot-reloading for React):

    Build React app once:

    npm run build

    open two separate terminal windows:

        In the first: bun run dev (to start the React development server)

        In the second (after React server is up): yarn start (to launch the Electron app)

Production Build

To package your application for distribution, you'll typically use electron-builder or electron-packager. These steps are not included in the provided code but are standard for Electron projects.
💡 Usage

    Launch the App: Run the app in development or production mode.

    Activate: Press Ctrl + K (or Cmd + K on macOS) to show the searchbar.

    Type your query: Enter your question or prompt for the AI.

    Get AI Response: Press Enter. The AI will start streaming its response directly into the window.

    Dismiss: Press Ctrl + K again or click outside the window to hide it.

    Clear: Press Escape while typing or after a response to clear the input and hide the response.

📂 Project Structure (Key Files)

    main.js: The Electron Main Process. Manages windows, global shortcuts, and handles secure IPC with the renderer. This is where AI API calls are made.

    preload.js: The Electron Preload Script. A secure bridge that exposes specific, safe Node.js/Electron APIs to the React frontend.

    src/App.tsx: The main React component for the user interface. Handles user input, displays AI responses, and manages UI state.

    src/index.css: Styles for the React components and overall app appearance.

    package.json: Defines project metadata, scripts, and dependencies for both Electron and React.

👋 Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.
📄 License

TODO : 
    [] : Better syntax highligthing
    [] : Support for multiple AI's
    [] : Direct search
    [] : switch ai using bangs
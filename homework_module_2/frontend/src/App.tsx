import { useState } from 'react'
import './App.css'
import CodeEditor from './CodeEditor'

function App() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello World");');

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    if (e.target.value === 'python') {
      setCode('# Write your code here\nprint("Hello World")');
    } else {
      setCode('// Write your code here\nconsole.log("Hello World");');
    }
  };

  const runCode = async () => {
    if (language !== 'python') {
      setOutput('Execution is only supported for Python in this demo.');
      return;
    }

    setIsRunning(true);
    setOutput('Running...');

    try {
      let py = pyodide;
      if (!py) {
        setOutput('Loading Python environment...');
        // @ts-ignore
        py = await window.loadPyodide();
        setPyodide(py);
      }

      // Redirect stdout to capture print statements
      py.setStdout({ batched: (msg: string) => setOutput((prev) => prev + msg + '\n') });

      // Clear previous output before running
      setOutput('');

      await py.runPythonAsync(code);
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Collaborative Code Editor</h1>

      <div className="controls">
        <select value={language} onChange={handleLanguageChange}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
        <button onClick={runCode} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>

      <div className="editor-layout" style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <CodeEditor
            language={language}
            code={code}
            onChange={(value) => setCode(value || '')}
          />
        </div>
        <div className="output-pane" style={{ flex: 1, border: '1px solid #ccc', borderRadius: '4px', padding: '10px', backgroundColor: '#1e1e1e', color: '#fff', textAlign: 'left', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          <h3>Output</h3>
          <div id="output">{output}</div>
        </div>
      </div>
    </div>
  )
}

export default App

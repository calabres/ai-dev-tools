import Editor from '@monaco-editor/react';

interface CodeEditorProps {
    language: string;
    code: string;
    onChange: (value: string | undefined) => void;
}

const CodeEditor = ({ language, code, onChange }: CodeEditorProps) => {
    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
            <Editor
                height="60vh"
                language={language}
                value={code}
                theme="vs-dark"
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                }}
            />
        </div>
    );
};

export default CodeEditor;

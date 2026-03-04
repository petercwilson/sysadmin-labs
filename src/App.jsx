import React, { useState, useEffect } from 'react';

export default function App() {
  const [commands, setCommands] = useState(() => {
    const saved = localStorage.getItem('sysadmin-arsenal');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [formData, setFormData] = useState({ task: '', category: '', cli: '', notes: '' });
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    localStorage.setItem('sysadmin-arsenal', JSON.stringify(commands));
  }, [commands]);

  const handleCreateCommand = (e) => {
    e.preventDefault();
    if (!formData.task || !formData.cli) return;

    const newCmd = {
      id: crypto.randomUUID(),
      ...formData,
    };

    setCommands([newCmd, ...commands]);
    setFormData({ task: '', category: '', cli: '', notes: '' });
  };

  const handleDeleteCommand = (id) => {
    setCommands(commands.filter(cmd => cmd.id !== id));
  };

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-mono p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-8 border-b border-cyan-800 pb-4">
        <h1 className="text-3xl font-bold text-cyan-400">~/Sysadmin_Arsenal</h1>
        <p className="text-gray-500 text-sm mt-1">Linux Command Reference & Study Tracker</p>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg h-fit">
          <h2 className="text-xl text-green-400 mb-4">&gt; Log New Command</h2>
          <form onSubmit={handleCreateCommand} className="space-y-4">
            <div>
              <label className="block text-xs text-cyan-500 mb-1">SCENARIO / TASK</label>
              <input 
                type="text" 
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-cyan-500"
                value={formData.task}
                onChange={(e) => setFormData({...formData, task: e.target.value})}
                placeholder="e.g., Find large files taking up disk space"
              />
            </div>
            <div>
              <label className="block text-xs text-cyan-500 mb-1">CATEGORY</label>
              <select 
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-cyan-500"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select Domain...</option>
                <option value="User Management">User Management</option>
                <option value="File Permissions">File Permissions</option>
                <option value="Networking">Networking</option>
                <option value="Process Management">Process Management</option>
                <option value="System Logs">System Logs</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-cyan-500 mb-1">LINUX COMMAND</label>
              <textarea 
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-green-400 font-mono focus:outline-none focus:border-green-500 h-20"
                value={formData.cli}
                onChange={(e) => setFormData({...formData, cli: e.target.value})}
                placeholder="find / -type f -size +500M"
              />
            </div>
            <div>
              <label className="block text-xs text-cyan-500 mb-1">NOTES / FLAGS</label>
              <textarea 
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-cyan-500 h-16"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Remember to run with sudo..."
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-cyan-800 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Save to Arsenal
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl text-green-400 mb-4">&gt; Saved Commands ({commands.length})</h2>
          {commands.length === 0 ? (
            <div className="text-gray-500 italic">Arsenal is empty. Start logging commands...</div>
          ) : (
            commands.map((cmd) => (
              <div key={cmd.id} className="bg-gray-800 border border-gray-700 rounded-lg p-5 flex flex-col hover:border-cyan-800 transition duration-200">
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-100">{cmd.task}</h3>
                    <span className="text-xs px-2 py-1 mt-2 inline-block bg-gray-900 text-cyan-400 rounded-full border border-cyan-900">
                      {cmd.category || 'Uncategorized'}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteCommand(cmd.id)}
                    className="text-red-400 hover:text-red-300 transition duration-200"
                    title="Delete Command"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Simulated Terminal Window for Command */}
                <div className="bg-black rounded-md p-3 mb-3 relative group">
                  <div className="flex justify-between items-center mb-1 border-b border-gray-800 pb-1">
                    <span className="text-gray-500 text-xs">Terminal</span>
                    <button 
                      onClick={() => copyToClipboard(cmd.id, cmd.cli)}
                      className="text-gray-400 hover:text-white text-xs bg-gray-800 px-2 py-1 rounded transition"
                    >
                      {copiedId === cmd.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <code className="text-green-400 font-mono text-sm whitespace-pre-wrap break-all">
                    $ {cmd.cli}
                  </code>
                </div>

                {cmd.notes && (
                  <p className="text-sm text-gray-400 border-l-2 border-cyan-800 pl-3">
                    {cmd.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
import React, { useState, useEffect } from 'react';

export default function App() {
  // Initialize state from local storage to keep data persistent in the browser
  const [labs, setLabs] = useState(() => {
    const savedLabs = localStorage.getItem('cyber-lab-modules');
    return savedLabs ? JSON.parse(savedLabs) : [];
  });
  
  const [formData, setFormData] = useState({ title: '', category: '', description: '' });

  // Save to local storage whenever the labs array changes
  useEffect(() => {
    localStorage.setItem('cyber-lab-modules', JSON.stringify(labs));
  }, [labs]);

  const handleCreateLab = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;

    const newLab = {
      id: crypto.randomUUID(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    setLabs([newLab, ...labs]);
    setFormData({ title: '', category: '', description: '' });
  };

  const handleDeleteLab = (id) => {
    setLabs(labs.filter(lab => lab.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-mono p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 border-b border-cyan-800 pb-4">
        <h1 className="text-3xl font-bold text-cyan-400">~/Cyber-Lab</h1>
        <p className="text-gray-500 text-sm mt-1">Interactive Linux & Networking Modules</p>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="md:col-span-1 bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
          <h2 className="text-xl text-green-400 mb-4">&gt; Add New Module</h2>
          <form onSubmit={handleCreateLab} className="space-y-4">
            <div>
              <label className="block text-xs text-cyan-500 mb-1">TITLE</label>
              <input 
                type="text" 
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-cyan-500"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., UFW Firewall Setup"
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
                <option value="Networking">Networking</option>
                <option value="Security">Security</option>
                <option value="File System">File System</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-cyan-500 mb-1">DESCRIPTION</label>
              <textarea 
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-cyan-500 h-24"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Module objectives..."
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-cyan-800 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Deploy Module
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl text-green-400 mb-4">&gt; Active Modules ({labs.length})</h2>
          {labs.length === 0 ? (
            <div className="text-gray-500 italic">No modules deployed yet...</div>
          ) : (
            labs.map((lab) => (
              <div key={lab.id} className="bg-gray-800 border border-gray-700 rounded-lg p-5 flex justify-between items-start hover:border-cyan-800 transition duration-200">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-100">{lab.title}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-900 text-cyan-400 rounded-full border border-cyan-900">
                      {lab.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{lab.description}</p>
                </div>
                <button 
                  onClick={() => handleDeleteLab(lab.id)}
                  className="text-red-400 hover:text-red-300 transition duration-200 ml-4"
                  title="Remove Module"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

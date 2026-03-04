import React, { useState, useEffect } from 'react';

// Pre-loaded teaching modules
const trainingModules = [
  {
    id: 'tm-1',
    title: 'Mastering File Permissions',
    category: 'Security',
    description: 'Understand how to read and modify Linux file permissions (rwx). Crucial for keeping systems secure.',
    lessons: [
      { 
        concept: 'View Permissions', 
        cli: 'ls -la', 
        explanation: 'Displays detailed file info, including the 10-character permission string (e.g., -rwxr-xr--). The first character is the type (d for directory, - for file), followed by 3 sets of read(r), write(w), and execute(x) permissions for the User, Group, and Others.' 
      },
      { 
        concept: 'Change Mode (Numeric)', 
        cli: 'chmod 755 script.sh', 
        explanation: 'Sets permissions using octal numbers. Owner gets 7 (read 4 + write 2 + execute 1). Group and Others get 5 (read 4 + execute 1). This is standard for executable scripts.' 
      },
      { 
        concept: 'Change Ownership', 
        cli: 'sudo chown root:root config.txt', 
        explanation: 'Changes the user and group ownership of a file. The format is user:group. You will frequently use this when configuring web servers or system services.' 
      }
    ]
  },
  {
    id: 'tm-2',
    title: 'Network Diagnostics',
    category: 'Networking',
    description: 'Essential commands for troubleshooting connectivity and inspecting routing.',
    lessons: [
      { 
        concept: 'Check IP & Interfaces', 
        cli: 'ip a', 
        explanation: 'Replaces the deprecated "ifconfig". Shows all network interfaces (like eth0, wlan0, or local loopback lo) and their assigned IPv4/IPv6 addresses.' 
      },
      { 
        concept: 'View Active Listening Ports', 
        cli: 'ss -tulpn', 
        explanation: 'Lists all listening TCP/UDP ports and the processes using them. Essential for verifying if a service (like an SSH or Web server) is actually running and accepting connections.' 
      },
      { 
        concept: 'Trace Network Path', 
        cli: 'traceroute 8.8.8.8', 
        explanation: 'Maps the journey your packets take to reach a destination, showing every router hop along the way. Great for pinpointing where a connection is dropping.' 
      }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('arsenal'); // 'arsenal' | 'bootcamp'
  
  const [commands, setCommands] = useState(() => {
    const saved = localStorage.getItem('sysadmin-arsenal');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [formData, setFormData] = useState({ task: '', category: '', cli: '', notes: '' });
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Function to save a bootcamp lesson directly to your personal arsenal
  const saveToArsenal = (lesson, category) => {
    const newCmd = {
      id: crypto.randomUUID(),
      task: lesson.concept,
      category: category,
      cli: lesson.cli,
      notes: lesson.explanation
    };
    setCommands([newCmd, ...commands]);
    alert(`Added "${lesson.concept}" to your Arsenal!`);
  };

  const filteredCommands = commands.filter(cmd => {
    const searchLower = searchQuery.toLowerCase();
    return (
      cmd.task.toLowerCase().includes(searchLower) ||
      cmd.cli.toLowerCase().includes(searchLower) ||
      (cmd.category && cmd.category.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-mono p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-6 border-b border-cyan-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">~/Cyber-Lab</h1>
          <p className="text-gray-500 text-sm mt-1">Linux Command Reference & Study Tracker</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('arsenal')}
            className={`px-4 py-2 rounded-t-lg transition-colors duration-200 border-t border-l border-r ${activeTab === 'arsenal' ? 'bg-gray-800 border-cyan-800 text-cyan-400' : 'bg-gray-900 border-gray-700 text-gray-500 hover:text-gray-300'}`}
          >
            My Arsenal
          </button>
          <button 
            onClick={() => setActiveTab('bootcamp')}
            className={`px-4 py-2 rounded-t-lg transition-colors duration-200 border-t border-l border-r ${activeTab === 'bootcamp' ? 'bg-gray-800 border-cyan-800 text-cyan-400' : 'bg-gray-900 border-gray-700 text-gray-500 hover:text-gray-300'}`}
          >
            Bootcamp
          </button>
        </div>
      </header>

      {/* ARSENAL VIEW */}
      {activeTab === 'arsenal' && (
        <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  placeholder="e.g., Find large files"
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

          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
              <h2 className="text-xl text-green-400">&gt; Saved Commands ({filteredCommands.length})</h2>
              <div className="w-full sm:w-64 relative">
                <input 
                  type="text"
                  className="w-full bg-gray-900 border border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
                  placeholder="Search commands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2 text-gray-500 hover:text-gray-300">✕</button>
                )}
              </div>
            </div>

            {commands.length === 0 ? (
              <div className="text-gray-500 italic">Arsenal is empty. Go to the Bootcamp to learn some commands!</div>
            ) : filteredCommands.length === 0 ? (
              <div className="text-gray-500 italic">No commands match your search.</div>
            ) : (
              filteredCommands.
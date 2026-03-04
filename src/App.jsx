import React, { useState, useEffect } from 'react';

// Pre-loaded teaching modules
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
  },
  {
    id: 'tm-3',
    title: 'Web Server Provisioning (Nginx)',
    category: 'Web Services',
    description: 'Deploy and secure a high-performance Nginx web server. Essential for hosting websites, reverse proxying, and load balancing.',
    lessons: [
      { 
        concept: 'Install Nginx', 
        cli: 'sudo apt update && sudo apt install nginx -y', 
        explanation: 'Always update your package lists before installing. The -y flag automatically answers "yes" to the installation prompts.' 
      },
      { 
        concept: 'Enable & Start Service', 
        cli: 'sudo systemctl enable --now nginx', 
        explanation: 'Systemd is the initialization system for modern Linux. This command starts the Nginx service immediately AND ensures it boots up automatically if the server restarts.' 
      },
      { 
        concept: 'Configure Firewall (UFW)', 
        cli: "sudo ufw allow 'Nginx Full'", 
        explanation: 'Opens ports 80 (HTTP) and 443 (HTTPS) in the Uncomplicated Firewall so outside traffic can actually reach your web server.' 
      },
      { 
        concept: 'Verify Service Status', 
        cli: 'systemctl status nginx', 
        explanation: 'Checks if the service is actively running and displays recent log outputs. Press "q" to exit this view in the terminal.' 
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
          <h1 className="text-3xl font-bold text-cyan-400">~/Sysadmin Labs</h1>
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
              filteredCommands.map((cmd) => (
                <div key={cmd.id} className="bg-gray-800 border border-gray-700 rounded-lg p-5 flex flex-col hover:border-cyan-800 transition duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-100">{cmd.task}</h3>
                      <span className="text-xs px-2 py-1 mt-2 inline-block bg-gray-900 text-cyan-400 rounded-full border border-cyan-900">
                        {cmd.category || 'Uncategorized'}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteCommand(cmd.id)} className="text-red-400 hover:text-red-300 transition duration-200" title="Delete Command">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                  <div className="bg-black rounded-md p-3 mb-3 relative group">
                    <div className="flex justify-between items-center mb-1 border-b border-gray-800 pb-1">
                      <span className="text-gray-500 text-xs">Terminal</span>
                      <button onClick={() => copyToClipboard(cmd.id, cmd.cli)} className="text-gray-400 hover:text-white text-xs bg-gray-800 px-2 py-1 rounded transition">
                        {copiedId === cmd.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <code className="text-green-400 font-mono text-sm whitespace-pre-wrap break-all">$ {cmd.cli}</code>
                  </div>
                  {cmd.notes && <p className="text-sm text-gray-400 border-l-2 border-cyan-800 pl-3">{cmd.notes}</p>}
                </div>
              ))
            )}
          </div>
        </main>
      )}

      {/* BOOTCAMP VIEW */}
      {activeTab === 'bootcamp' && (
        <main className="w-full max-w-5xl space-y-8">
          <div className="bg-cyan-900 bg-opacity-20 border border-cyan-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Welcome to the Bootcamp</h2>
            <p className="text-gray-300">Review the modules below to learn essential Sysadmin skills. When you find a command you want to remember, click "Add to Arsenal" to save it to your personal tracker.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingModules.map((module) => (
              <div key={module.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-900 p-4 border-b border-gray-700">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xl font-bold text-gray-100">{module.title}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-800 text-green-400 rounded border border-green-900">{module.category}</span>
                  </div>
                  <p className="text-sm text-gray-400">{module.description}</p>
                </div>
                
                <div className="p-4 space-y-6">
                  {module.lessons.map((lesson, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-md font-semibold text-cyan-300">{lesson.concept}</h4>
                        <button 
                          onClick={() => saveToArsenal(lesson, module.category)}
                          className="text-xs bg-cyan-800 hover:bg-cyan-700 text-white px-2 py-1 rounded transition"
                        >
                          + Add to Arsenal
                        </button>
                      </div>
                      <div className="bg-black p-2 rounded text-green-400 font-mono text-sm">
                        $ {lesson.cli}
                      </div>
                      <p className="text-sm text-gray-400">{lesson.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

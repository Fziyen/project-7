import { useState } from 'react';
import { Sun, Moon, Plus, QrCode, LayoutGrid, Search } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useQRCodes } from './hooks/useQRCodes';
import { QRCodeForm } from './components/QRCodeForm';
import { QRCodeCard } from './components/QRCodeCard';
import { QRCodeConfig } from './types';

type View = 'list' | 'create' | 'edit';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { codes, saveCode, deleteCode, duplicateCode, getCode } = useQRCodes();
  const [view, setView] = useState<View>('list');
  const [editId, setEditId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (id: string) => {
    setEditId(id);
    setView('edit');
  };

  const handleCreateNew = () => {
    setEditId(null);
    setView('create');
  };

  const handleSave = (config: Partial<QRCodeConfig> & { name: string; data: string }) => {
    saveCode(config);
    setView('list');
    setEditId(null);
  };

  const handleCancel = () => {
    setView('list');
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this QR code?')) {
      deleteCode(id);
    }
  };

  const filteredCodes = codes.filter(
    code =>
      code.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.data.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const editConfig = editId ? getCode(editId) : undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <QrCode size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">QR Studio</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Create & Manage QR Codes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun size={20} className="text-yellow-500" />
                ) : (
                  <Moon size={20} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {view === 'list' && (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search QR codes..."
                  className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2">
                <Plus size={18} />
                <span className="hidden sm:inline">Create QR Code</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <LayoutGrid size={16} />
              <span>{codes.length} QR code{codes.length !== 1 ? 's' : ''}</span>
            </div>

            {filteredCodes.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                {codes.length === 0 ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <QrCode size={32} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No QR codes yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Create your first QR code to get started
                    </p>
                    <button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all">
                      Create QR Code
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Search size={32} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try a different search term
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCodes.map(code => (
                  <QRCodeCard
                    key={code.id}
                    code={code}
                    onEdit={handleEdit}
                    onDuplicate={duplicateCode}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {(view === 'create' || view === 'edit') && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {view === 'edit' ? 'Edit QR Code' : 'Create QR Code'}
              </h2>
              <button
                onClick={handleCancel}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium px-4 py-2 rounded-lg transition-all text-sm"
              >
                Back to List
              </button>
            </div>
            <QRCodeForm
              initialConfig={editConfig}
              onSave={handleSave}
              onCancel={handleCancel}
              isEditing={view === 'edit'}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            QR Studio - Your QR codes are saved locally in your browser
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

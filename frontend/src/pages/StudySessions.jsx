import { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';
import {
  ClockIcon,
  PlusIcon,
  CalendarIcon,
  FireIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const CATEGORIES = ['DSA', 'APTITUDE', 'OS', 'DBMS', 'CN', 'TECHNICAL', 'SOFT_SKILLS', 'OTHER'];

const StudySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: 'DSA',
    topic: '',
    duration: 30,
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await progressAPI.getSessions();
      setSessions(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const logSession = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await progressAPI.logSession({
        category: form.category,
        topic: form.topic,
        duration: parseInt(form.duration),
        notes: form.notes,
        date: form.date,
      });
      setShowForm(false);
      setForm({
        category: 'DSA',
        topic: '',
        duration: 30,
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });
      fetchSessions();
    } catch (e) { alert('Failed to log session'); }
    finally { setSubmitting(false); }
  };

  // Calculate stats
  const totalHours = sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60;
  const thisWeekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });
  const thisWeekHours = thisWeekSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60;

  // Group by category
  const byCategory = sessions.reduce((acc, s) => {
    const cat = s.category || 'OTHER';
    acc[cat] = (acc[cat] || 0) + (s.duration || 0);
    return acc;
  }, {});

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Sessions</h1>
          <p className="text-gray-600">Track your study time and progress</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary flex items-center space-x-1">
          <PlusIcon className="w-4 h-4" /><span>Log Session</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <ClockIcon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
          <p className="text-xs text-gray-500">Total Study Time</p>
        </div>
        <div className="card text-center">
          <CalendarIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{thisWeekHours.toFixed(1)}h</p>
          <p className="text-xs text-gray-500">This Week</p>
        </div>
        <div className="card text-center">
          <BookOpenIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
          <p className="text-xs text-gray-500">Total Sessions</p>
        </div>
        <div className="card text-center">
          <FireIcon className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{Object.keys(byCategory).length}</p>
          <p className="text-xs text-gray-500">Categories Studied</p>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(byCategory).length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-sm mb-4">Time by Category</h2>
          <div className="space-y-3">
            {Object.entries(byCategory).map(([cat, mins]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{cat}</span>
                  <span className="font-medium text-primary-600">{(mins / 60).toFixed(1)}h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${Math.min(100, (mins / (totalHours * 60)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Session Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Log Study Session</h2>
              <button onClick={() => setShowForm(false)}><XMarkIcon className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={logSession} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="input"
                  required
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic (optional)</label>
                <input
                  type="text"
                  value={form.topic}
                  onChange={e => setForm({ ...form, topic: e.target.value })}
                  className="input"
                  placeholder="e.g. Arrays, Binary Trees"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="input h-20 resize-none"
                  placeholder="What did you learn?"
                />
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                  {submitting ? 'Saving...' : 'Log Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Recent Sessions</h2>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No study sessions logged yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 20).map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <BookOpenIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{s.category?.replace('_', ' ')}</p>
                    {s.topic && <p className="text-sm text-gray-500">{s.topic}</p>}
                    <p className="text-xs text-gray-400">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">{s.duration} min</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySessions;

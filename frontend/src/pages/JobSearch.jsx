import { useState, useEffect } from 'react';
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  PlusIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    company: '',
    role: '',
    location: '',
    package: '',
    status: 'APPLIED',
    applyDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Sample job recommendations (in production, integrate with job APIs)
  const recommendedJobs = [
    { company: 'Google', role: 'Software Engineer', location: 'Bangalore', package: '25-40 LPA', skills: ['DSA', 'System Design', 'Python'] },
    { company: 'Amazon', role: 'SDE I', location: 'Hyderabad', package: '18-28 LPA', skills: ['DSA', 'Leadership Principles', 'Java'] },
    { company: 'Microsoft', role: 'Software Engineer', location: 'Bangalore', package: '20-35 LPA', skills: ['C#', 'Cloud', 'DSA'] },
    { company: 'Meta', role: 'Software Engineer', location: 'Bangalore', package: '22-38 LPA', skills: ['DSA', 'React', 'System Design'] },
    { company: 'Flipkart', role: 'Software Engineer', location: 'Bangalore', package: '15-25 LPA', skills: ['DSA', 'Full Stack', 'Java'] },
    { company: 'Goldman Sachs', role: 'Analyst', location: 'Bangalore', package: '18-24 LPA', skills: ['DSA', 'Aptitude', 'Python'] },
  ];

  useEffect(() => {
    // Load saved jobs from localStorage (simulated)
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setJobs(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const saveJob = (job) => {
    const newJobs = [...jobs, { ...job, id: Date.now(), status: 'SAVED', savedAt: new Date().toISOString() }];
    setJobs(newJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newJobs));
  };

  const addApplication = (e) => {
    e.preventDefault();
    const newJob = {
      ...form,
      id: Date.now(),
      package: form.package ? `${form.package} LPA` : '',
      appliedAt: form.applyDate,
    };
    const newJobs = [...jobs, newJob];
    setJobs(newJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newJobs));
    setShowAdd(false);
    setForm({
      company: '',
      role: '',
      location: '',
      package: '',
      status: 'APPLIED',
      applyDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const updateStatus = (jobId, newStatus) => {
    const newJobs = jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j);
    setJobs(newJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newJobs));
  };

  const deleteJob = (jobId) => {
    const newJobs = jobs.filter(j => j.id !== jobId);
    setJobs(newJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newJobs));
  };

  const statusColors = {
    SAVED: 'bg-blue-100 text-blue-700',
    APPLIED: 'bg-yellow-100 text-yellow-700',
    INTERVIEW: 'bg-purple-100 text-purple-700',
    OFFER: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-600" /></div>;

  const savedJobs = jobs.filter(j => j.status === 'SAVED');
  const applications = jobs.filter(j => j.status !== 'SAVED');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Search</h1>
          <p className="text-gray-600">Track job applications and find new opportunities</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary flex items-center space-x-1">
          <PlusIcon className="w-4 h-4" /><span>Add Application</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-900">{applications.filter(j => j.status === 'APPLIED').length}</p>
          <p className="text-xs text-gray-500">Applied</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-900">{applications.filter(j => j.status === 'INTERVIEW').length}</p>
          <p className="text-xs text-gray-500">Interview</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-900">{applications.filter(j => j.status === 'OFFER').length}</p>
          <p className="text-xs text-gray-500">Offers</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-900">{applications.filter(j => j.status === 'REJECTED').length}</p>
          <p className="text-xs text-gray-500">Rejected</p>
        </div>
      </div>

      {/* Add Application Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Track New Application</h2>
              <button onClick={() => setShowAdd(false)}><XMarkIcon className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={addApplication} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package (LPA)</label>
                  <input type="text" value={form.package} onChange={e => setForm({...form, package: e.target.value})} className="input" placeholder="e.g. 15-20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input">
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apply Date</label>
                <input type="date" value={form.applyDate} onChange={e => setForm({...form, applyDate: e.target.value})} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="input h-20" placeholder="Any notes..." />
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowAdd(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Your Applications */}
      {applications.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Your Applications</h2>
          <div className="space-y-3">
            {applications.map(job => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <BriefcaseIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{job.role} at {job.company}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {job.location && <span className="flex items-center"><MapPinIcon className="w-3 h-3 mr-1" />{job.location}</span>}
                      {job.package && <span className="flex items-center"><CurrencyRupeeIcon className="w-3 h-3 mr-1" />{job.package}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <select value={job.status} onChange={(e) => updateStatus(job.id, e.target.value)} className="text-sm border rounded px-2 py-1">
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <button onClick={() => deleteJob(job.id)} className="text-red-500 hover:text-red-700"><XMarkIcon className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Jobs */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Recommended Jobs</h2>
        <p className="text-sm text-gray-500 mb-4">Based on your profile and current market trends</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedJobs.map((job, i) => (
            <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{job.role}</p>
                  <p className="text-sm text-gray-600 flex items-center"><BuildingOfficeIcon className="w-4 h-4 mr-1" />{job.company}</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <span className="flex items-center mr-3"><MapPinIcon className="w-3 h-3 mr-1" />{job.location}</span>
                <span className="flex items-center"><CurrencyRupeeIcon className="w-3 h-3 mr-1" />{job.package}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {job.skills.map((skill, si) => (
                  <span key={si} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded">{skill}</span>
                ))}
              </div>
              {savedJobs.find(j => j.company === job.company && j.role === job.role) ? (
                <button disabled className="btn btn-secondary w-full text-sm flex items-center justify-center">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />Saved
                </button>
              ) : (
                <button onClick={() => saveJob(job)} className="btn btn-primary w-full text-sm">Save Job</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;

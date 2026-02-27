import { useState, useEffect } from 'react';
import { nlpAPI, progressAPI } from '../services/api';
import {
  SparklesIcon,
  LightBulbIcon,
  ChartBarIcon,
  AcademicCapIcon,
  FireIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const AIInsights = () => {
  const [loading, setLoading] = useState(true);
  const [weakAreas, setWeakAreas] = useState(null);
  const [progress, setProgress] = useState(null);
  const [company, setCompany] = useState('');
  const [companyTips, setCompanyTips] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [planForm, setPlanForm] = useState({ goal: '', level: 'INTERMEDIATE', hoursPerWeek: 10 });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wa, p] = await Promise.all([
        nlpAPI.analyzeWeakAreas().catch(() => null),
        progressAPI.getProgress().catch(() => null)
      ]);
      setWeakAreas(wa);
      setProgress(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const getCompanyTips = async () => {
    if (!company.trim()) return;
    try {
      const tips = await nlpAPI.getCompanyPrepTips(company, 'Software Engineer');
      setCompanyTips(tips);
    } catch (e) { alert('Failed to get tips'); }
  };

  const generateStudyPlan = async () => {
    if (!planForm.goal.trim()) return;
    try {
      const plan = await nlpAPI.generateStudyPlan(planForm.goal, planForm.level, planForm.hoursPerWeek);
      setStudyPlan(plan);
    } catch (e) { alert('Failed to generate plan'); }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <SparklesIcon className="w-7 h-7 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
      </div>
      <p className="text-gray-600">Get personalized AI-powered recommendations for your placement preparation</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <AcademicCapIcon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{progress?.overallProgress || 0}%</p>
          <p className="text-xs text-gray-500">Overall Progress</p>
        </div>
        <div className="card text-center">
          <ChartBarIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{progress?.totalStudyHours || 0}h</p>
          <p className="text-xs text-gray-500">Study Hours</p>
        </div>
        <div className="card text-center">
          <FireIcon className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{progress?.currentStreak || 0}</p>
          <p className="text-xs text-gray-500">Day Streak</p>
        </div>
        <div className="card text-center">
          <CheckCircleIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{progress?.quizzesCompleted || 0}</p>
          <p className="text-xs text-gray-500">Quizzes Taken</p>
        </div>
      </div>

      {/* Weak Areas Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold">Weak Areas Analysis</h2>
          </div>
          
          {weakAreas ? (
            <div className="space-y-4">
              {weakAreas.weakAreas?.length > 0 ? (
                <>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-800 mb-2">🔴 Areas Need Improvement</p>
                    <div className="flex flex-wrap gap-2">
                      {weakAreas.weakAreas.map((area, i) => (
                        <span key={i} className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">{area}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-800 mb-2">🟢 Strong Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {weakAreas.strongAreas?.map((area, i) => (
                        <span key={i} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">{area}</span>
                      ))}
                    </div>
                  </div>

                  {weakAreas.recommendations?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">📋 Recommendations</p>
                      <ul className="space-y-2">
                        {weakAreas.recommendations.slice(0, 5).map((rec, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-primary-500 mr-2">→</span>{rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircleIcon className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p>Great job! No weak areas identified yet.</p>
                  <p className="text-sm">Keep taking quizzes to get analysis</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <LightBulbIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p>Take some quizzes to get AI-powered analysis</p>
            </div>
          )}
        </div>

        {/* Company Tips */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <LightBulbIcon className="w-5 h-5 text-yellow-500" />
            <h2 className="font-semibold">Company-Specific Prep Tips</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Enter company name (e.g., Google, Amazon)"
                className="input flex-1"
              />
              <button onClick={getCompanyTips} className="btn btn-primary">
                Get Tips
              </button>
            </div>

            {companyTips && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">🎯 Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {companyTips.focusAreas?.map((area, i) => (
                      <span key={i} className="bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full">{area}</span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">❓ Common Questions</p>
                  <ul className="space-y-1">
                    {companyTips.commonQuestions?.map((q, i) => (
                      <li key={i} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{q}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">📚 Resources</p>
                  <div className="flex flex-wrap gap-2">
                    {companyTips.preparationResources?.map((r, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personalized Study Plan */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
          <h2 className="font-semibold">Generate Personalized Study Plan</h2>
        </div>

        {!studyPlan ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                value={planForm.goal}
                onChange={e => setPlanForm({ ...planForm, goal: e.target.value })}
                placeholder="Your goal (e.g., Software Engineer, Data Analyst)"
                className="input w-full"
              />
            </div>
            <div>
              <select
                value={planForm.level}
                onChange={e => setPlanForm({ ...planForm, level: e.target.value })}
                className="input w-full"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <input
                type="number"
                value={planForm.hoursPerWeek}
                onChange={e => setPlanForm({ ...planForm, hoursPerWeek: parseInt(e.target.value) })}
                className="input w-full"
                min="1"
                max="40"
              />
              <button onClick={generateStudyPlan} className="btn btn-primary whitespace-nowrap">
                Generate Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">📅 {studyPlan.totalWeeks} Week Plan</p>
                <p className="text-sm text-gray-500">Est. {studyPlan.estimatedHours} total hours</p>
              </div>
              <button onClick={() => setStudyPlan(null)} className="text-sm text-primary-600 hover:underline">
                Generate New Plan
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {studyPlan.schedule?.slice(0, 8).map((week, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-primary-600">{week.week}</p>
                  <p className="text-sm font-medium text-gray-800">{week.focus}</p>
                  <p className="text-xs text-gray-500 mt-1">{week.tasks}</p>
                  <p className="text-xs text-green-600 mt-2">✓ {week.milestone}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Progress */}
      {progress?.categoryProgress && Object.keys(progress.categoryProgress).length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Category Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(progress.categoryProgress).map(([cat, val]) => (
              <div key={cat} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">{val}%</p>
                <p className="text-sm text-gray-600">{cat}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;

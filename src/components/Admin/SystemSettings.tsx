import React, { useState, useEffect } from 'react';
import { SystemSettings as SettingsType } from '../../types';
import { api } from '../../services/api';
import {
  Sliders,
  Cpu,
  ShieldCheck,
  Save,
  CheckCircle2,
  Key,
  UserCheck,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  Mail,
  User,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';

interface Props {
  settings: SettingsType;
  onSave: (updated: Partial<SettingsType>) => void;
}

export const SystemSettings: React.FC<Props> = ({ settings, onSave }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'credentials'>('pipeline');

  // AI Pipeline Settings State
  const [model, setModel] = useState(settings.aiModelName || 'gemini-3.6-flash');
  const [minConfidence, setMinConfidence] = useState(settings.minConfidenceThreshold || 85);
  const [semanticWeight, setSemanticWeight] = useState(settings.semanticWeight || 40);
  const [keywordWeight, setKeywordWeight] = useState(settings.keywordWeight || 30);
  const [conceptWeight, setConceptWeight] = useState(settings.conceptWeight || 20);
  const [grammarWeight, setGrammarWeight] = useState(settings.grammarWeight || 10);
  const [enableOCR, setEnableOCR] = useState(settings.enableOCR ?? true);
  const [enablePlagiarism, setEnablePlagiarism] = useState(settings.enablePlagiarismCheck ?? true);
  const [autoApprove, setAutoApprove] = useState(settings.autoApproveHighConfidence ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Admin Credentials State
  const [adminName, setAdminName] = useState('Dr. Sarah Jenkins');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminEmail, setAdminEmail] = useState('admin@university.edu');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassCurrent, setShowPassCurrent] = useState(false);
  const [showPassNew, setShowPassNew] = useState(false);
  const [credMessage, setCredMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [updatingCreds, setUpdatingCreds] = useState(false);

  const totalWeight = semanticWeight + keywordWeight + conceptWeight + grammarWeight;

  useEffect(() => {
    api
      .getAdminCredentials()
      .then((data) => {
        if (data) {
          setAdminName(data.name || 'Dr. Sarah Jenkins');
          setAdminUsername(data.username || 'admin');
          setAdminEmail(data.email || 'admin@university.edu');
        }
      })
      .catch(() => {});
  }, []);

  const handlePipelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      aiModelName: model,
      minConfidenceThreshold: minConfidence,
      semanticWeight,
      keywordWeight,
      conceptWeight,
      grammarWeight,
      enableOCR,
      enablePlagiarismCheck: enablePlagiarism,
      autoApproveHighConfidence: autoApprove,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUpdateAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setCredMessage({ type: 'error', text: 'New Password and Confirm Password do not match.' });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setCredMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setUpdatingCreds(true);
    try {
      const res = await api.updateAdminCredentials({
        name: adminName,
        username: adminUsername,
        email: adminEmail,
        currentPassword: currentPassword || undefined,
        password: newPassword || undefined,
      });

      setCredMessage({ type: 'success', text: res.message || 'Admin credentials updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setCredMessage({ type: 'error', text: err.message || 'Failed to update admin credentials' });
    } finally {
      setUpdatingCreds(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Navigation Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 liquid-glass p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Admin System Settings & Credentials</h2>
          <p className="text-xs text-slate-500">
            Configure Gemini AI evaluation weightages or update Administrator security login credentials
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'pipeline'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI & Pipeline Config</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'credentials'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Admin Credentials</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI & PIPELINE CONFIGURATION */}
      {activeTab === 'pipeline' && (
        <form onSubmit={handlePipelineSubmit} className="space-y-6">
          <div className="flex justify-between items-center liquid-glass p-4 rounded-xl">
            <span className="text-xs font-bold text-slate-700">Evaluation Parameters & Model Selection</span>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save AI Settings</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-3 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>System Settings & Weightage Metrics updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model & Thresholds Card */}
            <div className="liquid-glass rounded-2xl p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <Cpu className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Gemini AI Model & Confidence</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Active Gemini Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/80 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="gemini-3.6-flash">gemini-3.6-flash (Recommended Default)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Advanced STEM Reasoning)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                  <span>Minimum Confidence Threshold</span>
                  <span className="text-blue-600">{minConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="98"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer text-blue-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Papers evaluated below {minConfidence}% confidence are automatically flagged for manual faculty review.
                </p>
              </div>
            </div>

            {/* Evaluation Algorithm Weights Card */}
            <div className="liquid-glass rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900 text-base">Scoring Weight Distribution</h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    totalWeight === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Total: {totalWeight}%
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Semantic Similarity Weight</span>
                    <span>{semanticWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="70"
                    value={semanticWeight}
                    onChange={(e) => setSemanticWeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Keyword & Rubric Match Weight</span>
                    <span>{keywordWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={keywordWeight}
                    onChange={(e) => setKeywordWeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Concept Gap Detection Weight</span>
                    <span>{conceptWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={conceptWeight}
                    onChange={(e) => setConceptWeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Grammar & Technical Coherence</span>
                    <span>{grammarWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={grammarWeight}
                    onChange={(e) => setGrammarWeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Toggles Card */}
          <div className="liquid-glass rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">Pipeline Feature Flags</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl cursor-pointer border border-slate-200">
                <input
                  type="checkbox"
                  checked={enableOCR}
                  onChange={(e) => setEnableOCR(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Gemini Vision OCR</span>
                  <span className="text-[10px] text-slate-500">Transcribe handwritten images</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl cursor-pointer border border-slate-200">
                <input
                  type="checkbox"
                  checked={enablePlagiarism}
                  onChange={(e) => setEnablePlagiarism(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Anti-Plagiarism Index</span>
                  <span className="text-[10px] text-slate-500">Cross-student peer matrix</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl cursor-pointer border border-slate-200">
                <input
                  type="checkbox"
                  checked={autoApprove}
                  onChange={(e) => setAutoApprove(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Auto-Approve High Conf.</span>
                  <span className="text-[10px] text-slate-500">Publish scorecards directly</span>
                </div>
              </label>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: CHANGE ADMIN CREDENTIALS & SECURITY */}
      {activeTab === 'credentials' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <form onSubmit={handleUpdateAdminCredentials} className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Change Admin Account Credentials</h3>
                <p className="text-xs text-slate-500">Update Administrator name, username, email, and security login password</p>
              </div>
            </div>

            {credMessage && (
              <div
                className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-3 ${
                  credMessage.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {credMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span>{credMessage.text}</span>
              </div>
            )}

            {/* Profile Information */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                1. Administrator Profile
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Admin Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Jenkins"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Admin Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="e.g. admin@university.edu"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs">Login Username / Admin ID *</label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  You can use either this Username or your Email address to log into the Admin Portal.
                </p>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                2. Change Password
              </h4>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Admin Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showPassCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password (if changing password)"
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassCurrent(!showPassCurrent)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type={showPassNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Leave blank to keep unchanged"
                        className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassNew(!showPassNew)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type={showPassNew ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                disabled={updatingCreds}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-blue-500/25 flex items-center space-x-2"
              >
                {updatingCreds ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Update Admin Credentials</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};


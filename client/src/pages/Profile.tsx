import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User as UserType } from '../types';
import { Loader2, Save, User } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    college: '',
    degree: '',
    branch: '',
    graduationYear: '',
    careerInterest: '',
    skills: '',
    shortTermGoal: '',
    longTermGoal: '',
  });

  useEffect(() => {
    api.getProfile().then(data => {
      setProfile(data);
      setForm({
        name: data.name || '',
        college: data.profile?.college || '',
        degree: data.profile?.degree || '',
        branch: data.profile?.branch || '',
        graduationYear: data.profile?.graduationYear || '',
        careerInterest: data.profile?.careerInterest || '',
        skills: data.profile?.skills?.join(', ') || '',
        shortTermGoal: data.profile?.shortTermGoal || '',
        longTermGoal: data.profile?.longTermGoal || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    await api.updateProfile({
      name: form.name,
      profile: {
        college: form.college,
        degree: form.degree,
        branch: form.branch,
        graduationYear: form.graduationYear,
        careerInterest: form.careerInterest,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        shortTermGoal: form.shortTermGoal,
        longTermGoal: form.longTermGoal,
      },
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  const fields = [
    { key: 'college', label: 'College / University' },
    { key: 'degree', label: 'Degree' },
    { key: 'branch', label: 'Branch / Major' },
    { key: 'graduationYear', label: 'Graduation Year' },
    { key: 'careerInterest', label: 'Career Interest' },
    { key: 'skills', label: 'Skills (comma separated)' },
    { key: 'shortTermGoal', label: 'Short-term Goal' },
    { key: 'longTermGoal', label: 'Long-term Goal' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="page-title">Profile</h1>

      <div className="card">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <input className="text-xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary-500 outline-none transition-colors w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <p className="text-gray-500">{profile?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              {['shortTermGoal', 'longTermGoal'].includes(f.key) ? (
                <textarea className="input" rows={2} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
              ) : (
                <input className="input" value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

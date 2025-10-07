import { useState } from 'react';
import { Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Admin' | 'Editor' | 'Member'>('Admin');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name, role);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-6">
      <div className="bg-white rounded-[10px] shadow-[0_6px_18px_rgba(16,24,40,0.06)] p-8 w-full max-w-md border border-[#E5E9F0]">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-[#3562A7] p-3 rounded-full">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-medium text-gray-900 text-center mb-2">
          Database Keluarga
        </h1>
        <p className="text-[#6B7280] text-center mb-8">
          Masuk untuk mengakses sistem manajemen data keluarga
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7] focus:border-transparent"
              placeholder="Masukkan nama Anda"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'Admin' | 'Editor' | 'Member')}
              className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7] focus:border-transparent bg-white"
            >
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Member">Member</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#3562A7] text-white py-2.5 rounded-lg font-medium hover:bg-[#2a4d85] transition-colors"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

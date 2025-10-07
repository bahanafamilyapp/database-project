import { Users, Home, Tag, UserCheck } from 'lucide-react';
import { people, households } from '../data/mockData';

export default function Dashboard() {
  const aliveCount = people.filter(p => {
    const year = parseInt(p.dob.split('-')[0]);
    return year > 1950;
  }).length;

  const totalHouseholds = households.length;
  const uniqueMargas = new Set(people.map(p => p.marga)).size;
  const totalPeople = people.length;

  const educationData = [
    { label: 'S2', count: people.filter(p => p.education === 'S2').length },
    { label: 'S1', count: people.filter(p => p.education === 'S1').length },
    { label: 'Diploma', count: people.filter(p => p.education === 'Diploma').length },
    { label: 'SMA', count: people.filter(p => p.education === 'SMA').length },
  ];

  const ageGroups = [
    { label: '60+', count: people.filter(p => {
      const age = new Date().getFullYear() - parseInt(p.dob.split('-')[0]);
      return age >= 60;
    }).length },
    { label: '40-59', count: people.filter(p => {
      const age = new Date().getFullYear() - parseInt(p.dob.split('-')[0]);
      return age >= 40 && age < 60;
    }).length },
    { label: '30-39', count: people.filter(p => {
      const age = new Date().getFullYear() - parseInt(p.dob.split('-')[0]);
      return age >= 30 && age < 40;
    }).length },
    { label: '20-29', count: people.filter(p => {
      const age = new Date().getFullYear() - parseInt(p.dob.split('-')[0]);
      return age >= 20 && age < 30;
    }).length },
  ];

  const cityData = households.map(h => h.city).reduce((acc, city) => {
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCities = Object.entries(cityData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const kpiCards = [
    { label: 'Anggota Hidup', value: aliveCount, icon: UserCheck, color: 'bg-[#10B981]' },
    { label: 'Total Rumah Tangga', value: totalHouseholds, icon: Home, color: 'bg-[#3562A7]' },
    { label: 'Total Marga', value: uniqueMargas, icon: Tag, color: 'bg-[#F59E0B]' },
    { label: 'Total Orang', value: totalPeople, icon: Users, color: 'bg-[#8B5CF6]' },
  ];

  const maxEdu = Math.max(...educationData.map(d => d.count));
  const maxAge = Math.max(...ageGroups.map(d => d.count));
  const maxCity = Math.max(...topCities.map(([, count]) => count));

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-medium text-gray-900 mb-2">Dashboard Analitik</h1>
        <p className="text-[#6B7280]">Ringkasan data keluarga dan statistik demografis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-[10px] p-6 border border-[#E5E9F0] shadow-[0_6px_18px_rgba(16,24,40,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-medium text-gray-900 mb-1">{card.value}</p>
              <p className="text-sm text-[#6B7280]">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[10px] p-6 border border-[#E5E9F0] shadow-[0_6px_18px_rgba(16,24,40,0.06)]">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Distribusi Umur</h2>
          <div className="space-y-4">
            {ageGroups.map((group) => (
              <div key={group.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{group.label} tahun</span>
                  <span className="text-sm font-medium text-[#3562A7]">{group.count}</span>
                </div>
                <div className="w-full bg-[#F5F7FB] rounded-full h-3">
                  <div
                    className="bg-[#3562A7] h-3 rounded-full transition-all"
                    style={{ width: `${(group.count / maxAge) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[10px] p-6 border border-[#E5E9F0] shadow-[0_6px_18px_rgba(16,24,40,0.06)]">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Distribusi Pendidikan</h2>
          <div className="space-y-4">
            {educationData.map((edu) => (
              <div key={edu.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{edu.label}</span>
                  <span className="text-sm font-medium text-[#3562A7]">{edu.count}</span>
                </div>
                <div className="w-full bg-[#F5F7FB] rounded-full h-3">
                  <div
                    className="bg-[#10B981] h-3 rounded-full transition-all"
                    style={{ width: `${(edu.count / maxEdu) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[10px] p-6 border border-[#E5E9F0] shadow-[0_6px_18px_rgba(16,24,40,0.06)]">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Top 10 Distribusi Wilayah</h2>
        <div className="space-y-4">
          {topCities.map(([city, count]) => (
            <div key={city}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{city}</span>
                <span className="text-sm font-medium text-[#3562A7]">{count}</span>
              </div>
              <div className="w-full bg-[#F5F7FB] rounded-full h-3">
                <div
                  className="bg-[#F59E0B] h-3 rounded-full transition-all"
                  style={{ width: `${(count / maxCity) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, X, Download } from 'lucide-react';
import { people as initialPeople, Person } from '../data/mockData';

export default function DataOrang() {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEducation, setFilterEducation] = useState('');
  const [filterMarga, setFilterMarga] = useState('');

  const [formData, setFormData] = useState<Omit<Person, 'id'>>({
    name: '',
    gender: 'Laki-laki',
    dob: '',
    education: 'S1',
    city: '',
    marga: '',
  });

  const educationOptions = ['S2', 'S1', 'Diploma', 'SMA'];
  const uniqueMargas = Array.from(new Set(people.map(p => p.marga))).sort();

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           person.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEducation = !filterEducation || person.education === filterEducation;
      const matchesMarga = !filterMarga || person.marga === filterMarga;
      return matchesSearch && matchesEducation && matchesMarga;
    });
  }, [people, searchTerm, filterEducation, filterMarga]);

  const calculateAge = (dob: string) => {
    const birthYear = parseInt(dob.split('-')[0]);
    return new Date().getFullYear() - birthYear;
  };

  const openModal = (person?: Person) => {
    if (person) {
      setEditingPerson(person);
      setFormData(person);
    } else {
      setEditingPerson(null);
      setFormData({
        name: '',
        gender: 'Laki-laki',
        dob: '',
        education: 'S1',
        city: '',
        marga: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPerson) {
      setPeople(people.map(p => p.id === editingPerson.id ? { ...formData, id: p.id } : p));
    } else {
      const newPerson: Person = {
        ...formData,
        id: `p${Date.now()}`,
      };
      setPeople([...people, newPerson]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setPeople(people.filter(p => p.id !== id));
    }
  };

  const exportCSV = () => {
    const headers = ['Nama', 'Jenis Kelamin', 'Tanggal Lahir', 'Umur', 'Pendidikan', 'Kota', 'Marga'];
    const rows = people.map(p => [
      p.name,
      p.gender,
      p.dob,
      calculateAge(p.dob).toString(),
      p.education,
      p.city,
      p.marga
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-orang.csv';
    a.click();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Data Orang</h1>
          <p className="text-[#6B7280]">Kelola informasi individu dalam database keluarga</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-[#E5E9F0] text-gray-700 rounded-lg hover:bg-[#F5F7FB] transition-colors"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#3562A7] text-white rounded-lg hover:bg-[#2a4d85] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Orang
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[10px] p-6 border border-[#E5E9F0] shadow-[0_6px_18px_rgba(16,24,40,0.06)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Cari nama atau kota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7] focus:border-transparent"
            />
          </div>
          <select
            value={filterEducation}
            onChange={(e) => setFilterEducation(e.target.value)}
            className="px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7] focus:border-transparent bg-white"
          >
            <option value="">Semua Pendidikan</option>
            {educationOptions.map(edu => (
              <option key={edu} value={edu}>{edu}</option>
            ))}
          </select>
          <select
            value={filterMarga}
            onChange={(e) => setFilterMarga(e.target.value)}
            className="px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7] focus:border-transparent bg-white"
          >
            <option value="">Semua Marga</option>
            {uniqueMargas.map(marga => (
              <option key={marga} value={marga}>{marga}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeople.map((person) => (
            <div
              key={person.id}
              className="border border-[#E5E9F0] rounded-[10px] p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900 text-lg">{person.name}</h3>
                  <p className="text-sm text-[#6B7280]">{person.gender}</p>
                </div>
                <span className="px-3 py-1 bg-[#F5F7FB] text-[#3562A7] text-xs font-medium rounded-full">
                  {person.marga}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Tanggal Lahir:</span>
                  <span className="text-gray-900">{person.dob}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Umur:</span>
                  <span className="text-gray-900">{calculateAge(person.dob)} tahun</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Pendidikan:</span>
                  <span className="text-gray-900">{person.education}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Kota:</span>
                  <span className="text-gray-900">{person.city}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(person)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#3562A7] text-white rounded-lg hover:bg-[#2a4d85] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(person.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[#EF4444] text-[#EF4444] rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPeople.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">Tidak ada data yang ditemukan</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[10px] p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-gray-900">
                {editingPerson ? 'Edit Orang' : 'Tambah Orang'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7] bg-white"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pendidikan</label>
                <select
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7] bg-white"
                >
                  {educationOptions.map(edu => (
                    <option key={edu} value={edu}>{edu}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kota</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marga</label>
                <input
                  type="text"
                  value={formData.marga}
                  onChange={(e) => setFormData({ ...formData, marga: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7]"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-[#E5E9F0] text-gray-700 rounded-lg hover:bg-[#F5F7FB] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#3562A7] text-white rounded-lg hover:bg-[#2a4d85] transition-colors"
                >
                  {editingPerson ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

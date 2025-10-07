import { useState, useMemo } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, X, MapPin, Users } from 'lucide-react';
import { households as initialHouseholds, Household, people } from '../data/mockData';

export default function RumahTangga() {
  const [households, setHouseholds] = useState<Household[]>(initialHouseholds);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const [formData, setFormData] = useState<Omit<Household, 'id'>>({
    title: '',
    city: '',
    address: '',
    coords: [0, 0],
    members: [],
  });

  const uniqueCities = Array.from(new Set(households.map(h => h.city))).sort();

  const filteredHouseholds = useMemo(() => {
    return households.filter(household => {
      const matchesSearch = household.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           household.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = !filterCity || household.city === filterCity;
      return matchesSearch && matchesCity;
    });
  }, [households, searchTerm, filterCity]);

  const openModal = (household?: Household) => {
    if (household) {
      setEditingHousehold(household);
      setFormData(household);
    } else {
      setEditingHousehold(null);
      setFormData({
        title: '',
        city: '',
        address: '',
        coords: [0, 0],
        members: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHousehold(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHousehold) {
      setHouseholds(households.map(h => h.id === editingHousehold.id ? { ...formData, id: h.id } : h));
    } else {
      const newHousehold: Household = {
        ...formData,
        id: `h${Date.now()}`,
      };
      setHouseholds([...households, newHousehold]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus rumah tangga ini?')) {
      setHouseholds(households.filter(h => h.id !== id));
    }
  };

  const getPersonName = (personId: string) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : personId;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Data Rumah Tangga</h1>
          <p className="text-[#6B7280]">Kelola informasi rumah tangga dan lokasi keluarga</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#3562A7] text-white rounded-lg hover:bg-[#2a4d85] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Rumah Tangga
        </button>
      </div>

      <div className="bg-white rounded-[10px] p-6 border border-[#E5E9F0] shadow-[0_6px_18px_rgba(16,24,40,0.06)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Cari nama keluarga atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7] focus:border-transparent"
            />
          </div>
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7] focus:border-transparent bg-white"
          >
            <option value="">Semua Wilayah</option>
            {uniqueCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredHouseholds.map((household) => (
            <div
              key={household.id}
              className="border border-[#E5E9F0] rounded-[10px] p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-[#3562A7] p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-lg mb-1">{household.title}</h3>
                      <p className="text-sm text-[#6B7280] mb-1">{household.city}</p>
                      <p className="text-sm text-[#6B7280]">{household.address}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-[#6B7280]" />
                      <span className="text-[#6B7280]">Jumlah Anggota:</span>
                      <span className="font-medium text-gray-900">{household.members.length}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-[#6B7280]">Koordinat:</span>
                      <span className="font-medium text-gray-900 ml-2">
                        {household.coords[0]}, {household.coords[1]}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-[#6B7280] mb-2">Anggota:</p>
                    <div className="flex flex-wrap gap-2">
                      {household.members.map((memberId) => (
                        <span
                          key={memberId}
                          className="px-3 py-1 bg-[#F5F7FB] text-[#3562A7] text-sm rounded-full border border-[#E5E9F0]"
                        >
                          {getPersonName(memberId)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => openModal(household)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#3562A7] text-white rounded-lg hover:bg-[#2a4d85] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(household.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-[#EF4444] text-[#EF4444] rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHouseholds.length === 0 && (
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
                {editingHousehold ? 'Edit Rumah Tangga' : 'Tambah Rumah Tangga'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Keluarga *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kota *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7]"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coords[0]}
                    onChange={(e) => setFormData({ ...formData, coords: [parseFloat(e.target.value), formData.coords[1]] })}
                    className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coords[1]}
                    onChange={(e) => setFormData({ ...formData, coords: [formData.coords[0], parseFloat(e.target.value)] })}
                    className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anggota (ID, pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.members.join(', ')}
                  onChange={(e) => setFormData({ ...formData, members: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-4 py-2.5 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7]"
                  placeholder="p1, p2, p3"
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
                  {editingHousehold ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

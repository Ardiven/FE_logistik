import { useState, useEffect } from 'react';
import { getGroups, submitRequest } from '../services/api';
import { Calendar, Clock, Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function FastBookForm() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  const [formData, setFormData] = useState({
    requestedDate: '',
    startTime: '',
    endTime: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getGroups().then(res => {
      setGroups(res.data);
    }).catch(err => console.error("Failed to load groups:", err));
  }, []);

  const handleGroupChange = (e) => {
    const group = groups.find(g => g.id === parseInt(e.target.value));
    setSelectedGroup(group || null);

    // Reset isi form ketika ganti kelompok (fitur auto-isi dihapus agar tidak freeze)
    setFormData(prev => ({
      ...prev,
      requestedDate: '',
      startTime: '',
      endTime: ''
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGroup) return;

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        groupId: selectedGroup.id,
        ...formData
      };
      const res = await submitRequest(payload);
      setMessage({ type: 'success', text: `Berhasil! Kode Tiket: ${res.data.data.ticketCode}` });
      setFormData({
        requestedDate: '',
        startTime: '',
        endTime: ''
      });
      setSelectedGroup(null);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || "Terjadi kesalahan pada server." 
      });
    } finally {
      setLoading(false);
    }
  };


  const now = new Date();
  const tYear = now.getFullYear();
  const tMonth = String(now.getMonth() + 1).padStart(2, '0');
  const tDay = String(now.getDate()).padStart(2, '0');
  const todayDate = `${tYear}-${tMonth}-${tDay}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <div className="glass-panel rounded-2xl p-6 sm:p-10 mb-8 border-t-4 border-t-tps-orange relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-tps-yellow rounded-bl-full opacity-50 -z-10" />
        
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-tps-dark mb-2">Peminjaman Ruangan</h2>
          <p className="text-gray-600">Ajukan ruangan untuk kelompok KTB Anda dengan mudah dan cepat. Pastikan mengajukan minimal H-3.</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 flex items-start space-x-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" /> : <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Pilih Kelompok KTB</label>
            <select 
              className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:border-tps-orange focus:ring focus:ring-tps-orange focus:ring-opacity-50 transition-colors bg-white/50" 
              onChange={handleGroupChange}
              value={selectedGroup ? selectedGroup.id : ''}
              required
            >
              <option value="">-- Pilih Kelompok --</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.groupName}</option>
              ))}
            </select>
          </div>

          {selectedGroup && (
            <div className="p-4 bg-tps-yellow/30 rounded-xl border border-tps-yellow/50">
              <p className="text-sm font-semibold text-gray-700 mb-1">Data Penanggung Jawab (Otomatis):</p>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{selectedGroup.defaultMentorName}</span> • {selectedGroup.defaultContact}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-tps-orange" /> Tanggal
            </label>
            <input 
              type="date" 
              name="requestedDate"
              className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:border-tps-orange focus:ring focus:ring-tps-orange focus:ring-opacity-50 transition-colors bg-white"
              value={formData.requestedDate}
              onChange={handleChange}
              min={todayDate}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-tps-orange" /> Waktu Mulai
              </label>
              <input 
                type="time"
                name="startTime"
                className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:border-tps-orange focus:ring focus:ring-tps-orange focus:ring-opacity-50 transition-colors bg-white"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-tps-orange" /> Waktu Selesai
              </label>
              <input 
                type="time"
                name="endTime"
                className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:border-tps-orange focus:ring focus:ring-tps-orange focus:ring-opacity-50 transition-colors bg-white"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>



          <button 
            type="submit" 
            disabled={loading || !selectedGroup}
            className="w-full btn-primary py-3 text-lg flex justify-center items-center gap-2 mt-4"
          >
            {loading ? 'Mengirim...' : 'Ajukan Permohonan'}
          </button>
        </form>
      </div>
    </div>
  );
}

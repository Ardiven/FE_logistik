import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { assignRoom } from '../services/api';
import Swal from 'sweetalert2';

export default function AssignRoomModal({ request, onClose, onSuccess }) {
  const [assignedRoom, setAssignedRoom] = useState('');
  const [logisticsNotes, setLogisticsNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await assignRoom(request.requestId, { assignedRoom, logisticsNotes });
      onSuccess(res.data.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal!', 'Gagal mengassign ruangan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="bg-tps-orange px-6 py-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Assign Ruangan</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4 text-sm text-gray-600 bg-tps-cream p-3 rounded-lg border border-tps-yellow">
            <p><strong>Kelompok:</strong> {request.groupName}</p>
            <p><strong>Tanggal:</strong> {new Date(request.requestedDate).toLocaleDateString('id-ID')}</p>
            <p><strong>Waktu:</strong> {request.startTime} - {request.endTime}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ruangan yang Ditetapkan</label>
              <input 
                type="text" 
                className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:border-tps-orange focus:ring focus:ring-tps-orange focus:ring-opacity-50"
                placeholder="Cth: P.305"
                value={assignedRoom}
                onChange={e => setAssignedRoom(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan Logistik (Opsional)</label>
              <textarea 
                className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:border-tps-orange focus:ring focus:ring-tps-orange focus:ring-opacity-50"
                placeholder="Cth: Ambil kunci di pos satpam"
                rows="2"
                value={logisticsNotes}
                onChange={e => setLogisticsNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={loading || !assignedRoom}
                className="flex-1 btn-primary flex justify-center items-center gap-2"
              >
                {loading ? 'Menyimpan...' : <><Check className="w-4 h-4" /> Tetapkan</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

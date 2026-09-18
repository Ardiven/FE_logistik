import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { assignRoom } from '../services/api';
import Swal from 'sweetalert2';
import FullScreenLoader from './FullScreenLoader';

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

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9000]">
      {loading && <FullScreenLoader text="Sedang menyimpan penetapan ruangan..." />}
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden relative">
        <div className="bg-tps-orange px-6 py-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Assign Ruangan</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">KTB</label>
              <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                Kelompok {request.groupName}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Jadwal</label>
              <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                {new Date(request.requestedDate).toLocaleDateString('id-ID')} ({request.startTime} - {request.endTime})
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Ruangan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={assignedRoom}
                onChange={(e) => setAssignedRoom(e.target.value)}
                placeholder="Masukkan nama ruangan..."
                className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:border-tps-orange focus:ring focus:ring-tps-orange focus:ring-opacity-50 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Catatan / Keterangan (Opsional)
              </label>
              <textarea
                value={logisticsNotes}
                onChange={(e) => setLogisticsNotes(e.target.value)}
                placeholder="Masukkan catatan jika ada..."
                className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:border-tps-orange focus:ring focus:ring-tps-orange focus:ring-opacity-50 bg-white"
                rows="3"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-colors"
                disabled={loading}
              >
                <X className="w-4 h-4" /> Batal
              </button>
              <button
                type="submit"
                disabled={loading || !assignedRoom}
                className="flex-1 btn-primary flex justify-center items-center gap-2"
              >
                <Check className="w-4 h-4" /> Tetapkan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

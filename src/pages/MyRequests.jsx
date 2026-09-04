import { useState, useEffect } from 'react';
import { getMyRequests } from '../services/api';
import { CheckCircle, Clock, XCircle, AlertCircle, FileText, MapPin } from 'lucide-react';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getMyRequests();
      setRequests(res.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Gagal memuat riwayat pengajuan.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle className="w-4 h-4" /> Disetujui
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-4 h-4" /> Ditolak
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock className="w-4 h-4" /> Menunggu
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tps-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-tps-dark mb-2">Riwayat Pengajuan</h2>
          <p className="text-gray-600">Daftar permohonan ruangan yang telah Anda ajukan.</p>
        </div>
        <button 
          onClick={fetchRequests}
          className="text-sm font-medium text-tps-orange hover:text-orange-700 transition-colors bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl mb-6 flex items-start space-x-3 bg-red-50 text-red-800 border border-red-200">
          <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {requests.length === 0 && !error ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Belum ada pengajuan</h3>
          <p className="text-gray-500">Anda belum membuat permohonan ruangan KTB apapun.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-start sm:items-center">
                
                {/* Info Utama */}
                <div className="space-y-3 flex-grow">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                      {req.ticket_code}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(req.requested_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      <span className="mx-2">•</span>
                      {req.start_time.substring(0,5)} - {req.end_time.substring(0,5)}
                    </div>
                    
                    <div className="flex items-center font-medium">
                      <MapPin className="w-4 h-4 mr-2 text-tps-orange" />
                      {req.status === 'APPROVED' && req.room_assigned ? (
                        <span className="text-tps-dark">Ruang {req.room_assigned}</span>
                      ) : req.status === 'REJECTED' ? (
                        <span className="text-red-500 line-through">Ditolak</span>
                      ) : (
                        <span className="text-gray-400 italic">Belum dialokasikan</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info Tambahan */}
                {(req.rejection_reason || (req.status === 'APPROVED' && req.notes)) && (
                  <div className="w-full sm:w-64 mt-2 sm:mt-0 p-3 rounded-lg text-sm bg-gray-50 border border-gray-100">
                    <div className="font-semibold text-gray-700 mb-1">Catatan:</div>
                    <div className="text-gray-600 line-clamp-2">
                      {req.status === 'REJECTED' ? req.rejection_reason : req.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

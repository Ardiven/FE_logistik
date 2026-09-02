import { useState, useEffect } from 'react';
import { getLogisticsMatrix, rejectRoom, processRoom } from '../services/api';
import AssignRoomModal from './AssignRoomModal';
import { Calendar, Search, MapPin, Clock, User } from 'lucide-react';

export default function LogisticsMatrixGrid() {
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchMatrix = () => {
    setLoading(true);
    getLogisticsMatrix().then(res => {
      setMatrix(res.data.matrix);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  const handleAssignSuccess = (data) => {
    setSelectedRequest(null);
    if (data.whatsappNotificationUrl) {
      window.open(data.whatsappNotificationUrl, '_blank');
    }
    fetchMatrix();
  };

  const handleReject = async (id) => {
    if (window.confirm('Yakin ingin menolak permohonan ini?')) {
      try {
        await rejectRoom(id);
        fetchMatrix();
      } catch (err) {
        alert('Gagal menolak permohonan.');
      }
    }
  };

  const handleProcess = async (id) => {
    try {
      await processRoom(id);
      fetchMatrix();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-tps-dark flex items-center gap-2">
            <Calendar className="w-6 h-6 text-tps-orange" /> Matriks Logistik (10 Hari Kedepan)
          </h2>
          <p className="text-gray-500 text-sm mt-1">Pantau dan tetapkan ruangan untuk seluruh kelompok KTB</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchMatrix} className="p-2 bg-tps-orange text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
            <Search className="w-4 h-4" /> <span className="text-sm font-semibold pr-1">Refresh Data</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-tps-yellow border-t-tps-orange"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {matrix.map((item) => (
            <div key={item.requestId || `${item.groupNumber}-${Math.random()}`} className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col ${item.hasRequest ? 'border-tps-orange/30' : 'border-gray-100 opacity-70'}`}>
              <div className={`px-4 py-3 border-b flex justify-between items-center ${item.status?.toUpperCase() === 'ASSIGNED' ? 'bg-green-50 border-green-100' : item.status?.toUpperCase() === 'PROSES' ? 'bg-blue-50 border-blue-100' : item.hasRequest ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                <h3 className="font-bold text-gray-800">KTB {String(item.groupNumber).padStart(2, '0')}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.status?.toUpperCase() === 'ASSIGNED' ? 'bg-green-200 text-green-800' : item.status?.toUpperCase() === 'PROSES' ? 'bg-blue-200 text-blue-800' : item.hasRequest ? 'bg-orange-200 text-orange-800' : 'bg-gray-200 text-gray-600'}`}>
                  {item.status?.toUpperCase()}
                </span>
              </div>

              <div className="p-4 flex-grow flex flex-col justify-center">
                {item.hasRequest ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">{new Date(item.requestedDate).toLocaleDateString('id-ID')}</p>
                        <p>{item.startTime} - {item.endTime}</p>
                      </div>
                    </div>

                    {item.status?.toUpperCase() === 'ASSIGNED' ? (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-gray-600 bg-green-50 p-2 rounded-lg border border-green-100">
                          <MapPin className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                          <div>
                            <p className="font-bold text-green-700">{item.assignedRoom}</p>
                          </div>
                        </div>
                        {item.assignedByName && (
                          <div className="flex items-start gap-2 text-xs text-gray-500">
                            <User className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" />
                            <div>
                              <p>Assigned by: <span className="font-medium text-gray-700">{item.assignedByName}</span></p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : item.status?.toUpperCase() === 'PROSES' ? (
                      <div className="space-y-2 mt-2">
                        {item.processedByName && (
                          <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 p-2 rounded-lg border border-blue-100 mb-2">
                            <User className="w-3.5 h-3.5 mt-0.5 text-blue-500 shrink-0" />
                            <div>
                              <p>Diproses oleh: <span className="font-medium text-blue-700">{item.processedByName}</span></p>
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => setSelectedRequest(item)}
                            className="flex-1 bg-tps-orange/10 hover:bg-tps-orange hover:text-white text-tps-orange text-sm font-semibold py-2 rounded-lg transition-colors border border-tps-orange/20"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => handleReject(item.requestId)}
                            className="flex-1 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 text-sm font-semibold py-2 rounded-lg transition-colors border border-red-200 hover:border-red-500"
                          >
                            Tolak
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 w-full mt-2">
                        <button
                          onClick={() => handleProcess(item.requestId)}
                          className="flex-1 bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-500 text-sm font-semibold py-2 rounded-lg transition-colors border border-blue-200 hover:border-blue-500"
                        >
                          Proses
                        </button>
                        <button
                          onClick={() => handleReject(item.requestId)}
                          className="flex-1 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 text-sm font-semibold py-2 rounded-lg transition-colors border border-red-200 hover:border-red-500"
                        >
                          Tolak
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 text-sm py-4">
                    Belum ada pengajuan
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <AssignRoomModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
}

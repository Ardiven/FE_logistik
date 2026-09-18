import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getAdminMaterials, getAdminDashboardStats, getAdminPresensi, getAdminAssessment, exportToGoogleSheets } from '../services/api';
import { Users, FileText, Video, LayoutDashboard, Download } from 'lucide-react';
import Swal from 'sweetalert2';
import EmailSettingsModal from '../components/EmailSettingsModal';
import LoadingAnimation from '../components/LoadingAnimation';
import FullScreenLoader from '../components/FullScreenLoader';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [materials, setMaterials] = useState([]);
    const [selectedLeg, setSelectedLeg] = useState('');
    const [stats, setStats] = useState({ presensiCount: 0, assessmentCount: 0 });
    const [presensiList, setPresensiList] = useState([]);
    const [assessmentList, setAssessmentList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [exportType, setExportType] = useState('absen');
    const [exportLoading, setExportLoading] = useState(false);

    const handleExport = async () => {
        try {
            setExportLoading(true);
            const res = await exportToGoogleSheets({ type: exportType });
            Swal.fire('Berhasil!', res.data.message || 'Data berhasil diekspor.', 'success');
            setIsExportModalOpen(false);
        } catch (err) {
            Swal.fire('Gagal!', err.response?.data?.error || 'Gagal mengekspor data.', 'error');
        } finally {
            setExportLoading(false);
        }
    };

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const { data } = await getAdminMaterials();
                if (data.success && data.data.length > 0) {
                    setMaterials(data.data);
                    setSelectedLeg(data.data[0].id.toString());
                }
            } catch (error) {
                console.error("Error fetching materials", error);
            }
        };
        fetchMaterials();
    }, []);

    useEffect(() => {
        if (!selectedLeg) return;

        const fetchStats = async () => {
            try {
                const { data } = await getAdminDashboardStats(selectedLeg);
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };

        const fetchPresensi = async () => {
            setLoading(true);
            try {
                const { data } = await getAdminPresensi(selectedLeg);
                if (data.success) {
                    setPresensiList(data.data.map(item => item.nama));
                }
            } catch (error) {
                console.error("Error fetching presensi", error);
            }
            setLoading(false);
        };

        const fetchAssessment = async () => {
            setLoading(true);
            try {
                const { data } = await getAdminAssessment(selectedLeg);
                if (data.success) {
                    setAssessmentList(data.data.map(item => item.nama));
                }
            } catch (error) {
                console.error("Error fetching assessment", error);
            }
            setLoading(false);
        };

        if (activeTab === 'dashboard') {
            fetchStats();
        } else if (activeTab === 'presensi') {
            fetchPresensi();
        } else if (activeTab === 'assessment') {
            fetchAssessment();
        }
    }, [selectedLeg, activeTab]);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'presensi', label: 'Presensi', icon: Users },
        { id: 'assessment', label: 'Assessment', icon: FileText },
        { id: 'video', label: 'Video Briefing', icon: Video },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-tps-dark flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-tps-orange" /> Dashboard Admin
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Pantau presensi, assessment, dan progres kelompok KTB</p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg> <span className="text-sm font-semibold pr-1">Pengaturan</span>
                    </button>
                    <button onClick={() => setIsExportModalOpen(true)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2 border border-green-200">
                        <Download className="w-4 h-4" /> <span className="text-sm font-semibold pr-1">Export Sheets</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold ${isActive
                                    ? 'bg-tps-orange text-white'
                                    : 'bg-transparent text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {activeTab !== 'video' && (
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-tps-dark font-medium flex items-center gap-2">
                        <span className="text-gray-500">Pilih Materi:</span>
                    </div>
                    <select
                        value={selectedLeg}
                        onChange={(e) => setSelectedLeg(e.target.value)}
                        className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-tps-orange transition-colors"
                    >
                        <option value="" disabled>Pilih Materi...</option>
                        {materials.map(leg => (
                            <option key={leg.id} value={leg.id}>{leg.nama}</option>
                        ))}
                    </select>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-12">
                    <LoadingAnimation />
                </div>
            ) : (
                <>
                    {activeTab === 'video' && (
                        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-500">Video Briefing</h3>
                            <p className="text-gray-400 mt-2">Konten Video Briefing akan diimplementasikan di sini</p>
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                                <h2 className="text-2xl font-bold text-gray-500 mb-4 flex items-center gap-2">
                                    <Users className="w-6 h-6 text-tps-orange" /> Belum Presensi
                                </h2>
                                <div className="text-7xl font-extrabold text-tps-orange">{stats.presensiCount}</div>
                                <p className="text-gray-400 mt-2 text-sm">Kelompok belum mengisi presensi</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                                <h2 className="text-2xl font-bold text-gray-500 mb-4 flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-tps-orange" /> Belum Assessment
                                </h2>
                                <div className="text-7xl font-extrabold text-tps-orange">{stats.assessmentCount}</div>
                                <p className="text-gray-400 mt-2 text-sm">Kelompok belum mengisi assessment</p>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'presensi' || activeTab === 'assessment') && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-tps-dark flex items-center gap-2">
                                    {activeTab === 'presensi' ? <Users className="w-5 h-5 text-tps-orange" /> : <FileText className="w-5 h-5 text-tps-orange" />}
                                    Daftar Kelompok (Belum {activeTab === 'presensi' ? 'Presensi' : 'Assessment'})
                                </h3>
                            </div>
                            <div className="p-6">
                                {((activeTab === 'presensi' && presensiList.length === 0) || (activeTab === 'assessment' && assessmentList.length === 0)) ? (
                                    <div className="text-center text-gray-500 py-12 flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <p className="text-lg font-medium text-tps-dark">Semua kelompok sudah mengisi {activeTab}</p>
                                        <p className="text-sm text-gray-400 mt-1">Tidak ada data kelompok yang tertinggal untuk materi ini.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {(activeTab === 'presensi' ? presensiList : assessmentList).map((group, idx) => (
                                            <div key={idx} className="bg-orange-50 border border-orange-100 text-tps-orange font-bold rounded-xl py-3 px-4 text-center shadow-sm">
                                                {group}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Export Modal */}
            {isExportModalOpen && createPortal(
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9000] flex items-center justify-center p-4">
                    {exportLoading && <FullScreenLoader text="Sedang mengekspor data..." />}
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden relative">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Export ke Google Sheets</h3>
                                <p className="text-xs text-gray-500 mt-1">Pilih data yang ingin Anda ekspor</p>
                            </div>
                            <button onClick={() => setIsExportModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-100 text-xs mb-4">
                                <p className="font-semibold mb-1">⚠️ Penting Sebelum Export:</p>
                                <ul className="list-disc ml-4 space-y-1 text-yellow-700">
                                    <li>Pastikan Anda sudah mengundang email <i>Service Account</i> ke Google Sheets sebagai <b>Editor</b>.</li>
                                    <li>Pastikan tab/sheet bernama <b>Absen</b> dan <b>Assessment</b> sudah dibuat.</li>
                                    <li>Pengaturan ID Spreadsheet dapat diubah di menu <b>Pengaturan</b>.</li>
                                </ul>
                            </div>
                            <div className="space-y-3 mb-6">
                                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio" name="exportType" value="absen" checked={exportType === 'absen'} onChange={(e) => setExportType(e.target.value)} className="w-4 h-4 text-tps-orange focus:ring-tps-orange" />
                                    <span className="text-sm font-semibold text-gray-700">Absensi (absen_leg)</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio" name="exportType" value="assessment" checked={exportType === 'assessment'} onChange={(e) => setExportType(e.target.value)} className="w-4 h-4 text-tps-orange focus:ring-tps-orange" />
                                    <span className="text-sm font-semibold text-gray-700">Assessment (assessment_leg)</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio" name="exportType" value="both" checked={exportType === 'both'} onChange={(e) => setExportType(e.target.value)} className="w-4 h-4 text-tps-orange focus:ring-tps-orange" />
                                    <span className="text-sm font-semibold text-gray-700">Keduanya</span>
                                </label>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setIsExportModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">Batal</button>
                                <button 
                                    onClick={handleExport}
                                    disabled={exportLoading}
                                    className="flex-1 px-4 py-2 bg-tps-orange hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    Mulai Export
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <EmailSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
};

export default AdminDashboard;

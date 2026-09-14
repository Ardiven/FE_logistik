import React, { useState, useEffect } from 'react';
import { getAdminMaterials, getAdminDashboardStats, getAdminPresensi, getAdminAssessment } from '../services/api';
import { Users, FileText, Video, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [materials, setMaterials] = useState([]);
    const [selectedLeg, setSelectedLeg] = useState('');
    const [stats, setStats] = useState({ presensiCount: 0, assessmentCount: 0 });
    const [presensiList, setPresensiList] = useState([]);
    const [assessmentList, setAssessmentList] = useState([]);
    const [loading, setLoading] = useState(false);

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

                <div className="flex flex-wrap items-center gap-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold ${
                                    isActive 
                                    ? 'bg-tps-orange text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
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
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-tps-yellow border-t-tps-orange"></div>
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
                                    {activeTab === 'presensi' ? <Users className="w-5 h-5 text-tps-orange"/> : <FileText className="w-5 h-5 text-tps-orange"/>}
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
        </div>
    );
};

export default AdminDashboard;

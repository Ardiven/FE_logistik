import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { getSettings, updateSettings } from '../services/api';

const EmailSettingsModal = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [isH3Enabled, setIsH3Enabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
      setSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await getSettings();
      if (res.data.success && res.data.data) {
        setSubject(res.data.data.FRIDAY_EMAIL_SUBJECT || '');
        const rawHtml = res.data.data.FRIDAY_EMAIL_HTML || '';
        setHtml(rawHtml.replace(/>\s*</g, '>\n<'));
        setIsEnabled(res.data.data.IS_FRIDAY_EMAIL_ENABLED !== 'false');
        setIsH3Enabled(res.data.data.IS_H3_RESTRICTION_ENABLED !== 'false');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat pengaturan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await updateSettings({
        FRIDAY_EMAIL_SUBJECT: subject,
        FRIDAY_EMAIL_HTML: html,
        IS_FRIDAY_EMAIL_ENABLED: isEnabled ? 'true' : 'false',
        IS_H3_RESTRICTION_ENABLED: isH3Enabled ? 'true' : 'false'
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menyimpan pengaturan.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pengaturan Sistem</h2>
            <p className="text-sm text-gray-500 mt-1">Ubah konfigurasi email otomatis dan pengaturan sistem lainnya</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl text-sm border border-green-100">
              Pengaturan berhasil disimpan!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            
            {/* Form Edit */}
            <div>
              <form id="settings-form" onSubmit={handleSave} className="space-y-6">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Aturan H-3 Peminjaman</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Wajibkan peminjaman maksimal H-3 sebelum pelaksanaan.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isH3Enabled}
                        onChange={(e) => setIsH3Enabled(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tps-orange"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Status Email Jumat</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Kirim email pengingat pada hari Jumat ini.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isEnabled}
                        onChange={(e) => setIsEnabled(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tps-orange"></div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Subjek Email
                  </label>
                  <input 
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:border-tps-orange focus:ring focus:ring-tps-orange focus:ring-opacity-50"
                    placeholder="Reminder: Peminjaman Ruangan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Isi Email (Mendukung HTML)
                  </label>
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 text-xs mb-3">
                    <p className="font-semibold mb-2 flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> Panduan Penulisan (Cheatsheet):</p>
                    <ul className="list-disc ml-5 space-y-1.5 text-blue-700">
                      <li>Gunakan <code>{`{{nama}}`}</code> (kurung kurawal ganda) untuk menampilkan nama ketua kelompok secara otomatis.</li>
                      <li><code>&lt;p&gt;Teks Anda&lt;/p&gt;</code> : Membuat paragraf teks biasa. Selalu kurung teks Anda dengan tag ini.</li>
                      <li><code>&lt;b&gt;Teks Anda&lt;/b&gt;</code> : Membuat tulisan menjadi tebal (<b>Bold</b>).</li>
                      <li><code>&lt;i&gt;Teks Anda&lt;/i&gt;</code> : Membuat tulisan menjadi miring (<i>Italic</i>).</li>
                      <li><code>&lt;br/&gt;</code> : Memberikan baris kosong (Enter) untuk jarak ke bawah.</li>
                    </ul>
                  </div>
                  <textarea 
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:border-tps-orange focus:ring focus:ring-tps-orange focus:ring-opacity-50 h-64 font-mono text-sm"
                    placeholder="<p>Halo {{nama}},</p>"
                    required
                  />
                </div>

              </form>
            </div>

            {/* Live Preview */}
            <div className="flex flex-col h-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Live Preview
              </label>
              <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex flex-col">
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="text-xs text-gray-500 mb-1">Subject:</div>
                  <div className="font-semibold text-gray-900">{subject || '(Tanpa Subjek)'}</div>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                  <div 
                    className="p-6 bg-white shadow-sm border border-gray-100 rounded-lg text-sm text-gray-800"
                    dangerouslySetInnerHTML={{ __html: html.replace(/\{\{nama\}\}/g, 'Budi Santoso') }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            type="submit"
            form="settings-form"
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-tps-orange hover:bg-orange-600 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmailSettingsModal;

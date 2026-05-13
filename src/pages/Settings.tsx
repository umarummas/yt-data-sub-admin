
import React, { useEffect, useState } from 'react';
import { getSupportContent, updateSupportContent, getReferralSettings, updateReferralSettings } from '../api/adminApi';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useToast } from '../hooks/ToastContext';

interface SupportContent {
    email: string;
    phoneNumber: string;
    whatsappNumber: string;
    facebookUrl?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    websiteUrl?: string;
}

interface ReferralSettingForm {
    referrer_bonus_amount: number;
    referee_bonus_amount: number;
    min_transaction_for_bonus: number;
    is_active: boolean;
}

const Settings = () => {
    const { showToast } = useToast();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<SupportContent>({
        email: '',
        phoneNumber: '',
        whatsappNumber: '',
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        websiteUrl: ''
    });

    const [referralLoading, setReferralLoading] = useState(false);
    const [referralForm, setReferralForm] = useState<ReferralSettingForm>({
        referrer_bonus_amount: 0,
        referee_bonus_amount: 0,
        min_transaction_for_bonus: 1,
        is_active: false,
    });

    useEffect(() => {
        fetchContent();
        fetchReferralSettings();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const response = await getSupportContent();
            if (response.data.success) {
                setFormData(response.data.data);
            }
        } catch (error) {
            showToast('Failed to fetch settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchReferralSettings = async () => {
        try {
            const response = await getReferralSettings();
            if (response.data.success) {
                const d = response.data.data;
                setReferralForm({
                    referrer_bonus_amount: d.referrer_bonus_amount ?? 0,
                    referee_bonus_amount: d.referee_bonus_amount ?? 0,
                    min_transaction_for_bonus: d.min_transaction_for_bonus ?? 1,
                    is_active: d.is_active ?? false,
                });
            }
        } catch { /* non-fatal */ }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await updateSupportContent(formData);
            if (response.data.success) {
                showToast('Settings updated successfully', 'success');
            }
        } catch (error) {
            showToast('Failed to update settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleReferralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setReferralForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : Number(value),
        }));
    };

    const handleReferralSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setReferralLoading(true);
            const response = await updateReferralSettings(referralForm);
            if (response.data.success) {
                showToast('Referral settings saved', 'success');
            }
        } catch (error) {
            showToast('Failed to save referral settings', 'error');
        } finally {
            setReferralLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar onMenuClick={() => setIsMobileOpen(true)} />
                <main className="flex-1 overflow-auto p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">Settings</h1>
                            <p className="text-slate-600">Manage application settings and support information</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Support Contact Information</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp Number</label>
                                        <input
                                            type="text"
                                            name="whatsappNumber"
                                            value={formData.whatsappNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Website URL</label>
                                        <input
                                            type="url"
                                            name="websiteUrl"
                                            value={formData.websiteUrl || ''}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 pt-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Social Media Links</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Facebook URL</label>
                                            <input
                                                type="url"
                                                name="facebookUrl"
                                                value={formData.facebookUrl || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Twitter URL</label>
                                            <input
                                                type="url"
                                                name="twitterUrl"
                                                value={formData.twitterUrl || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Instagram URL</label>
                                            <input
                                                type="url"
                                                name="instagramUrl"
                                                value={formData.instagramUrl || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Referral Bonus Settings */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mt-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Referral Bonus Settings</h2>
                            <p className="text-slate-500 text-sm mb-6">
                                Configure how much wallet credit is awarded when a referred user completes their first purchase.
                                Set amounts to 0 to disable a specific bonus. Toggle <strong>Active</strong> to enable/disable the entire referral program.
                            </p>
                            <form onSubmit={handleReferralSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Referrer Bonus (₦)
                                            <span className="block text-xs font-normal text-slate-400 mt-0.5">Credited to the person who shared the referral code</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="referrer_bonus_amount"
                                            min={0}
                                            value={referralForm.referrer_bonus_amount}
                                            onChange={handleReferralChange}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Referee Bonus (₦)
                                            <span className="block text-xs font-normal text-slate-400 mt-0.5">Credited to the new user after first purchase (set 0 to skip)</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="referee_bonus_amount"
                                            min={0}
                                            value={referralForm.referee_bonus_amount}
                                            onChange={handleReferralChange}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Min. Transactions to Trigger
                                            <span className="block text-xs font-normal text-slate-400 mt-0.5">Usually 1 — the first successful purchase</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="min_transaction_for_bonus"
                                            min={1}
                                            value={referralForm.min_transaction_for_bonus}
                                            onChange={handleReferralChange}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="referral_active"
                                        name="is_active"
                                        checked={referralForm.is_active}
                                        onChange={handleReferralChange}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    <label htmlFor="referral_active" className="text-sm font-semibold text-slate-700 cursor-pointer">
                                        Referral program is <span className={referralForm.is_active ? 'text-green-600' : 'text-red-500'}>{referralForm.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
                                    </label>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={referralLoading}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {referralLoading ? 'Saving...' : 'Save Referral Settings'}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;


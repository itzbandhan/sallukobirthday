import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types';

type Settings = Database['public']['Tables']['invitation_settings']['Row'];

export const SettingsTab = () => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('invitation_settings').select('*').single();
        if (data) setSettings(data);
        if (error) console.error(error);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        setMessage(null);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updates: any = {
            title: settings.title,
            date_text: settings.date_text,
            venue_text: settings.venue_text,
            subtitle: settings.subtitle,
            emoji: settings.emoji,
            confetti_enabled: settings.confetti_enabled,
            emoji_overlay_enabled: settings.emoji_overlay_enabled,
            open_button_text: settings.open_button_text,
            generic_message: settings.generic_message
        };

        const { error } = await supabase
            .from('invitation_settings')
            .update(updates)
            .eq('id', settings.id);

        if (error) {
            setMessage({ type: 'error', text: 'Failed to save settings.' });
        } else {
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        }
        setSaving(false);
    };

    if (loading) return <div>Loading settings...</div>;
    if (!settings) return <div>Error loading settings.</div>;

    return (
        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            {message && (
                <div className={`p-4 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Title</label>
                    <input
                        type="text"
                        value={settings.title}
                        onChange={e => setSettings({ ...settings, title: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-brand-pink focus:border-brand-pink"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Text</label>
                    <input
                        type="text"
                        value={settings.date_text}
                        onChange={e => setSettings({ ...settings, date_text: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue Text</label>
                    <input
                        type="text"
                        value={settings.venue_text}
                        onChange={e => setSettings({ ...settings, venue_text: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (Optional)</label>
                    <input
                        type="text"
                        value={settings.subtitle || ''}
                        onChange={e => setSettings({ ...settings, subtitle: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Generic Message (No Slug)</label>
                    <textarea
                        value={settings.generic_message || ''}
                        onChange={e => setSettings({ ...settings, generic_message: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded rows-3"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emoji Character</label>
                    <input
                        type="text"
                        value={settings.emoji || ''}
                        onChange={e => setSettings({ ...settings, emoji: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                        type="text"
                        value={settings.open_button_text || ''}
                        onChange={e => setSettings({ ...settings, open_button_text: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={settings.confetti_enabled || false}
                            onChange={e => setSettings({ ...settings, confetti_enabled: e.target.checked })}
                            className="rounded text-brand-pink focus:ring-brand-pink"
                        />
                        <span className="text-sm text-gray-700">Enable Confetti</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={settings.emoji_overlay_enabled || false}
                            onChange={e => setSettings({ ...settings, emoji_overlay_enabled: e.target.checked })}
                            className="rounded text-brand-pink focus:ring-brand-pink"
                        />
                        <span className="text-sm text-gray-700">Enable Emoji Overlay</span>
                    </label>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-brand-pink text-white rounded font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
    );
};

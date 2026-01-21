import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types';
import { Copy, Trash2, Plus } from 'lucide-react';
import { clsx } from 'clsx';

type Recipient = Database['public']['Tables']['recipients']['Row'];
type UnsavedRecipient = Omit<Database['public']['Tables']['recipients']['Insert'], 'id' | 'created_at'>;

export const RecipientsTab = () => {
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState<Partial<UnsavedRecipient>>({
        invite_type: 'single',
        slug: '',
        name_single: '',
        name_partner1: '',
        name_partner2: '',
        custom_message: ''
    });

    useEffect(() => {
        fetchRecipients();
    }, []);

    const fetchRecipients = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('recipients')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setRecipients(data);
        if (error) console.error('Error fetching recipients:', error);
        setLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        // BasicValidation
        if (!newItem.slug) {
            alert('Slug is required');
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const toInsert: any = { ...newItem };
        // Clean up empty fields based on type
        if (toInsert.invite_type === 'single') {
            toInsert.name_partner1 = null;
            toInsert.name_partner2 = null;
        } else if (toInsert.invite_type === 'couple') {
            toInsert.name_single = null;
        }

        const { error } = await supabase.from('recipients').insert([toInsert]);

        if (error) {
            alert('Error adding recipient: ' + error.message);
        } else {
            fetchRecipients();
            setNewItem({
                invite_type: 'single',
                slug: '',
                name_single: '',
                name_partner1: '',
                name_partner2: '',
                custom_message: ''
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        const { error } = await supabase.from('recipients').delete().eq('id', id);
        if (!error) {
            setRecipients(recipients.filter(r => r.id !== id));
        }
    };

    const copyLink = (slug: string) => {
        const url = `${window.location.origin}/${slug}`;
        navigator.clipboard.writeText(url);
        // Could show toast
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <div className="space-y-8">
            {/* Add New Form */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus size={20} className="text-brand-pink" />
                    Add New Recipient
                </h3>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Invite Type</label>
                        <select
                            value={newItem.invite_type}
                            onChange={e => setNewItem({ ...newItem, invite_type: e.target.value as any })}
                            className="w-full p-2 border rounded"
                        >
                            <option value="single">Single</option>
                            <option value="couple">Couple</option>
                            <option value="special">Special Surprise</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                        <input
                            type="text"
                            value={newItem.slug}
                            onChange={e => setNewItem({ ...newItem, slug: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="e.g. bandhan"
                        />
                    </div>

                    {newItem.invite_type !== 'couple' && (
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={newItem.name_single || ''}
                                onChange={e => {
                                    const val = e.target.value;
                                    setNewItem({ ...newItem, name_single: val, slug: newItem.slug || generateSlug(val) });
                                }}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    )}

                    {newItem.invite_type === 'couple' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Partner 1</label>
                                <input
                                    type="text"
                                    value={newItem.name_partner1 || ''}
                                    onChange={e => setNewItem({ ...newItem, name_partner1: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Partner 2</label>
                                <input
                                    type="text"
                                    value={newItem.name_partner2 || ''}
                                    onChange={e => setNewItem({ ...newItem, name_partner2: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </>
                    )}

                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Custom Message (Optional)</label>
                        <input
                            type="text"
                            value={newItem.custom_message || ''}
                            onChange={e => setNewItem({ ...newItem, custom_message: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="Overwrite default message..."
                        />
                    </div>

                    <div className="col-span-2 pt-2">
                        <button
                            type="submit"
                            className="bg-brand-pink text-white px-6 py-2 rounded hover:bg-brand-dark transition-colors font-bold"
                        >
                            Add Recipient
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-500 text-sm">
                            <th className="py-3 px-2">Name(s)</th>
                            <th className="py-3 px-2">Type</th>
                            <th className="py-3 px-2">Slug</th>
                            <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recipients.map(r => (
                            <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-2 font-medium text-gray-800">
                                    {r.invite_type === 'couple'
                                        ? `${r.name_partner1} & ${r.name_partner2}`
                                        : r.name_single || '(Special)'}
                                </td>
                                <td className="py-3 px-2">
                                    <span className={clsx(
                                        "px-2 py-1 rounded text-xs font-bold uppercase",
                                        r.invite_type === 'special' ? "bg-purple-100 text-purple-700" :
                                            r.invite_type === 'couple' ? "bg-blue-100 text-blue-700" :
                                                "bg-gray-100 text-gray-700"
                                    )}>
                                        {r.invite_type}
                                    </span>
                                </td>
                                <td className="py-3 px-2 font-mono text-sm text-gray-600">
                                    /{r.slug}
                                </td>
                                <td className="py-3 px-2 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => copyLink(r.slug)}
                                        className="p-2 text-gray-500 hover:text-brand-dark"
                                        title="Copy Link"
                                    >
                                        <Copy size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(r.id)}
                                        className="p-2 text-gray-400 hover:text-red-500"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!loading && recipients.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-400">
                                    No recipients yet. Add one above!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

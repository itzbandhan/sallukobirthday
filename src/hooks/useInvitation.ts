import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types';

type InvitationSettings = Database['public']['Tables']['invitation_settings']['Row'];
type Recipient = Database['public']['Tables']['recipients']['Row'];

export const useInvitation = (slug?: string) => {
    const [settings, setSettings] = useState<InvitationSettings | null>(null);
    const [recipient, setRecipient] = useState<Recipient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch Settings
                const { data: settingsData, error: settingsError } = await supabase
                    .from('invitation_settings')
                    .select('*')
                    .single(); // Assuming only one row

                if (settingsError) throw settingsError;
                setSettings(settingsData);

                // Fetch Recipient if slug exists
                if (slug) {
                    const { data: recipientData, error: recipientError } = await supabase
                        .from('recipients')
                        .select('*')
                        .eq('slug', slug)
                        .single();

                    if (recipientError && recipientError.code !== 'PGRST116') {
                        // PGRST116 is "The result contains 0 rows" which is fine (invalid slug)
                        console.error("Recipient fetch error:", recipientError);
                    }

                    if (recipientData) {
                        setRecipient(recipientData);
                    } else {
                        // Slug provided but not found
                        setError("Invitation not found");
                    }
                }

            } catch (err: any) {
                console.error("Error fetching invitation:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    return { settings, recipient, loading, error };
};

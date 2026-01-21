export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            invitation_settings: {
                Row: {
                    id: string
                    title: string
                    date_text: string
                    venue_text: string
                    subtitle: string | null
                    theme_variant: string
                    emoji: string
                    confetti_enabled: boolean
                    emoji_overlay_enabled: boolean
                    open_button_text: string
                    generic_message: string | null
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title?: string
                    date_text?: string
                    venue_text?: string
                    subtitle?: string | null
                    theme_variant?: string
                    emoji?: string
                    confetti_enabled?: boolean
                    emoji_overlay_enabled?: boolean
                    open_button_text?: string
                    generic_message?: string | null
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    date_text?: string
                    venue_text?: string
                    subtitle?: string | null
                    theme_variant?: string
                    emoji?: string
                    confetti_enabled?: boolean
                    emoji_overlay_enabled?: boolean
                    open_button_text?: string
                    generic_message?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            recipients: {
                Row: {
                    id: string
                    slug: string
                    invite_type: 'single' | 'couple' | 'special'
                    name_single: string | null
                    name_partner1: string | null
                    name_partner2: string | null
                    custom_message: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    invite_type?: 'single' | 'couple' | 'special'
                    name_single?: string | null
                    name_partner1?: string | null
                    name_partner2?: string | null
                    custom_message?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    invite_type?: 'single' | 'couple' | 'special'
                    name_single?: string | null
                    name_partner1?: string | null
                    name_partner2?: string | null
                    custom_message?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

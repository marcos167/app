/**
 * Supabase Storage Helper
 * Centraliza URLs de assets armazenados no Supabase
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const STORAGE_BUCKET = 'chefex-assets';

/**
 * Gera URL pública para asset no Supabase Storage
 */
export function getStorageUrl(path: string): string {
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

/**
 * Brand Assets - Logos e branding
 */
export const BRAND_ASSETS = {
    logoIcon: getStorageUrl('brand/logo-icon-final.png'),
    logoText: getStorageUrl('brand/logo-text-final.png'),
    logoFull: getStorageUrl('brand/logo-full.png'),
    axisLogo: getStorageUrl('brand/axis-logo.png'),

    // Logos dark/light
    logoDark: getStorageUrl('brand/chefex-logo-dark.png'),
    logoLight: getStorageUrl('brand/chefex-logo-light.png'),

    // Icons
    icon: getStorageUrl('brand/chefex-icon.png'),
    appIcon: getStorageUrl('brand/chefex-app-icon.png'),
    favicon: getStorageUrl('brand/chefex-favicon.png'),
};

/**
 * Avatar Assets
 */
export const AVATAR_ASSETS = {
    admin: getStorageUrl('avatars/admin-avatar.jpg'),
    default: getStorageUrl('avatars/default-avatar.png'),
};

/**
 * Misc Assets
 */
export const MISC_ASSETS = {
    logoChefex: getStorageUrl('misc/logo-chefex.png'),
};

/**
 * Upload de arquivo para Supabase Storage (client-side)
 */
export async function uploadToStorage(
    file: File,
    path: string,
    bucket: string = STORAGE_BUCKET
): Promise<{ url: string | null; error: Error | null }> {
    try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                upsert: true,
            });

        if (error) throw error;

        const url = getStorageUrl(path);
        return { url, error: null };
    } catch (error) {
        return { url: null, error: error as Error };
    }
}

const envBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
const envUseLocal = (import.meta.env.VITE_USE_LOCAL_API as string | undefined)?.toLowerCase();

const useLocalByEnv = envUseLocal === 'true' || envUseLocal === '1';

// Backend routes in this workspace are mounted under /api/*
export const API_URLS = {
    LOCAL: 'http://localhost:5000/api',
    PRODUCTION: 'https://yt-data-sub-backend-production.up.railway.app/api'
};

// Default to local API in development, production URL in production builds
export const USE_LOCAL_API = envBase ? false : (envUseLocal ? useLocalByEnv : import.meta.env.DEV);

export const getApiUrl = () => {
    if (envBase) return envBase;
    return USE_LOCAL_API ? API_URLS.LOCAL : API_URLS.PRODUCTION;
};

export const getAdminApiUrl = () => `${getApiUrl()}/admin`;

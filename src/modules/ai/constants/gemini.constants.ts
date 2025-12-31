export const GEMINI_CONFIG = {
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    MODEL: 'google/gemini-2.0-flash-exp:free',
    REQUEST_TIMEOUT: 60000,
    HTTP_REFERER: 'https://fittrack-pro.app',
    SITE_TITLE: 'FitTrack Pro',
} as const;

export const GEMINI_ENV_KEY = 'OPEN_ROUTER_API_KEY_GEMINI' as const;

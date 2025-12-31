export const DEEPSEEK_CONFIG = {
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    MODEL: 'deepseek/deepseek-r1-0528:free',
    REQUEST_TIMEOUT: 30000,
    HTTP_REFERER: 'https://fittrack-pro.app',
    SITE_TITLE: 'FitTrack Pro',
} as const;

export const DEEPSEEK_ENV_KEY = 'OPEN_ROUTER_API_KEY_DEEPSEEK' as const;

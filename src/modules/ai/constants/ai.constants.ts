export const OPEN_ROUTER_CONFIG = {
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    DEFAULT_MODEL: 'deepseek/deepseek-r1-0528:free',
    REQUEST_TIMEOUT: 30000,
} as const;

export const GEMINI_OPEN_ROUTER_CONFIG = {
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    VISION_MODEL: 'google/gemini-2.0-flash-exp:free',
    REQUEST_TIMEOUT: 60000,
    HTTP_REFERER: 'https://fittrack-pro.app',
    SITE_TITLE: 'FitTrack Pro',
} as const;

export const AI_ERROR_MESSAGES = {
    API_KEY_MISSING: 'OpenRouter API anahtarı tanımlı değil',
    GEMINI_API_KEY_MISSING: 'Gemini OpenRouter API anahtarı tanımlı değil',
    API_REQUEST_FAILED: 'AI servisine bağlanırken bir hata oluştu',
    INVALID_RESPONSE: 'AI servisinden geçersiz yanıt alındı',
    RATE_LIMIT_EXCEEDED: 'İstek limiti aşıldı, lütfen biraz bekleyin',
    NETWORK_ERROR: 'Ağ bağlantı hatası',
    IMAGE_REQUIRED: 'Resim URL veya base64 verisi gerekli',
} as const;

export const AI_ENV_KEYS = {
    OPEN_ROUTER_API_KEY_DEEPSEEK: 'OPEN_ROUTER_API_KEY_DEEPSEEK',
    OPEN_ROUTER_API_KEY_GEMINI: 'OPEN_ROUTER_API_KEY_GEMINI',
} as const;

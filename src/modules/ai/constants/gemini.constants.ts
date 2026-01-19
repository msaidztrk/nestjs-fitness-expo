export const GEMINI_CONFIG = {
    // Direct Google API URL (method and key will be appended in service)
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
    MODEL: 'gemini-2.0-flash', // Google model name
    REQUEST_TIMEOUT: 60000,
} as const;

export const GEMINI_API_KEYS = [
    'GOOGLE_GEMINI_API_KEY',
] as const;

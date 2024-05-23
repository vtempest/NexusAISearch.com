const config = {
  GENERAL: {
    PORT: 3001,
    WEBSOCKET: 'wss://nexus-ai-search-api.vtempest.workers.dev/',
    SIMILARITY_MEASURE: 'cosine',
  },
  API_KEYS: {
    GROQ: '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',
    OPENAI: '',
  },
  API_ENDPOINTS: {
    SEARXNG: 'http://ec2-54-73-37-194.eu-west-1.compute.amazonaws.com/searxng/',
    OLLAMA: '',
  },
};

export const getWebsocketUrl = () => config.GENERAL.SERVER_URL;

export const getPort = () => config.GENERAL.PORT;

export const getSimilarityMeasure = () => config.GENERAL.SIMILARITY_MEASURE;

export const getOpenaiApiKey = () => config.API_KEYS.OPENAI;

export const getGroqApiKey = () => config.API_KEYS.GROQ;

export const getSearxngApiEndpoint = () => config.API_ENDPOINTS.SEARXNG;

export const getOllamaApiEndpoint = () => config.API_ENDPOINTS.OLLAMA;

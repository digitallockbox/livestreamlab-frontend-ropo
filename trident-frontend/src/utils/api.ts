const API_BASE_URL = 'https://api.livestreamlab.live:8080';

export const apiGet = async (path: string): Promise<string> => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
};


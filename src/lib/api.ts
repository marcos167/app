export class ApiError extends Error {
    constructor(public status: number, public message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

// Use relative path - Next.js Rewrites handles the proxy
const API_BASE_URL = '';

interface RequestOptions extends RequestInit {
    _retry?: boolean;
}

async function refreshTokenFn(): Promise<string | null> {
    try {
        const userStr = localStorage.getItem('app_receitas_user');
        if (!userStr) return null;

        const user = JSON.parse(userStr);
        if (!user.refresh_token) return null;

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: user.refresh_token }),
        });

        if (!response.ok) return null;

        const data = await response.json();

        // Update User in Storage with NEW Access Token
        // Keep the old Refresh Token (or update if rotated)
        const newUser = {
            ...user,
            token: data.access_token,
            // If backend rotates refresh token, update it here. For now it returns same.
            refresh_token: data.refresh_token || user.refresh_token
        };

        localStorage.setItem('app_receitas_user', JSON.stringify(newUser));
        window.dispatchEvent(new Event('auth:update'));

        return data.access_token;
    } catch (e) {
        return null;
    }
}

async function fetchWrapper<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get token from storage
    let token = '';
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('app_receitas_user');
        if (userStr) {
            try {
                const parsed = JSON.parse(userStr);
                token = parsed.token || '';
            } catch (e) {
                console.warn('Failed to parse user session');
            }
        }
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers as Record<string, string>),
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Handle 401 (Unauthorized) - Attempt Refresh
    if (response.status === 401 && !options._retry) {
        if (typeof window !== 'undefined') {
            const newToken = await refreshTokenFn();

            if (newToken) {
                // Retry Original Request with New Token
                return fetchWrapper<T>(endpoint, {
                    ...options,
                    _retry: true,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${newToken}`
                    }
                });
            } else {
                // Refresh failed - Logout
                localStorage.removeItem('app_receitas_user');
                window.dispatchEvent(new Event('auth:update'));
                window.dispatchEvent(new Event('auth:logout'));
            }
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Something went wrong' }));
        throw new ApiError(response.status, errorData.detail || response.statusText);
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string) => fetchWrapper<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body: any) => fetchWrapper<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: any) => fetchWrapper<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) => fetchWrapper<T>(endpoint, { method: 'DELETE' }),
};

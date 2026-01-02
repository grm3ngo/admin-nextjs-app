'use client';

import { useState, useEffect } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
}

interface UseUserResult {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

export function useUser(): UseUserResult {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        async function fetchUser() {
            try {
                setIsLoading(true);
                const response = await fetch('api/auth/me');

                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                        
                const data = await response.json();
                setUser(data.user);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        }
        fetchUser();
    }, []);

    return { user, isLoading, error };
}
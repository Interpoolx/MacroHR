import { Context } from 'hono';
import { User, Member, Document } from '@shared/types';

// Backend config (no React dependencies)
const config = {
  database: {
    provider: 'd1' as const
  }
} as const;

export interface Storage {
    getUsers(): Promise<User[]>;
    createUser(user: Partial<User>): Promise<User>;
    getMembers(): Promise<Member[]>;
    getDocuments(): Promise<Document[]>;
    getSettings(): Promise<{ key: string; value: string }[]>;
    updateSetting(key: string, value: string): Promise<void>;
}

export class D1Storage implements Storage {
    constructor(private db: D1Database) { }

    async getUsers(): Promise<User[]> {
        const { results } = await this.db.prepare('SELECT * FROM users ORDER BY created_at DESC').all<User>();
        return results;
    }

    async createUser(user: Partial<User>): Promise<User> {
        const id = crypto.randomUUID();
        const newUser = { id, ...user, createdAt: new Date().toISOString() } as User;
        await this.db.prepare(
            'INSERT INTO users (id, name, email, role, status) VALUES (?, ?, ?, ?, ?)'
        ).bind(id, user.name, user.email, user.role || 'employee', user.status || 'active').run();
        return newUser;
    }

    async getMembers(): Promise<Member[]> {
        const { results } = await this.db.prepare('SELECT * FROM members ORDER BY join_date DESC').all<Member>();
        return results;
    }

    async getDocuments(): Promise<Document[]> {
        const { results } = await this.db.prepare('SELECT * FROM documents ORDER BY upload_date DESC').all<Document>();
        return results;
    }

    async getSettings(): Promise<{ key: string; value: string }[]> {
        const { results } = await this.db.prepare('SELECT key, value FROM settings').all<{ key: string; value: string }>();
        return results;
    }

    async updateSetting(key: string, value: string): Promise<void> {
        await this.db.prepare(
            'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP'
        ).bind(key, value).run();
    }
}

// Mock/JSON storage for when DB is not available
export class JsonStorage implements Storage {
    async getUsers(): Promise<User[]> {
        return [
            { id: '1', name: 'Demo Admin', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: new Date().toISOString() }
        ];
    }

    async createUser(user: Partial<User>): Promise<User> {
        return { id: crypto.randomUUID(), ...user } as User;
    }

    async getMembers(): Promise<Member[]> {
        return [];
    }

    async getDocuments(): Promise<Document[]> {
        return [];
    }

    async getSettings(): Promise<{ key: string; value: string }[]> {
        return [];
    }

    async updateSetting(key: string, value: string): Promise<void> {
        // No-op for mock
    }
}

export function getStorage(c: Context): Storage {
    const db = (c.env as any).DB;
    const provider = config.database.provider;

    if (provider === 'd1' && db) {
        return new D1Storage(db);
    }

    // Auto-detect D1 if no explicit provider or if provider is d1 but it's available
    if (db) {
        return new D1Storage(db);
    }

    return new JsonStorage();
}

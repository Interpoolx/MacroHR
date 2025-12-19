import { Context } from 'hono';
import { User, Member, Document } from '@shared/types';
import { siteConfig } from '@shared/config/site';

export interface Storage {
    getUsers(): Promise<User[]>;
    createUser(user: Partial<User>): Promise<User>;
    getMembers(): Promise<Member[]>;
    getDocuments(): Promise<Document[]>;
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
}

export function getStorage(c: Context): Storage {
    const db = (c.env as any).DB;
    const provider = siteConfig.database.provider;

    if (provider === 'd1' && db) {
        return new D1Storage(db);
    }

    // Auto-detect D1 if no explicit provider or if provider is d1 but it's available
    if (db) {
        return new D1Storage(db);
    }

    return new JsonStorage();
}

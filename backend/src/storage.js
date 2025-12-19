import { siteConfig } from '@shared/config/site';
export class D1Storage {
    db;
    constructor(db) {
        this.db = db;
    }
    async getUsers() {
        const { results } = await this.db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
        return results;
    }
    async createUser(user) {
        const id = crypto.randomUUID();
        const newUser = { id, ...user, createdAt: new Date().toISOString() };
        await this.db.prepare('INSERT INTO users (id, name, email, role, status) VALUES (?, ?, ?, ?, ?)').bind(id, user.name, user.email, user.role || 'employee', user.status || 'active').run();
        return newUser;
    }
    async getMembers() {
        const { results } = await this.db.prepare('SELECT * FROM members ORDER BY join_date DESC').all();
        return results;
    }
    async getDocuments() {
        const { results } = await this.db.prepare('SELECT * FROM documents ORDER BY upload_date DESC').all();
        return results;
    }
}
// Mock/JSON storage for when DB is not available
export class JsonStorage {
    async getUsers() {
        return [
            { id: '1', name: 'Demo Admin', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: new Date().toISOString() }
        ];
    }
    async createUser(user) {
        return { id: crypto.randomUUID(), ...user };
    }
    async getMembers() {
        return [];
    }
    async getDocuments() {
        return [];
    }
}
export function getStorage(c) {
    const db = c.env.DB;
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

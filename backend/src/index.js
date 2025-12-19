import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@supabase/supabase-js';
const app = new Hono();
// Middleware
app.use('*', cors());
// Supabase Auth Middleware (Skeleton)
app.use('/api/*', async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        return c.json({ error: 'Invalid token' }, 401);
    }
    c.set('user', user);
    return await next();
});
import { getStorage } from './storage';
// Routes
app.get('/', (c) => c.text('MacroHR API is running'));
// ===== USERS ENDPOINTS =====
app.get('/api/users', async (c) => {
    try {
        const storage = getStorage(c);
        const users = await storage.getUsers();
        return c.json(users);
    }
    catch (error) {
        return c.json({ error: 'Failed to load users' }, 500);
    }
});
app.post('/api/users', async (c) => {
    try {
        const storage = getStorage(c);
        const body = await c.req.json();
        const newUser = await storage.createUser(body);
        return c.json(newUser, 201);
    }
    catch (error) {
        return c.json({ error: 'Failed to create user' }, 500);
    }
});
// ===== MEMBERS ENDPOINTS =====
app.get('/api/members', async (c) => {
    try {
        const storage = getStorage(c);
        const members = await storage.getMembers();
        return c.json(members);
    }
    catch (error) {
        return c.json({ error: 'Failed to load members' }, 500);
    }
});
// ===== DOCUMENTS ENDPOINTS =====
app.get('/api/documents', async (c) => {
    try {
        const storage = getStorage(c);
        const documents = await storage.getDocuments();
        return c.json(documents);
    }
    catch (error) {
        return c.json({ error: 'Failed to load documents' }, 500);
    }
});
export default app;

import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'public', 'json');
const SEED_DIR = path.join(__dirname, 'public', 'json-seed');
const METADATA_FILE = path.join(DATA_DIR, '.metadata.json');
const DEMO_DATA_TTL = 15 * 60 * 1000; // 15 minutes

// Load metadata for tracking reset times
const loadMetadata = async () => {
  try {
    const data = await fs.readFile(METADATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
};

const saveMetadata = async (metadata) => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
};

const shouldResetFile = async (filename) => {
  const metadata = await loadMetadata();
  if (!metadata[filename]) return true;
  const elapsed = Date.now() - metadata[filename];
  return elapsed > DEMO_DATA_TTL;
};

const markFileReset = async (filename) => {
  const metadata = await loadMetadata();
  metadata[filename] = Date.now();
  await saveMetadata(metadata);
};

// Copy seed file to working directory
const copySeedToWorking = async (filename) => {
  const seedPath = path.join(SEED_DIR, filename);
  const workPath = path.join(DATA_DIR, filename);
  try {
    const seedData = await fs.readFile(seedPath, 'utf-8');
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(workPath, seedData);
    await markFileReset(filename);
  } catch (error) {
    console.error(`Failed to copy seed file ${filename}:`, error);
    // Create empty file if seed doesn't exist
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(workPath, JSON.stringify([], null, 2));
    await markFileReset(filename);
  }
};

// Ensure data files exist
const ensureDataFile = async (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.access(filePath);
    // Check if file should be reset
    if (await shouldResetFile(filename)) {
      await copySeedToWorking(filename);
    }
  } catch {
    // File doesn't exist, copy from seed
    await copySeedToWorking(filename);
  }
  return filePath;
};

// ===== USERS ENDPOINTS =====
const usersFile = await ensureDataFile('users-data.json');

app.get('/api/users', async (req, res) => {
  try {
    const data = await fs.readFile(usersFile, 'utf-8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const users = JSON.parse((await fs.readFile(usersFile, 'utf-8')) || '[]');
    const newUser = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...req.body };
    users.push(newUser);
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const users = JSON.parse((await fs.readFile(usersFile, 'utf-8')) || '[]');
    const index = users.findIndex((u) => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    users[index] = { ...users[index], ...req.body };
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
    res.json(users[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users', async (req, res) => {
  try {
    const { ids } = req.body;
    const users = JSON.parse((await fs.readFile(usersFile, 'utf-8')) || '[]');
    const filtered = users.filter((u) => !ids.includes(u.id));
    await fs.writeFile(usersFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete users' });
  }
});

// ===== DOCUMENTS ENDPOINTS =====
const docsFile = await ensureDataFile('documents-data.json');

app.get('/api/documents', async (req, res) => {
  try {
    const data = await fs.readFile(docsFile, 'utf-8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load documents' });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const docs = JSON.parse((await fs.readFile(docsFile, 'utf-8')) || '[]');
    const newDoc = {
      id: crypto.randomUUID(),
      uploadDate: new Date().toISOString(),
      ...req.body,
    };
    docs.push(newDoc);
    await fs.writeFile(docsFile, JSON.stringify(docs, null, 2));
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create document' });
  }
});

app.put('/api/documents/:id', async (req, res) => {
  try {
    const docs = JSON.parse((await fs.readFile(docsFile, 'utf-8')) || '[]');
    const index = docs.findIndex((d) => d.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Document not found' });

    docs[index] = { ...docs[index], ...req.body };
    await fs.writeFile(docsFile, JSON.stringify(docs, null, 2));
    res.json(docs[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update document' });
  }
});

app.delete('/api/documents', async (req, res) => {
  try {
    const { ids } = req.body;
    const docs = JSON.parse((await fs.readFile(docsFile, 'utf-8')) || '[]');
    const filtered = docs.filter((d) => !ids.includes(d.id));
    await fs.writeFile(docsFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete documents' });
  }
});

// ===== PAYSLIPS ENDPOINTS =====
const payslipsFile = await ensureDataFile('payslips-data.json');

app.get('/api/payslips', async (req, res) => {
  try {
    const data = await fs.readFile(payslipsFile, 'utf-8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load payslips' });
  }
});

app.post('/api/payslips', async (req, res) => {
  try {
    const payslips = JSON.parse((await fs.readFile(payslipsFile, 'utf-8')) || '[]');
    const newPayslip = {
      id: crypto.randomUUID(),
      generatedDate: new Date().toISOString(),
      ...req.body,
    };
    payslips.push(newPayslip);
    await fs.writeFile(payslipsFile, JSON.stringify(payslips, null, 2));
    res.status(201).json(newPayslip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payslip' });
  }
});

app.put('/api/payslips/:id', async (req, res) => {
  try {
    const payslips = JSON.parse((await fs.readFile(payslipsFile, 'utf-8')) || '[]');
    const index = payslips.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Payslip not found' });

    payslips[index] = { ...payslips[index], ...req.body };
    await fs.writeFile(payslipsFile, JSON.stringify(payslips, null, 2));
    res.json(payslips[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payslip' });
  }
});

app.delete('/api/payslips', async (req, res) => {
  try {
    const { ids } = req.body;
    const payslips = JSON.parse((await fs.readFile(payslipsFile, 'utf-8')) || '[]');
    const filtered = payslips.filter((p) => !ids.includes(p.id));
    await fs.writeFile(payslipsFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payslips' });
  }
});

// ===== MEMBERS ENDPOINTS =====
const membersFile = await ensureDataFile('members-data.json');

app.get('/api/members', async (req, res) => {
  try {
    const data = await fs.readFile(membersFile, 'utf-8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load members' });
  }
});

app.post('/api/members', async (req, res) => {
  try {
    const members = JSON.parse((await fs.readFile(membersFile, 'utf-8')) || '[]');
    const newMember = {
      id: crypto.randomUUID(),
      joinDate: new Date().toISOString(),
      ...req.body,
    };
    members.push(newMember);
    await fs.writeFile(membersFile, JSON.stringify(members, null, 2));
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create member' });
  }
});

app.put('/api/members/:id', async (req, res) => {
  try {
    const members = JSON.parse((await fs.readFile(membersFile, 'utf-8')) || '[]');
    const index = members.findIndex((m) => m.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Member not found' });

    members[index] = { ...members[index], ...req.body };
    await fs.writeFile(membersFile, JSON.stringify(members, null, 2));
    res.json(members[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update member' });
  }
});

app.delete('/api/members', async (req, res) => {
  try {
    const { ids } = req.body;
    const members = JSON.parse((await fs.readFile(membersFile, 'utf-8')) || '[]');
    const filtered = members.filter((m) => !ids.includes(m.id));
    await fs.writeFile(membersFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete members' });
  }
});

// ===== ATTENDANCE ENDPOINTS =====
const attendanceFile = await ensureDataFile('attendance-data.json');

app.get('/api/attendance', async (req, res) => {
  try {
    const data = await fs.readFile(attendanceFile, 'utf-8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load attendance' });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const records = JSON.parse((await fs.readFile(attendanceFile, 'utf-8')) || '[]');
    const newRecord = {
      id: crypto.randomUUID(),
      ...req.body,
    };
    records.push(newRecord);
    await fs.writeFile(attendanceFile, JSON.stringify(records, null, 2));
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create attendance record' });
  }
});

app.put('/api/attendance/:id', async (req, res) => {
  try {
    const records = JSON.parse((await fs.readFile(attendanceFile, 'utf-8')) || '[]');
    const index = records.findIndex((r) => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Record not found' });

    records[index] = { ...records[index], ...req.body };
    await fs.writeFile(attendanceFile, JSON.stringify(records, null, 2));
    res.json(records[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update attendance record' });
  }
});

app.delete('/api/attendance', async (req, res) => {
  try {
    const { ids } = req.body;
    const records = JSON.parse((await fs.readFile(attendanceFile, 'utf-8')) || '[]');
    const filtered = records.filter((r) => !ids.includes(r.id));
    await fs.writeFile(attendanceFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete attendance records' });
  }
});

// ===== SUPPORT ENDPOINTS =====
const supportFile = await ensureDataFile('support-data.json');

app.get('/api/support', async (req, res) => {
  try {
    const data = await fs.readFile(supportFile, 'utf-8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load support tickets' });
  }
});

app.post('/api/support', async (req, res) => {
  try {
    const tickets = JSON.parse((await fs.readFile(supportFile, 'utf-8')) || '[]');
    const newTicket = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    tickets.push(newTicket);
    await fs.writeFile(supportFile, JSON.stringify(tickets, null, 2));
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create support ticket' });
  }
});

app.put('/api/support/:id', async (req, res) => {
  try {
    const tickets = JSON.parse((await fs.readFile(supportFile, 'utf-8')) || '[]');
    const index = tickets.findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Support ticket not found' });

    tickets[index] = { ...tickets[index], ...req.body };
    await fs.writeFile(supportFile, JSON.stringify(tickets, null, 2));
    res.json(tickets[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update support ticket' });
  }
});

app.delete('/api/support', async (req, res) => {
  try {
    const { ids } = req.body;
    const tickets = JSON.parse((await fs.readFile(supportFile, 'utf-8')) || '[]');
    const filtered = tickets.filter((t) => !ids.includes(t.id));
    await fs.writeFile(supportFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete support tickets' });
  }
});

// ===== JOBS ENDPOINTS =====
const jobsFile = await ensureDataFile('jobs-data.json');

app.get('/api/jobs', async (req, res) => {
  try {
    const data = await fs.readFile(jobsFile, 'utf-8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load job positions' });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const jobs = JSON.parse((await fs.readFile(jobsFile, 'utf-8')) || '[]');
    const newJob = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    jobs.push(newJob);
    await fs.writeFile(jobsFile, JSON.stringify(jobs, null, 2));
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job position' });
  }
});

app.put('/api/jobs/:id', async (req, res) => {
  try {
    const jobs = JSON.parse((await fs.readFile(jobsFile, 'utf-8')) || '[]');
    const index = jobs.findIndex((j) => j.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Job position not found' });

    jobs[index] = { ...jobs[index], ...req.body };
    await fs.writeFile(jobsFile, JSON.stringify(jobs, null, 2));
    res.json(jobs[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job position' });
  }
});

app.delete('/api/jobs', async (req, res) => {
  try {
    const { ids } = req.body;
    const jobs = JSON.parse((await fs.readFile(jobsFile, 'utf-8')) || '[]');
    const filtered = jobs.filter((j) => !ids.includes(j.id));
    await fs.writeFile(jobsFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job positions' });
  }
});

// ===== REFERENCES ENDPOINTS =====
const referencesFile = await ensureDataFile('references-data.json');

app.get('/api/references', async (req, res) => {
  try {
    const data = await fs.readFile(referencesFile, 'utf-8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load references' });
  }
});

app.post('/api/references', async (req, res) => {
  try {
    const refs = JSON.parse((await fs.readFile(referencesFile, 'utf-8')) || '[]');
    const newRef = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    refs.push(newRef);
    await fs.writeFile(referencesFile, JSON.stringify(refs, null, 2));
    res.status(201).json(newRef);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reference' });
  }
});

app.put('/api/references/:id', async (req, res) => {
  try {
    const refs = JSON.parse((await fs.readFile(referencesFile, 'utf-8')) || '[]');
    const index = refs.findIndex((r) => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Reference not found' });

    refs[index] = { ...refs[index], ...req.body };
    await fs.writeFile(referencesFile, JSON.stringify(refs, null, 2));
    res.json(refs[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reference' });
  }
});

app.delete('/api/references', async (req, res) => {
  try {
    const { ids } = req.body;
    const refs = JSON.parse((await fs.readFile(referencesFile, 'utf-8')) || '[]');
    const filtered = refs.filter((r) => !ids.includes(r.id));
    await fs.writeFile(referencesFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete references' });
  }
});

// ===== BENEFITS ENDPOINTS =====
const benefitsFile = await ensureDataFile('benefits-data.json');

app.get('/api/benefits', async (req, res) => {
  try {
    const data = await fs.readFile(benefitsFile, 'utf-8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load benefits' });
  }
});

app.post('/api/benefits', async (req, res) => {
  try {
    const benefits = JSON.parse((await fs.readFile(benefitsFile, 'utf-8')) || '[]');
    const totalCost = (req.body.employeeCost || 0) + (req.body.employerCost || 0);
    const newBenefit = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      totalCost,
      ...req.body,
    };
    benefits.push(newBenefit);
    await fs.writeFile(benefitsFile, JSON.stringify(benefits, null, 2));
    res.status(201).json(newBenefit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create benefit plan' });
  }
});

app.put('/api/benefits/:id', async (req, res) => {
  try {
    const benefits = JSON.parse((await fs.readFile(benefitsFile, 'utf-8')) || '[]');
    const index = benefits.findIndex((b) => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Benefit plan not found' });

    const totalCost =
      (req.body.employeeCost !== undefined ? req.body.employeeCost : benefits[index].employeeCost) +
      (req.body.employerCost !== undefined ? req.body.employerCost : benefits[index].employerCost);
    benefits[index] = { ...benefits[index], totalCost, ...req.body };
    await fs.writeFile(benefitsFile, JSON.stringify(benefits, null, 2));
    res.json(benefits[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update benefit plan' });
  }
});

app.delete('/api/benefits', async (req, res) => {
  try {
    const { ids } = req.body;
    const benefits = JSON.parse((await fs.readFile(benefitsFile, 'utf-8')) || '[]');
    const filtered = benefits.filter((b) => !ids.includes(b.id));
    await fs.writeFile(benefitsFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete benefit plans' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
  console.log(`📁 Users file: ${usersFile}`);
  console.log(`📁 Documents file: ${docsFile}`);
  console.log(`📁 Members file: ${membersFile}`);
  console.log(`📁 Payslips file: ${payslipsFile}`);
  console.log(`📁 Attendance file: ${attendanceFile}`);
  console.log(`📁 Support file: ${supportFile}`);
  console.log(`📁 Jobs file: ${jobsFile}`);
  console.log(`📁 References file: ${referencesFile}`);
  console.log(`📁 Benefits file: ${benefitsFile}`);
});

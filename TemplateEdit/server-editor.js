/**
 * Template editor server — Node.js (JavaScript), not Java.
 * You only need to run this if you want to:
 *   - Upload images from the editor into public/images
 *   - Save generated project pages to projects/ from the editor
 *
 * Run: npm install   (once)
 *      npm run editor
 * Then open: http://localhost:3333/template-editor.html
 *
 * Without the server: use the editor with image URLs and "Download HTML", then move the file to projects/ yourself.
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3333;
const ROOT = __dirname;
// Portfolio root is parent of TemplateEdit; projects and public live there
const PORTFOLIO_ROOT = path.join(ROOT, '..');
const PUBLIC_IMAGES = path.join(PORTFOLIO_ROOT, 'public', 'images');
const PROJECTS_DIR = path.join(PORTFOLIO_ROOT, 'projects');
const PROJECTS_JSON = path.join(PROJECTS_DIR, 'projects.json');

// Ensure directories exist
if (!fs.existsSync(PUBLIC_IMAGES)) fs.mkdirSync(PUBLIC_IMAGES, { recursive: true });
if (!fs.existsSync(PROJECTS_DIR)) fs.mkdirSync(PROJECTS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PUBLIC_IMAGES),
  filename: (req, file, cb) => {
    const safe = path.basename(file.originalname || 'image').replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safe);
  },
});
const upload = multer({ storage });

app.use(express.static(ROOT, { index: false }));

app.get('/', (req, res) => res.redirect('/template-editor.html'));

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file' });
  }
  const url = 'public/images/' + req.file.filename;
  res.json({ url });
});

app.post('/api/save', express.json(), (req, res) => {
  const slug = (req.body.slug || '').replace(/[^a-z0-9-]/gi, '-');
  if (!slug) {
    return res.status(400).json({ error: 'Missing slug' });
  }
  const filePath = path.join(PROJECTS_DIR, slug + '.html');
  fs.writeFileSync(filePath, req.body.html || '', 'utf8');

  const meta = req.body.meta || {};
  let projects = [];
  if (fs.existsSync(PROJECTS_JSON)) {
    try {
      projects = JSON.parse(fs.readFileSync(PROJECTS_JSON, 'utf8'));
    } catch (e) {
      projects = [];
    }
  }
  if (!Array.isArray(projects)) projects = [];

  const entry = {
    slug,
    title: meta.title || slug,
    category: meta.category || '',
    dataCategory: Array.isArray(meta.dataCategory) ? meta.dataCategory : (meta.dataCategory ? [meta.dataCategory] : []),
    description: meta.description || '',
    tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
    image: meta.image || '',
  };

  const idx = projects.findIndex((p) => (p.slug || '').toLowerCase() === slug.toLowerCase());
  if (idx >= 0) projects[idx] = entry;
  else projects.push(entry);

  fs.writeFileSync(PROJECTS_JSON, JSON.stringify(projects, null, 2), 'utf8');

  res.json({ path: 'projects/' + slug + '.html' });
});

app.listen(PORT, () => {
  console.log('Template editor: http://localhost:' + PORT + '/template-editor.html');
  console.log('  Uploads → public/images/   Save → projects/<slug>.html');
});

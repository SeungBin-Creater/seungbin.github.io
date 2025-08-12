const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// DB 연결
const db = new sqlite3.Database('./database.sqlite');

// 테이블 생성 (없으면 자동 생성)
db.run(`
  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT,
    userAgent TEXT,
    page TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 방문 기록 API
app.post('/api/visit', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ua = req.headers['user-agent'];
  const page = req.body.page || '/';

  db.run(
    `INSERT INTO visits (ip, userAgent, page) VALUES (?, ?, ?)`,
    [ip, ua, page],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'DB Error' });
      }
      res.json({ success: true });
    }
  );
});

// 방문 통계 API
app.get('/api/stats', (req, res) => {
  db.all(`SELECT page, COUNT(*) as count FROM visits GROUP BY page`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'DB Error' });
    }
    res.json(rows);
  });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Configuração do Multer para uploads de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Configuração do banco de dados
const db = new sqlite3.Database('sales_funnel.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS stages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS contents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            stage_id INTEGER,
            type TEXT,
            content TEXT,
            FOREIGN KEY(stage_id) REFERENCES stages(id)
        )
    `);
});

app.use(express.json());
app.use(express.static('public'));

// Salvar nova etapa
app.post('/save-stage', (req, res) => {
    const { name } = req.body;
    db.run(`INSERT INTO stages (name) VALUES (?)`, [name], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ stageId: this.lastID });  // Certifique-se de sempre retornar uma resposta JSON válida
    });
});

// Salvar conteúdo
app.post('/save-content', upload.single('file'), (req, res) => {
    const { stageId, type, content } = req.body;
    let contentValue = type === 'mensagem' ? content : req.file.filename;

    db.run(`INSERT INTO contents (stage_id, type, content) VALUES (?, ?, ?)`, [stageId, type, contentValue], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ contentId: this.lastID });
    });
});

// Atualizar o nome da etapa
app.put('/update-stage/:id', (req, res) => {
    const { name } = req.body;
    const stageId = req.params.id;

    db.run(`UPDATE stages SET name = ? WHERE id = ?`, [name, stageId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Stage updated successfully' });
    });
});

// Remover etapa
app.delete('/delete-stage/:id', (req, res) => {
    const stageId = req.params.id;

    db.run(`DELETE FROM stages WHERE id = ?`, stageId, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.run(`DELETE FROM contents WHERE stage_id = ?`, stageId, function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Stage and related contents deleted successfully' });
        });
    });
});

// Remover conteúdo
app.delete('/delete-content/:id', (req, res) => {
    const contentId = req.params.id;

    db.run(`DELETE FROM contents WHERE id = ?`, contentId, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Content deleted successfully' });
    });
});

// Servir uploads
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

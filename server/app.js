const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'supersecretkey';
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware pour autoriser les requêtes CORS
app.use(cors({
    origin: 'http://localhost:8080',  // Seules les requêtes de localhost:8080 sont autorisées
    methods: 'GET, POST',
}));

// Middleware pour parser les données JSON
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'formation_site',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database');
    }
});

app.listen(port, () => {
    console.log(`Express Server listening on http://localhost:${port}`);
});

// Middleware pour authentifier l'utilisateur via le token JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extraire le token du header
  
    if (!token) {
      return res.status(401).send({ message: 'Unauthorized access, missing token.' });
    }
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send({ message: 'Invalid token.' });
      }
  
      req.user = user; // Attacher les données utilisateur à la requête
      next(); // Passer au middleware suivant
    });
  };
  

// Route pour récupérer les informations de l'utilisateur
app.get('/api/user', authenticateToken, (req, res) => {
    const userId = req.user.id;  // Le `id` de l'utilisateur est extrait du token

    db.query('SELECT name, email FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }
        if (results.length > 0) {
            res.json(results[0]);  // Renvoi les informations de l'utilisateur
        } else {
            res.status(404).send({ message: 'User not found' });  // Si l'utilisateur n'est pas trouvé
        }
    });
});

// Route d'inscription
app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'user'],
            (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(201).send({ message: 'Utilisateur enregistré avec succès.' });
            }
        );
    } catch (err) {
        console.error('Error with hashing:', err);
        res.status(500).send({ error: 'Error saving.' });
    }
});

// Route de connexion
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        db.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (err, results) => {
                if (err) {
                    return res.status(500).send(err);
                }
                if (results.length === 0) {
                    return res.status(401).send({ message: 'Email ou mot de passe incorrect.' });
                }

                const user = results[0];

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).send({ message: 'Email ou mot de passe incorrect.' });
                }

                const token = jwt.sign(
                    { id: user.id, email: user.email, role: user.role },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.status(200).send({ message: 'Connexion réussie.', token });
            }
        );
    } catch (err) {
        console.error('Error generating token:', err);
        res.status(500).send({ error: 'Error connecting.' });
    }
});


// Route pour ajouter une formation
app.post('/api/formations', authenticateToken, (req, res) => {
    const { title, description, file_path } = req.body;
  
    // Vérifie que les champs sont bien renseignés
    if (!title || !description || !file_path) {
      return res.status(400).send({ error: 'Tous les champs sont requis.' });
    }
  
    // Ajouter la formation dans la base de données
    db.query(
      'INSERT INTO formations (title, description, file_path, created_at) VALUES (?, ?, ?, NOW())',
      [title, description, file_path], // Insérer les valeurs dans la base de données
      (err, result) => {
        if (err) {
          return res.status(500).send({ error: 'Erreur lors de l\'ajout de la formation.' });
        }
        res.status(201).send({ message: 'Formation ajoutée avec succès.' });
      }
    );
});
  

// Route pour ajouter une formation HTML
app.post('/api/formations/html', authenticateToken, (req, res) => {
    const { title, description, file_path } = req.body;
  
    db.query(
      'INSERT INTO formations (title, description, file_path) VALUES (?, ?, ?)',
      [title || 'HTML Training', description || 'Learn the basics of HTML', file_path || './assets/01 HTML.pdf'],
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(201).send({ message: 'HTML Training added successfully.' });
      }
    );
});
  
app.post('/api/quizzes', authenticateToken, (req, res) => {
    const { formation_id, question, options, correct_option } = req.body;
  
    db.query(
      'INSERT INTO quizzes (formation_id, question, options, correct_option) VALUES (?, ?, ?, ?)',
      [formation_id, question, JSON.stringify(options), correct_option],
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(201).send({ message: 'Quiz successfully added.' });
      }
    );
});

app.use(express.static('public')); // Servez les fichiers statiques depuis le dossier 'public'

// Route pour récupérer une formation par son ID
app.get('/api/formations/:id', authenticateToken, (req, res) => {
    const { id } = req.params;  // Récupère l'ID de la formation depuis l'URL
  
    db.query('SELECT * FROM formations WHERE id = ?', [id], (err, results) => {
      if (err) {
        return res.status(500).send({ error: 'Erreur interne du serveur.' });
      }
  
      if (results.length === 0) {
        return res.status(404).send({ message: 'Formation non trouvée.' });
      }
  
      res.status(200).send(results[0]); // Retourne la formation trouvée
    });
});
  
  
// Route pour récupérer toutes les formations
app.get('/api/formations', authenticateToken, (req, res) => {
    db.query('SELECT * FROM formations', (err, results) => {
      if (err) {
        return res.status(500).send({ error: 'Erreur interne du serveur.' });
      }
      if (results.length === 0) {
        return res.status(404).send({ message: 'Aucune formation trouvée.' });
      }
      res.status(200).send(results); // Retourne toutes les formations
    });
});
  
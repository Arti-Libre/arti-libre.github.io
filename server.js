const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'artisans',
    port: 3301
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connexion avec la base de données effectuée !');
});

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 

app.use(express.static('public'));

app.get('/results', (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm) {
        return res.render('recherche', { results: [] });
    }

    const keywords = searchTerm.split(' ').map(keyword => `%${keyword}%`);
    
    const conditions = keywords.map(() => 
        `(metier LIKE ? OR description LIKE ? OR nom LIKE ? OR prenom LIKE ? OR ville LIKE ?)`
    ).join(' OR ');

    const points = keywords.map((_, index) => `
        ((metier LIKE ? OR description LIKE ? OR nom LIKE ? OR prenom LIKE ? OR ville LIKE ?) * ${index + 1})
    `).join(' + ');

    const sql = `
        SELECT *,
            ${points} AS total_points
        FROM artisans
        WHERE ${conditions}
        ORDER BY total_points DESC
    `;

    // Préparer les valeurs pour les placeholders
    const values = keywords.flatMap(keyword => [
        keyword, keyword, keyword, keyword, keyword
    ]);

    // Ajout des valeurs pour le calcul des points
    const allValues = [...values, ...values, ...values];

    db.query(sql, allValues, (err, results) => {
        if (err) throw err;
        res.render('recherche', { results });
    });
});





// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

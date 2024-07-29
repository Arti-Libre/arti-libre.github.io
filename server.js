const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 3000;

// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'artisans'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connexion avec la base de données effectuée !');
});

// Configuration du moteur de template
app.set('view engine', 'ejs'); // Définit EJS comme moteur de template
app.set('views', path.join(__dirname, 'views')); // Définit le répertoire des vues

// Middleware pour servir les fichiers statiques (CSS, JS, images, etc.)
app.use(express.static('public'));

// Route pour afficher la page des résultats
app.get('/results', (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm) {
        return res.render('recherche', { results: [] });
    }

    // Décomposer le terme de recherche en mots-clés
    const keywords = searchTerm.split(' ').map(keyword => `%${keyword}%`);
    
    // Générer les conditions de recherche pour chaque mot-clé
    const conditions = keywords.map(() => 
        `(metier LIKE ? OR description LIKE ? OR nom LIKE ? OR prenom LIKE ? OR ville LIKE ?)`
    ).join(' OR ');

    // Générer la clause de calcul de la pertinence (points) basée sur les correspondances
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

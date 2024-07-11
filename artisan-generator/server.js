const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Utiliser le body-parser pour les requêtes JSON
app.use(express.static('public'));

app.post('/generate', (req, res) => {
    const { nom, bio, photo, entreprise, description, metier, diplomes, logo, profession, ville } = req.body;

    // Validation des données
    if (!nom || !bio || !photo || !entreprise || !description || !metier || !diplomes || !logo || !profession || !ville) {
        return res.status(400).send('Tous les champs sont obligatoires.');
    }

    // Assurez-vous que nom est une chaîne avant d'utiliser replace
    if (typeof nom !== 'string') {
        return res.status(400).send('Le nom doit être une chaîne de caractères.');
    }

    const fileName = `${nom.replace(/ /g, '_')}.html`;
    const filePath = path.join(__dirname, 'public/artisans', fileName);
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page de ${nom}</title>
    <link rel="stylesheet" href="/styles/artisans.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <header>
        <div class="headerglobal">
            <img src="/images/logo-arti-libre.png" alt="">
            <div class="clickables">
                <p>Artisans</p>
                <p>Contact</p>
            </div>
            <div class="buttons">
                <button>Devenir Artisan</button>
                <p>Se connecter</p>
            </div>
        </div>
    </header>
    <div class="globaldiv">
        <div class="firstbloc">
            <div class="leftcolumn">
                <div class="leftbloc">
                    <iframe class="map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43297.92311145543!2d-2.4033578692837563!3d47.29245071739339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48055d195853e105%3A0x40d37521e0df090!2s44500%20La%20Baule-Escoublac!5e0!3m2!1sfr!2sfr!4v1720455033927!5m2!1sfr!2sfr"
                        width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"></iframe>
                    <div class="pres">
                        <img class="pp" src="${photo}" alt="Photo de ${nom}">
                    </div>
                    <h1>${nom}</h1>
                    <p class="workxcompany">${metier} · ${entreprise}</p>
                    <p class="bio">${bio}</p>
                    <div class="certficiations">
                        <i class="fa-solid fa-graduation-cap"></i>
                        <p>${diplomes}</p>
                    </div>
                </div>
            </div>
            <div class="rightcolumn">
                <div class="rightbloc">
                    <div class="top">
                        <img class="pp" src="${logo}" alt="Logo de ${entreprise}">
                        <div class="presrap">
                            <h1 style="margin-left: 20px;">${entreprise}</h1>
                            <p class="workxcompany">${profession}</p>
                        </div>
                    </div>
                    <div class="texte">
                        ${description}
                    </div>
                </div>
                <div class="rightdownbloc">
                    <div class="bodyrightdownbloc">
                        <div class="topbodyrightdownbloc">
                            <div class="left">
                                <i class="fa-solid fa-phone"></i>
                                <a href="tel:02.40.45.43.22">
                                    <p>02.40.45.43.22</p>
                                </a>
                            </div>
                            <div class="right">
                                <i class="fa-solid fa-envelope"></i>
                                <a href="#previousworking">
                                    <p>Envoyer une demande de contact</p>
                                </a>
                            </div>
                        </div>
                        <div class="bottombodyrightdownbloc">
                            <div class="left">
                                <i class="fa-solid fa-map-pin"></i>
                                <a href="https://www.google.com/maps?q=${ville}">
                                    <p>${ville}</p>
                                </a>
                            </div>
                            <div class="right">
                                <i class="fa-solid fa-phone-flip"></i>
                                <a href="mailto:devis@assist-renov.com">
                                    <p>devis@assist-renov.com</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="previousworking" id="previousworking">
                <div class="top">
                    <h1>Précédents chantiers</h1>
                </div>
                <div class="caroussel">
                    <iframe src="caroussel.html" frameborder="0"></iframe>
                </div>
            </div>
            <div class="avis">
                <div class="top">
                    <h1>Avis</h1>
                </div>
                <div class="caroussel">
                    <iframe src="carroussel_avis.html" frameborder="0" style="height: 300px;"></iframe>
                </div>
            </div>
            <div class="aboutwork">
                <div class="top">
                    <h1>A propos du métier...</h1>
                    <p>Le métier de maçon consiste à construire et rénover des structures en briques, pierres ou parpaings.
                        Il interprète des plans, prépare les fondations et monte les murs en respectant les normes de
                        sécurité. Le maçon réalise également des travaux de finition, comme les enduits et les dallages.
                        Doté d'une grande précision et d'une bonne condition physique, il travaille souvent en équipe sur
                        des chantiers variés. La polyvalence et la connaissance des matériaux sont essentielles pour
                        s'adapter aux différentes techniques de construction. Enfin, le métier de maçon offre de nombreuses
                        opportunités d'emploi dans le secteur du bâtiment, avec des perspectives d'évolution vers des postes
                        de chef de chantier ou d'artisan indépendant.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    fs.writeFile(filePath, htmlContent, (err) => {
        if (err) {
            return res.status(500).send('Erreur lors de la création du fichier.');
        }
        res.send(`Page créée avec succès ! <a href="/artisans/${fileName}">Voir la page</a>`);
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

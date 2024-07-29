// JavaScript pour le popup dans la page parente
(function() {
    // Fonction pour ouvrir le popup avec l'image cliquée
    function openPopup(imageUrl) {
        // Créer un événement personnalisé pour envoyer l'URL de l'image au parent
        var event = new CustomEvent('openPopup', { detail: imageUrl });
        // Envoyer l'événement au parent
        window.parent.dispatchEvent(event);
    }

    // Gestion des événements sur les images dans le iframe
    var images = document.querySelectorAll('.caroussel img');
    images.forEach(function(image) {
        image.onclick = function() {
            var imageUrl = this.src;
            // Appeler la fonction pour ouvrir le popup dans la page parente
            openPopup(imageUrl);
        };
    });
})();

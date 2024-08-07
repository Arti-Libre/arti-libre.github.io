document.addEventListener('DOMContentLoaded', function() {
    var burgerMenu = document.querySelector('.burgermenue');
    var burgerMenuScroll = document.querySelector('#scroll');
    var popup = document.getElementById('popup');
    var closeBtn = document.querySelector('.close');

    burgerMenu.addEventListener('click', function() {
        popup.style.display = 'block';
    });

    burgerMenuScroll.addEventListener('click', function(){
        popup.style.display = 'block';
    });

    closeBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    // Fermer la popup si l'utilisateur clique en dehors de la popup
    window.addEventListener('click', function(event) {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    });
});
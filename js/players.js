class Player {
    constructor(nom, sante, arme,) {
        this.nom = nom;
        //this.visuel = visuel; A RAJOUTER
        this.sante = sante;
        this.arme = arme;
        this._coordonnees = {};
        this.game;
    }
    set coord(value) {
        this._coordonnees = {
            x: value[0],
            y: value[1]
        };
    }
    get coord() {
        return this._coordonnees;
    }
    // Méthode pour identifier les cases potentielles pour le déplacement du joueur.
    casesPossiblesDeplacement() {
        let positionJoueur = this.coord;
        let $casePotentielle;

        // On identifie les cases potentielles à droite du joueur.
        let i = 1;
        $casePotentielle = $(`#${positionJoueur.x + i}-${positionJoueur.y}`);
        while (i <= 3 && !$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
            $casePotentielle.addClass('casesSurbrillance');

            i++;
            $casePotentielle = $(`#${positionJoueur.x + i}-${positionJoueur.y}`);
        }

        // On identifie les cases potentielles à gauche du joueur.
        let j = 1
        $casePotentielle = $(`#${positionJoueur.x - j}-${positionJoueur.y}`);
        while (j <= 3 && !$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
            $casePotentielle.addClass('casesSurbrillance');

            j++;
            $casePotentielle = $(`#${positionJoueur.x - j}-${positionJoueur.y}`);
        }

        // On identifie les cases potentielles au dessus du joueur.
        let k = 1;
        $casePotentielle = $(`#${positionJoueur.x}-${positionJoueur.y + k}`);
        while (k <= 3 && !$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
            $casePotentielle.addClass('casesSurbrillance');

            k++;
            $casePotentielle = $(`#${positionJoueur.x}-${positionJoueur.y + k}`);
        }

        // On identifie les cases potentielles en dessous du joueur.
        let l = 1
        $casePotentielle = $(`#${positionJoueur.x}-${positionJoueur.y - l}`);
        while (l <= 3 && !$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
            $casePotentielle.addClass('casesSurbrillance');

            l++;
            $casePotentielle = $(`#${positionJoueur.x}-${positionJoueur.y - l}`);
        }

        // Création d'une variable avec les cases possibles pour le déplacement.
        let $casesSurbrillance = $('.casesSurbrillance');

        // On écoute le "clic" sur la case possible en déplacement.
        $casesSurbrillance.on('click', event => {
            this.game.deplacer(this, event.target);

            // On arrête d'écouter le "clic" sur les cases en surbrillance.
            $casesSurbrillance.off('click');

            // On efface les cases en surbrillance.
            $casesSurbrillance.removeClass('casesSurbrillance');
        });
    }
    
    // Méthode de déplacement du joueur sur les cases potentielles.
    deplacementJoueur() {
        // Récupération de la case joueur.
        let $positionJoueur = $(`#${this.coord.x}-${this.coord.y}`);
    }
}

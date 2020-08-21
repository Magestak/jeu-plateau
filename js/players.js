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
        i = 1;
        $casePotentielle = $(`#${positionJoueur.x - i}-${positionJoueur.y}`);
        while (i <= 3 && !$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
            $casePotentielle.addClass('casesSurbrillance');

            i++;
            $casePotentielle = $(`#${positionJoueur.x - i}-${positionJoueur.y}`);
        }

        // On identifie les cases potentielles au dessus du joueur.
        i = 1;
        $casePotentielle = $(`#${positionJoueur.x}-${positionJoueur.y + i}`);
        while (i <= 3 && !$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
            $casePotentielle.addClass('casesSurbrillance');

            i++;
            $casePotentielle = $(`#${positionJoueur.x}-${positionJoueur.y + i}`);
        }

        // On identifie les cases potentielles en dessous du joueur.
        i = 1;
        $casePotentielle = $(`#${positionJoueur.x}-${positionJoueur.y - i}`);
        while (i <= 3 && !$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
            $casePotentielle.addClass('casesSurbrillance');

            i++;
            $casePotentielle = $(`#${positionJoueur.x}-${positionJoueur.y - i}`);
        }
    }
    
    // Méthode de déplacement du joueur sur les cases potentielles.
    deplacementJoueur() {
        // Récupération de la case joueur.
        let $positionJoueur = $(`#${this.coord.x}-${this.coord.y}`);
    }
}

class Player {
    constructor(nom, visuel, sante) {
        this.nom = nom;
        this.visuel = visuel;
        this.sante = sante;
        this.arme = new Weapon("Couteau",'<img src="img/couteau2-min.png" alt="couteau" class="imgTableau">', 10); // Arme initiale des 2 joueurs;
        this._coordonnees = {};
        this.game;
        this.bouclier = false;
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

    /**
     * Permet de mettre en "surbrillance" les cases potentielles pour le déplacement du joueur
     */
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

    toString() {
        return this.nom;
    }
}
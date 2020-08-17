class Player {
    constructor(nom, sante, arme,) {
        this.nom = nom;
        //this.visuel = visuel; A RAJOUTER
        this.sante = sante;
        this.arme = arme;
        this._coordonnees = [];
    }
    set coord(value) {
        this._coordonnees = value;
    }
    get coord() {
        const coords = this._coordonnees;
        return {
            x: coords[0],
            y: coords[1]
        };
    }
    casesPossiblesDeplacement(joueur) {
        let positionJoueur = joueur.coord;
        console.log(positionJoueur); // A ENLEVER 
        let $casePotentielle;
        for (let i = 1; i <= 3; i++) {
            $casePotentielle = $(`#${positionJoueur.x + i}-${positionJoueur.y}`);
            if (!$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
                $casePotentielle.addClass('casesSurbrillance');
            } else {
                break;
            }
        }
        for (let j = 1; j <= 3; j++) {
            $casePotentielle = $(`#${positionJoueur.x - j}-${positionJoueur.y}`);
            if (!$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
                $casePotentielle.addClass('casesSurbrillance');
            } else {
                break;
            }
        }
        for (let k = 1; k <= 3; k++) {
            $casePotentielle = $(`#${positionJoueur.x}-${positionJoueur.y + k}`);
            if (!$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
                $casePotentielle.addClass('casesSurbrillance');
            } else {
                break;
            }
        }
        for (let l = 1; l <= 3; l++) {
            $casePotentielle = $(`#${positionJoueur.x}-${positionJoueur.y - l}`);
            if (!$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
                $casePotentielle.addClass('casesSurbrillance');
            } else {
                break;
            }
        }
    }
    deplacementJoueur(joueur) {
        let $casesSurbrillance = $('.casesSurbrillance')
        console.log($casesSurbrillance);
    }
}

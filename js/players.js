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
    // Méthode pour identifier les cases potentielles pour le déplacement du joueur.
    casesPossiblesDeplacement(joueur) {
        let positionJoueur = joueur.coord;
        let $casePotentielle;
        // On identifie les cases potentielles à droite du joueur.
        for (let i = 1; i <= 3; i++) {
            $casePotentielle = $(`#${positionJoueur.x + i}-${positionJoueur.y}`);
            if (!$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
                $casePotentielle.addClass('casesSurbrillance');
            } else {
                break;
            }
        }
        // On identifie les cases potentielles à gauche du joueur.
        for (let j = 1; j <= 3; j++) {
            $casePotentielle = $(`#${positionJoueur.x - j}-${positionJoueur.y}`);
            if (!$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
                $casePotentielle.addClass('casesSurbrillance');
            } else {
                break;
            }
        }
        // On identifie les cases potentielles au dessus du joueur.
        for (let k = 1; k <= 3; k++) {
            $casePotentielle = $(`#${positionJoueur.x}-${positionJoueur.y + k}`);
            if (!$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
                $casePotentielle.addClass('casesSurbrillance');
            } else {
                break;
            }
        }
        // On identifie les cases potentielles en dessous du joueur.
        for (let l = 1; l <= 3; l++) {
            $casePotentielle = $(`#${positionJoueur.x}-${positionJoueur.y - l}`);
            if (!$casePotentielle.hasClass('casesObstacles') && !$casePotentielle.hasClass('casesJoueurs')) {
                $casePotentielle.addClass('casesSurbrillance');
            } else {
                break;
            }
        }
        //this.deplacementJoueur(joueur);
    }
    
    // Méthode de déplacement du joueur sur les cases potentielles.
    deplacementJoueur(joueur) {
        //debugger;
        let $positionJoueur = $(`#${joueur.coord.x}-${joueur.coord.y}`);
        console.log(joueur); // A ENLEVER
        console.log($positionJoueur); // A ENLEVER
        let $casesSurbrillance = $('.casesSurbrillance');
        
        $casesSurbrillance.on('click', function (event) {
            //console.log("EVENT:", event); // A ENLEVER
            let $newPosJoueurId = event.target.id.split('-');
            $casesSurbrillance.removeClass('casesSurbrillance'); //TEST
            $casesSurbrillance = ""; ///////////// A REGARDER CAUSE CLIC POSSIBLE POST MOUVEMENT/////////
            $positionJoueur.removeClass('casesJoueurs').html("");

            let $newPosJoueur = $newPosJoueurId.map(Number);
            
            joueur.coord = $newPosJoueur;
            console.log(joueur); // A ENLEVER
            $positionJoueur = $(`#${joueur.coord.x}-${joueur.coord.y}`);
            $positionJoueur.addClass('casesJoueurs').html(joueur.nom);
            console.log($positionJoueur); // A ENLEVER

        });
    }
}

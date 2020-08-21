class Map {
    constructor(nbLignes, nbColonnes, x, y, casesObstacles) {
        this.nbLignes = nbLignes;
        this.nbColonnes = nbColonnes;
        this.x = x;
        this.y = y;
        this.casesObstacles = casesObstacles;
    }
    // Méthode de génération d'une map vide.
    genererMapVide() {
        // Création des lignes.
        for (let i = 0; i < this.nbLignes; i++) {
            const trElt = document.createElement('tr');
            trElt.id = 'line-' + i;
            document.getElementById('gameMap').appendChild(trElt);
            
            // Création des cellules.
            for (let j = 0; j < this.nbColonnes; j++) {
                const tdElt = document.createElement('td');
                tdElt.id = this.x + '-' + this.y;
                tdElt.classList.add("casesAccessibles"); // On ajoute la classe css "casesAccessibles".
                document.getElementById(`line-${this.y}`).appendChild(tdElt);
                this.x++; // Remplir vers la droite.
        
                // Passer à la ligne.
                if(document.getElementById(`line-${this.y}`).children.length == this.nbColonnes) {
                    this.y++; // On descend d'une ligne.
                    this.x = 0; // On recommence à gauche.
                }
            }
        }
    }
    // Méthode de génération de cases aléatoires pour les autres méthodes.
    genererCasesAleatoires() {
        let cases = document.getElementsByTagName('td');
        let casesAleatoires = Math.floor(Math.random() * cases.length); // Calcul d'un nombre aléatoire.
        return cases[casesAleatoires]; // Retourne une case aléatoire dans la grille.
    }
    // Méthode de génération des cases obstacles sur la map vide.
    genererCasesObstacles() {
        for (let i = 0; i < this.casesObstacles; i++) {
            // On récupère une case aléatoire gràce à la méthode genererCasesAleatoires, depuis la fonction `recupererCaseAleatoire`.
            // On utilise ici `.call` pour passer le `this` à la fonction `recupererCaseAleatoire`.
            const caseNoire = recupererCaseAleatoire.call(this, function verifieLaCase(caseGeneree) { 
                // Il ne faut pas que la `caseGeneree` soit déjà une `casesObstacles`.
                return !caseGeneree.classList.contains('casesObstacles');
            });
            // On retire la classe css "casesAccessibles" à la case tirée aléatoirement.
            caseNoire.classList.remove('casesAccessibles');
            // On attribue la classe css "casesObstacles" aux cases sélectionnées aléatoirement.
            caseNoire.classList.add('casesObstacles');
        }
    }
    // Méthode de positionnement des armes sur la map;
    insererArmesMap(tableauArmes) {
        tableauArmes.forEach(arme => {
            // On récupère une case aléatoire gràce à la méthode genererCasesAleatoires, depuis la fonction `recupererCaseAleatoire`.
            // On utilise ici `.call` pour passer le `this` à la fonction `recupererCaseAleatoire`.
            const caseArme = recupererCaseAleatoire.call(this, function verifieLaCase(caseGeneree) {
                return (
                    // Il ne faut pas que la `caseGeneree` soit déjà une `casesObstacles` ou une `casesArmes`.
                    !caseGeneree.classList.contains('casesObstacles') &&
                    !caseGeneree.classList.contains('casesArmes')
                )
            });
            // On attribue la classe css "casesArmes" aux cases sélectionnées aléatoirement.
            caseArme.classList.add('casesArmes');
            caseArme.innerHTML = arme.nom;
        });
    }

    // Méthode de positionnement des joueurs sur la map.
    insererJoueursMap(tableauJoueurs) {
        tableauJoueurs.forEach(joueur => {
            // On récupère une case aléatoire gràce à la méthode genererCasesAleatoires, depuis la fonction `recupererCaseAleatoire`.
            // On utilise ici `.call` pour passer le `this` à la fonction `recupererCaseAleatoire`.
            const caseJoueur = recupererCaseAleatoire.call(this, function verifieLaCase(caseGeneree) {
                return (
                    // Il ne faut pas que la `caseGeneree` soit déjà une `casesObstacles` ou une`casesArmes`, ou une `casesJoueurs`.
                    !caseGeneree.classList.contains('casesObstacles') &&
                    !caseGeneree.classList.contains('casesArmes') &&
                    !caseGeneree.classList.contains('casesJoueurs') &&
                    // ni que cette case soit adjacente à une autre case joueur.
                    verifierCasesAdjacentes(caseGeneree, coords => {
                        return [
                            $(`#${coords.x - 1}-${coords.y}`),
                            $(`#${coords.x + 1}-${coords.y}`),
                            $(`#${coords.x}-${coords.y - 1}`),
                            $(`#${coords.x}-${coords.y + 1}`)
                        ].reduce((prev, curr) => {
                            if (!prev) return false;
                            if (curr.length === 0) return true;
                            return !curr.hasClass('casesJoueurs')
                        }, true);
                    })
                )
            });
            // On récupère l'ID de la case joueur en lui appliquant la méthode `.split`.
            let idJoueur = caseJoueur.id.split('-');
            // On attribue la classe css "casesJoueurs".
            caseJoueur.classList.add('casesJoueurs');
            caseJoueur.innerHTML = joueur.nom;
            // on attribue l'ID de la case joueur à la propriété `coordonnées`du player avec la méthode `map`.
            joueur.coord = idJoueur.map(Number);
        });
    }

    viderCasesSurbrillance() {
        $('.casesSurbrillance').each((idx, cellule) => {
            cellule.classList.remove('casesSurbrillance');
        });
    }
}

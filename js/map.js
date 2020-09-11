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
            // On récupère une case aléatoire grâce à la méthode `genererCasesAleatoires`, depuis la fonction `recupererCaseAleatoire`.
            // On utilise ici `.call` pour passer le `this` à la fonction `recupererCaseAleatoire`.
            const caseNoire = recupererCaseAleatoire.call(this, function verifieLaCase(caseGeneree) { 
                // Si la `caseGeneree` est déjà une "casesObstacles", on prend une autre `caseGeneree`.
                if (caseGeneree.classList.contains('casesObstacles')) return false;

                // On s'assure que 2 "casesObstacles" ne se trouvent pas côte à côte.
                // Renvoi true si AUCUNE "casesObstacles" ne se trouve autour, sinon FALSE.
                return verifierCasesAdjacentes(
                    caseGeneree,
                    (cellule, prev) => {
                        // Si on a déjà trouvé une "casesObstacles", on saute à la fin.
                        if (prev === true) return true;

                        // Renvoi TRUE si la case vérifiée est une "casesObstacles"
                        return cellule.classList.contains('casesObstacles');
                    }
                ) !== true; // Si on n'a PAS trouvé de "casesObstacles" autour de la case générée, tout est bon (renvoi TRUE).
            });
            // On retire la classe css "casesAccessibles" à la case tirée aléatoirement.
            caseNoire.classList.remove('casesAccessibles');
            // On attribue la classe css "casesObstacles" à la case.
            caseNoire.classList.add('casesObstacles');
        }
    }
    // Méthode de positionnement des armes sur la map;
    insererArmesMap(tableauArmes) {
        tableauArmes.forEach(arme => {
            // On récupère une case aléatoire grâce à la méthode `genererCasesAleatoires`, depuis la fonction `recupererCaseAleatoire`.
            // On utilise ici `.call` pour passer le `this` à la fonction `recupererCaseAleatoire`.
            const caseArme = recupererCaseAleatoire.call(this, function verifieLaCase(caseGeneree) {
                return (
                    // Il ne faut pas que la `caseGeneree` soit déjà une "casesObstacles" ou une "casesArmes".
                    !caseGeneree.classList.contains('casesObstacles') &&
                    !caseGeneree.classList.contains('casesArmes') &&
                    // On s'assure que la "casesArmes" ne sera pas encerclée de "casesObstacles".
                    verifierCasesAdjacentes(
                        caseGeneree,
                        (cellule, prev) => { // Si une des 4 cases autour n'est PAS une "casesObstacles", on renvoi FALSE.

                            // Si une des cases précédemment vérifiée n'est "PAS" une case obstacle
                            // Alors on sait que la caseGeneree n'est PAS "encerclée" par les cases obstacles (vu qu'il y a, au moins, 1 case vide).
                            // On n'a donc pas l'utilité de vérifier les cases suivantes et on renvoi false jusqu'à la fin.
                            if (prev === false) return false;

                            // Renvoi TRUE si la case est une "casesObstacles", sinon FALSE.
                            return cellule.classList.contains('casesObstacles');
                        }
                    ) === false // On cherche à ce que la vérification renvoi FALSE, car ça signifie qu'il y a une case vide sur les 4 testées.
                )
            });
            // On récupère les coordonnées de la case recevant l' arme.
            arme.coord = extraireCoordonneesId(caseArme);
            // On retire la classe css "casesAccessibles".
            caseArme.classList.remove('casesAccessibles');
            // On attribue la classe css "casesArmes" à cette même case.
            caseArme.classList.add('casesArmes');
            // On insère le visuel de l'arme dans la case.
            caseArme.innerHTML = arme.visuel;
        });
    }

    // Méthode de positionnement des joueurs sur la map.
    insererJoueursMap(tableauJoueurs) {
        tableauJoueurs.forEach(joueur => {
            // On récupère une case aléatoire grâce à la méthode `genererCasesAleatoires`, depuis la fonction `recupererCaseAleatoire`.
            // On utilise ici `.call` pour passer le `this` à la fonction `recupererCaseAleatoire`.
            const caseJoueur = recupererCaseAleatoire.call(this, function verifieLaCase(caseGeneree) {
                return (
                    // Il ne faut pas que la `caseGeneree` soit déjà une "casesObstacles" ou une "casesArmes", ou une "casesJoueurs".
                    !caseGeneree.classList.contains('casesObstacles') &&
                    !caseGeneree.classList.contains('casesArmes') &&
                    !caseGeneree.classList.contains('casesJoueurs') &&
                    // Ni que cette case soit adjacente à une autre "casesJoueurs".
                    verifierCasesAdjacentes(
                        caseGeneree,
                        (cellule, prev) => {
                            if (prev === true) return true;
                            return cellule.classList.contains('casesJoueurs');
                        }
                    ) !== true &&
                    // Ni que cette case soit encerclée de "casesObstacles".
                    verifierCasesAdjacentes(
                        caseGeneree,
                        (cellule, prev) => { // Si une des 4 cases autour n'est PAS une "casesObstacles", on renvoi FALSE.

                            // Si une des cases précédemment vérifiée n'est "PAS" une "casesObstacles".
                            // Alors on sait que la `caseGeneree` n'est PAS "encerclée" par les cases obstacles (vu qu'il y a, au moins, 1 case vide).
                            // On n'a donc pas l'utilité de vérifier les cases suivantes et on renvoi false jusqu'à la fin.
                            if (prev === false) return false;

                            // Renvoi TRUE si la case est une "casesObstacles", sinon FALSE.
                            return cellule.classList.contains('casesObstacles');
                        }
                    ) === false // On cherche à ce que la vérification renvoi FALSE, car cela signifie qu'il y a une case vide sur les 4 testées.
                )
            });
            // On récupère l'ID de la case joueur en lui appliquant la méthode `.split`.
            let idJoueur = caseJoueur.id.split('-');
            // On retire la classe css "casesAccessibles".
            caseJoueur.classList.remove('casesAccessibles');
            // On attribue la classe css "casesJoueurs".
            caseJoueur.classList.add('casesJoueurs');
            // On insère le visuel du joueur dans la case.
            caseJoueur.innerHTML = joueur.visuel;
            // On attribue l'ID de la case joueur à la propriété `coordonnées`du player avec la méthode `map`.
            joueur.coord = idJoueur.map(Number);
        });
    }

    // Permet d'enlever la surbrillance des cases du joueur dont le tour est terminé.
    viderCasesSurbrillance() {
        $('.casesSurbrillance').each((idx, cellule) => {
            cellule.classList.remove('casesSurbrillance');
        });
    }
}

class Map {
    constructor(nbLignes, nbColonnes, x, y, casesObstacles) {
        this.nbLignes = nbLignes;
        this.nbColonnes = nbColonnes;
        this.x = x;
        this.y = y;
        this.casesObstacles = casesObstacles;
    }
    // Méthode de génération d'une map vide
    genererMapVide() {
        // Création des lignes
        for (let i = 0; i < this.nbLignes; i++) {
            const trElt = document.createElement('tr');
            trElt.id = 'line-' + i;
            document.getElementById('gameMap').appendChild(trElt);        
            
            // Création des cellules
            for (let j = 0; j < this.nbColonnes; j++) {
                const tdElt = document.createElement('td');
                tdElt.id = this.y + '-' + this.x;
                document.getElementById(`line-${this.y}`).appendChild(tdElt);
                this.x++; // Remplir vers la droite
        
                // Passer à la ligne
                if(document.getElementById(`line-${this.y}`).children.length == this.nbColonnes) {
                    this.y++; // On descend d'une ligne
                    this.x = 0; // On recommence à gauche
                }
            }  
        }    
    }
    // Méthode de génération des cases obstacles dans la map vide
    genererCasesObstacles() {
        for (let i = 0; i < this.casesObstacles; i++) {
            let cases = document.getElementsByTagName('td');
            let casesAleatoires = Math.floor(Math.random() * cases.length);
            let caseNoire = cases[casesAleatoires];
            // Pour ne pas générer 2 fois le même numéro de case
            if (casesAleatoires == caseNoire) {
                i--;
            }
            // On attribue la classe "casesObstacles" aux cases sélectionnées aléatoirement
            caseNoire.classList.add('casesObstacles');
        }
    }
}

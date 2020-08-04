class Map {
    constructor(nbLignes, nbColonnes, x, y) {
        this.nbLignes = nbLignes;
        this.nbColonnes = nbColonnes;
        this.x = x;
        this.y = y;
    }
    // Méthode de génération d'une map vierge
    genererMap() {
        // Création des lignes
        for (let i = 0; i < this.nbLignes; i++) {
            const trElt = document.createElement('tr');
            trElt.id = 'line-' + i;
            document.getElementById('gameMap').appendChild(trElt);        
            
            // Création des cellules
            for (let j = 0; j < this.nbColonnes; j++) {
                const tdElt = document.createElement('td');
                tdElt.id = this.x + '-' + this.y;
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
}

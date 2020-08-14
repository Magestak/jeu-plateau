class Player {
    constructor(nom, sante, arme,) {
        this.nom = nom;
        //this.visuel = visuel; A RAJOUTER
        this.sante = sante;
        this.arme = arme;
        this.coordonnees = [];
    }
    set coord(value) {
        this.coordonnees.push(value);
    }
    get coord() {
        return this.coordonnees[this.coordonnees.length - 1];
    }
}
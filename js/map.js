

const nbLignes = 10;
const nbColonnes = 10;
let x = 0;
let y = 0;

for (let i = 0; i < nbLignes; i++) {
    const trElt = document.createElement('tr');
    trElt.id = 'line-' + i;
    document.getElementById('gameMap').appendChild(trElt);


    for (let j = 0; j < nbColonnes; j++) {
        const tdElt = document.createElement('td');
        tdElt.id = x + '-' + y;
        tdElt.innerHTML = `${i}-${j}`;
        document.getElementById(`line-${y}`).appendChild(tdElt);
        x++; // aller à droite

        // passer à la ligne
        if(document.getElementById(`line-${y}`).children.length == nbColonnes) {
            y++;
            x = 0;
        }
    }
    
}
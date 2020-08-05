$(document).ready(function(){
  const newMap = new Map(10, 10, 0, 0, 10); // création d'un nouvel objet avec la classe Map
  newMap.genererMapVide(); // Génère une map vide
  newMap.genererCasesObstacles(); // Rajoute des cases obstacles sur la map vide  

});

window.onload = function() {

}


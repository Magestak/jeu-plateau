/**
 * Renvoi une case aléatoire, répondant aux critère du vérificateur passé en paramètre.
 * @param { (value: any) => boolean } verificateur
 * @returns { HTMLElement }
 */
function recupererCaseAleatoire(verificateur) {
    // Déclaration de la variable contenant les cases générées.
    let caseGenere;

    do {
        // Récupération d'une case aléatoire
        caseGenere = this.genererCasesAleatoires();
    } while (!verificateur(caseGenere)); // On recommence tant que le verificateur renvoit `true`

    // On renvoi la case généré, répondant aux critère du vérificateur
    return caseGenere;
}
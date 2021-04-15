const Q = `
PREFIX hemef: <http://data-iremus.huma-num.fr/ns/hemef#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT
    ?prix
        ?date_année
        ?date_hypothèse
        ?discipline
        ?nom
        ?nom_complément
        ?type

    ?élève
        ?élève_sexe
        ?élève_nom
        ?élève_nom_complément
        ?élève_nom_épouse
        ?élève_nom_épouse_TDC
        ?élève_prénom_1
        ?élève_prénom_2
        ?élève_prénom_2_TDC
        ?élève_prénom_complément
        ?élève_prénom_complément_TDC
WHERE {
    GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
        ?prix rdf:type hemef:Prix .
        ?pc hemef:prix ?prix .
            OPTIONAL { ?prix hemef:date_année ?date_année . }
            OPTIONAL { ?prix hemef:date_hypothèse ?date_hypothèse . }
            OPTIONAL { ?prix hemef:discipline_valeur ?discipline_valeur . }
            OPTIONAL { ?prix hemef:discipline_catégorie_valeur ?_d . }
                BIND ( IF (BOUND (?_d), lcase(?_d), lcase(?discipline_valeur) ) AS ?__d ) .
                BIND ( IF (BOUND (?__d), ?__d, '?' ) AS ?discipline ) .
            OPTIONAL { ?prix hemef:nom_valeur ?_n . }
                BIND ( IF (BOUND (?_n), lcase(?_n), '—' ) AS ?nom ) .
            OPTIONAL { ?prix hemef:nom_complément_valeur ?nom_complément . }
            OPTIONAL { ?prix hemef:type_valeur ?type . }
        
        ?pc hemef:élève ?élève .
        OPTIONAL { ?élève hemef:cote_AN_registre ?élève_cote_AN_registre . }
        OPTIONAL { ?élève hemef:cote_AN_registre_TDC ?élève_cote_AN_registre_TDC . }
        OPTIONAL { ?élève hemef:nom ?élève_nom . }
        OPTIONAL { ?élève hemef:nom_complément ?élève_nom_complément . }
        OPTIONAL { ?élève hemef:nom_épouse ?élève_nom_épouse . }
        OPTIONAL { ?élève hemef:nom_épouse_TDC ?élève_nom_épouse_TDC . }
        OPTIONAL { ?élève hemef:prénom_1 ?élève_prénom_1 . }
        OPTIONAL { ?élève hemef:prénom_2 ?élève_prénom_2 . }
        OPTIONAL { ?élève hemef:prénom_2_TDC ?élève_prénom_2_TDC . }
        OPTIONAL { ?élève hemef:prénom_complément ?élève_prénom_complément . }
        OPTIONAL { ?élève hemef:prénom_complément_TDC ?élève_prénom_complément_TDC . }
        OPTIONAL { ?élève hemef:sexe ?élève_sexe . }
    }
}
`

export default Q
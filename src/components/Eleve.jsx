import { Container, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { RESOURCE_PREFIX, sparqlEndpoint } from '../sparql'
import { f, formatValue as _formatValue, formatDate as _formatDate, hemefStyles, makeLink, makePageTitle, makeProgress, makeSectionTitle, makeTable } from '../common/helpers'

const useStyles = makeStyles((theme) => ({
  ...hemefStyles(theme)
}))

const makeQuery = id => `
SELECT *
WHERE {
  GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
    <${RESOURCE_PREFIX + id}> ?p ?o .
    FILTER (?p != hemef:parcours-classe && ?p != hemef:adresse) .
  }
}
`

const makeAdressesQuery = id => `
SELECT *
WHERE {
  GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
    <${RESOURCE_PREFIX + id}> hemef:adresse ?s .
    ?s ?p ?o .
  }
}
`

const makeParcoursClassesQuery = id => `
SELECT *
WHERE {
  GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
    <${RESOURCE_PREFIX + id}> hemef:parcours-classe ?s .
    ?s ?p ?o .
    FILTER (?p != hemef:prix) .
  }
}
`

const makeClasseQuery = id => `
SELECT *
WHERE {
  GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
    <${id}> ?p ?o .
    FILTER (?p != rdf:type) .
  }
}
`

const makePrixQuery = id => `
SELECT *
WHERE {
  GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
    <${id}> hemef:prix ?prix .
    ?prix ?prix_p ?prix_o .
    FILTER (?prix_p != rdf:type) .
  }
}
`

function formatAdresse(data, suffix = ``) {
  let label = ``

  const numéro_voie = data['adresse_numéro_voie' + suffix] || ``
  const type_voie = data['adresse_type_voie' + suffix] || ``
  const article_voie = data['adresse_article_voie' + suffix] || ``
  const nom_voie = data['adresse_nom_voie' + suffix] || ``
  const compléments = data['adresse_compléments' + suffix] || ``
  const ville_nom = data['adresse_ville_nom' + suffix] || ``
  const ville_ancien_nom = data['adresse_ville_ancien_nom' + suffix] || ``
  const pays_nom = data['adresse_pays' + suffix] || ``
  const géolocalisation = data['adresse_géolocalisation' + suffix] || ``
  const habite_début = data['adresse_habite_début' + suffix] || ``
  const habite_fin = data['adresse_habite_fin' + suffix] || ``

  if (numéro_voie)
    label += numéro_voie + ` `
  if (type_voie)
    label += type_voie + ` `
  if (article_voie) {
    label += article_voie
    if (article_voie.slice(-1) !== `'`)
      label += ` `
  }
  if (nom_voie)
    label += nom_voie
  if (compléments) {
    let adresse_complements_formatted = ``
    if (compléments.slice(-1) === `)` && !compléments.includes('('))
      adresse_complements_formatted = compléments.slice(0, -1)
    label += ` (` + adresse_complements_formatted + `)`
  }

  if (ville_nom && !ville_ancien_nom) {
    if (label) label += `, `
    label += ville_nom
  }
  else if (!ville_nom && ville_ancien_nom) {
    if (label) label += `, `
    label += `<dénomination contemporaine de la ville inconnue> (anciennement ${ville_ancien_nom})`
  }
  else if (ville_nom && ville_ancien_nom) {
    if (label) label += `, `
    label += `${ville_nom} (anciennement ${ville_ancien_nom})`
  }

  if (pays_nom)
    label += `, ${pays_nom}`

  if (géolocalisation)
    label += ` [${géolocalisation}]`

  if (habite_début && habite_fin)
    label += ` [${habite_début} → ${habite_fin}]`
  else if (habite_début && !habite_fin)
    label += ` [${habite_début} → …]`
  if (!habite_début && habite_fin)
    label += ` [… → ${habite_fin}]`

  return label.trim()
}

function Eleve({ history, match }) {
  const styleClasses = useStyles()
  const id = match.params.id
  const [triples, setTriples] = useState({})
  const [adresses, setAdresses] = useState([])
  const [parcoursClasses, setParcoursClasses] = useState([])

  const formatDate = (_) => _formatDate(triples, _)
  const formatValue = (_) => _formatValue(triples, _)

  function formatPrixDisciplineCatégorie(discipline, catégorie) {
    const elements = []

    if (discipline)
      elements.push(discipline)
    if (catégorie) {
      elements.push(' ')
      elements.push(makeLink(
        catégorie,
        '/discipline-prix',
        catégorie,
        styleClasses.inlineButtonLink
      ))
    }

    return elements
  }

  function formatClasseDisciplineCatégorie(v) {
    const elements = []

    if (v) {
      elements.push(' ')
      elements.push(makeLink(
        v,
        '/discipline-classe',
        v,
        styleClasses.inlineButtonLink
      ))
    }

    return elements
  }

  function formatVille(v) {
    if (v) {
      return makeLink(
        v,
        '/ville',
        v,
        styleClasses.inlineButtonLink
      )
    }
    else return ''
  }

  function formatProfesseur(v) {
    if (v) {
      return makeLink(
        v,
        '/professeur',
        v,
        styleClasses.inlineButtonLink
      )
    }
    else return ''
  }

  function formatClasseButton(pc) {
    let label = []
    const d = pc.classe_discipline_catégorie || pc.classe_discipline_catégorie_TDC || pc.classe_discipline || pc.classe_discipline_TDC
    if (d) label.push('🎵 ' + d)
    const p = pc.classe_nom_professeur || pc.classe_nom_professeur_TDC
    if (p) label.push('👤 ' + p)
    if (label.length === 0) label = ['Inconnue']
    return makeLink(
      label.join('  '),
      '/classe',
      pc.classe.split('/id/')[1],
      styleClasses.inlineButtonLink)
  }

  useEffect(() => {
    (async function fetchData() {
      // Élève
      sparqlEndpoint(makeQuery(id)).then(res => {
        setTriples(res.results.bindings.reduce((a, cv) => {
          a[cv.p.value.split('#')[1]] = cv.o.value
          return a
        }, {}))
      })

      // Adresses
      sparqlEndpoint(makeAdressesQuery(id)).then(res => {
        const temp_adresses = {}
        for (const t of res.results.bindings) {
          if (!temp_adresses[t.s.value]) temp_adresses[t.s.value] = {}
          temp_adresses[t.s.value][t.p.value.split('#')[1]] = t.o.value
        }
        setAdresses(Object.values(temp_adresses).map(_ => [`Adresse`, formatAdresse(_), formatAdresse(_, `_TDC`)]))
      })

      // Parcours-classes
      sparqlEndpoint(makeParcoursClassesQuery(id)).then(async (res) => {
        let temp_parcours_classes = {}
        for (const t of res.results.bindings) {
          const pc_uuid = t.s.value
          const p = t.p.value.split('#')[1]
          if (!temp_parcours_classes[pc_uuid]) temp_parcours_classes[pc_uuid] = { uuid: pc_uuid, prix: [] }
          if (p === 'prix')
            temp_parcours_classes[pc_uuid].prix.push(t.o.value)
          else
            temp_parcours_classes[pc_uuid][p] = t.o.value
        }
        for (const [pc_uuid, pc] of Object.entries(temp_parcours_classes)) {
          // Classes
          const classe_res = await sparqlEndpoint(makeClasseQuery(pc.classe))
          for (const t of classe_res.results.bindings) {
            pc['classe_' + t.p.value.split('#')[1]] = t.o.value
          }
          // Prix
          const prix_res = await sparqlEndpoint(makePrixQuery(pc_uuid))
          const prix = {}
          for (const t of prix_res.results.bindings) {
            if (!t) continue
            if (!prix[t.prix.value]) prix[t.prix.value] = { uuid: t.prix.value }
            prix[t.prix.value][t.prix_p.value.split('#')[1]] = t.prix_o.value
          }
          pc.prix = Object.values(prix)
        }
        temp_parcours_classes = Object.values(temp_parcours_classes)
        setParcoursClasses(temp_parcours_classes)
      })
    })()
  }, [id])

  if (Object.entries(triples).length === 0) {
    return makeProgress()
  } else {
    return (
      <Container className={styleClasses.root}>
        {makePageTitle(`ÉLÈVE`, styleClasses.pageTitle)}
        {makeTable('IDENTITÉ', [
          ['Nom', ...formatValue('nom')],
          ['Nom complément', ...formatValue('nom_complément')],
          ['Prénom 1', ...formatValue('prénom_1')],
          ['Prénom 2', ...formatValue('prénom_2')],
          ['Nom épouse', ...formatValue('nom_épouse')],
          ['Prénom complément', ...formatValue('prénom_complément')],
          ['Pseudonyme', ...formatValue('pseudonyme')],
          ['Sexe', ...formatValue('sexe')],
          ['Date de naissance', ...formatDate('date_naissance')],
          ['Ville de naissance', formatVille(triples.naissance_ville_nom), formatVille(triples.naissance_ville_nom_TDC)],
          ['Ancien nom de la ville de naissance', ...formatValue('naissance_ville_ancien_nom')],
          ['Département de naissance', ...formatValue('naissance_département_nom')],
          ['Pays de naissance', ...formatValue('naissance_pays_nom')],
          ['Profession', ...formatValue('exerce_profession_nom')],
          ['Profession connue', ...formatValue('exerce_profession_connue')],
          ['Lieu d\'exercice', ...formatValue('exerce_lieu')],
          ['Date de début d\'exercice', ...formatValue('exerce_date_début')],
          ['Profession de la mère', ...formatValue('mère_profession')],
          ['Profession du père', ...formatValue('père_profession')],
          ...adresses
        ], styleClasses)}
        <br />
        <br />
        {makeTable('SAISIE', [
          ['Cote AN registre', ...formatValue('cote_AN_registre')],
          ['Références bibliographiques', ...formatValue('références_bibliographiques')],
          ['Observations', ...formatValue('observations')],
          ['Remarques de saisie', ...formatValue('remarques_de_saisie')],
          ['Identifiant 1', ...formatValue('identifiant_1')],
          ['Identifiant 2', ...formatValue('identifiant_2')],
        ], styleClasses)}
        <br />
        <br />
        {makeTable('CURSUS', [
          ['Date d\'entrée au conservatoire', ...formatDate('date_entrée_conservatoire')],
          ['Motif d\'admission au conservatoire', ...formatValue('motif_admission')],
          ['Motif de sortie du conservatoire', ...formatValue('motif_sortie')],
          ['Date de sortie du conservatoire', ...formatDate('date_sortie_conservatoire')],
          ['Pré-cursus, établissement', ...formatValue('établissement_pré-cursus_nom')],
          ['Pré-cursus, type d\'établissement', ...formatValue('établissement_pré-cursus_type')],
          ['Pré-cursus, ville', formatVille(triples['établissement_pré-cursus_ville_nom']), formatVille(triples['établissement_pré-cursus_ville_nom_TDC'])],
        ], styleClasses)}
        <br />
        <br />
        {makeSectionTitle(`CLASSES SUIVIES`, styleClasses.pageSectionTitle)}
        {parcoursClasses.map(pc => <React.Fragment key={pc.uuid}>
          <Paper variant="outlined" square>
            {makeTable(formatClasseButton(pc), [
              ['Cote AN', ..._formatValue(pc, 'cote_AN')],
              ['Date d\'entrée', ..._formatDate(pc, 'date_entrée')],
              ['Motif d\'entrée', ..._formatValue(pc, 'motif_entrée')],
              ['Date de sortie', ..._formatDate(pc, 'date_sortie')],
              ['Motif de sortie', ..._formatValue(pc, 'motif_sortie')],
              ['Statut de l\'élève', ..._formatValue(pc, 'statut_élève')],
              ['Observations élève', ..._formatValue(pc, 'observations_élève')],
              ['Observations classe', ..._formatValue(pc, 'observations_classe')],
              ['Classe, nom', ..._formatValue(pc, 'classe_nom')],
              ['Classe, discipline', ..._formatValue(pc, 'classe_discipline')],
              ['Classe, discipline (catégorie)', formatClasseDisciplineCatégorie(pc.classe_discipline_catégorie), formatClasseDisciplineCatégorie(pc.classe_discipline_catégorie_TDC)],
              ['Classe, type', ..._formatValue(pc, 'classe_type')],
              ['Classe, nom du professeur', formatProfesseur(pc.classe_nom_professeur), formatProfesseur(pc.classe_nom_professeur_TDC)],
              ['Classe, cote AN', ..._formatValue(pc, 'classe_cote_AN')],
              ['Classe, observations', ..._formatValue(pc, 'classe_observations')],
              ['Classe, remarques saisie', ..._formatValue(pc, 'classe_remarques_saisie')],
            ], styleClasses, false)}
            {pc.prix.length > 0 &&
              <Table size='small' className={styleClasses.table} style={{ borderTop: '1px solid #E0E0E0' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>PRIX</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Discipline</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Rang</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pc.prix.sort(function (a, b) {
                    if (a.date < b.date) return -1
                    if (a.date > b.date) return 1
                    return 0
                  }).map((p, i) => <React.Fragment key={i}>
                    <TableRow>
                      <TableCell className={styleClasses.fieldCell} style={{ whiteSpace: 'nowrap', border: 'none' }}>{i + 1}</TableCell>
                      <TableCell className={styleClasses.valueCell} style={{ whiteSpace: 'nowrap', border: 'none' }}>{f(p.date)}</TableCell>
                      <TableCell className={styleClasses.valueCell} style={{ whiteSpace: 'nowrap', border: 'none' }}>{formatPrixDisciplineCatégorie(p.discipline, p.discipline_catégorie)}</TableCell>
                      <TableCell className={styleClasses.valueCell} style={{ whiteSpace: 'nowrap', border: 'none' }}>{f(p.nom) + (p.nom_complément ? ` [${f(p.nom_complément)}]` : '')}</TableCell>
                      <TableCell className={styleClasses.valueCell} style={{ whiteSpace: 'nowrap', border: 'none' }}>{f(p.type)}</TableCell>
                      <TableCell className={styleClasses.valueCell} style={{ whiteSpace: 'nowrap', border: 'none' }}>{f(p.rang)}</TableCell>
                    </TableRow>
                    {(p.date_TDC || p.discipline_TDC || p.discipline_catégorie_TDC || p.nom_TDC || p.type_TDC || p.rang_TDC) && <TableRow>
                      <TableCell className={styleClasses.fieldCell} style={{ whiteSpace: 'nowrap' }}>{`${i + 1} TDC`}</TableCell>
                      <TableCell className={styleClasses.valueCell} style={{ whiteSpace: 'nowrap' }}>{f(p.date_TDC)}</TableCell>
                      <TableCell className={styleClasses.valueCell} style={{ whiteSpace: 'nowrap' }}>{formatPrixDisciplineCatégorie(p.discipline_TDC, p.discipline_catégorie_TDC)}</TableCell>
                      <TableCell className={styleClasses.valueCell} style={{ whiteSpace: 'nowrap' }}>{f(p.nom_TDC) + (p.nom_complément_TDC ? ` [${f(p.nom_complément_TDC)}]` : '')}</TableCell>
                      <TableCell className={styleClasses.valueCell} style={{ whiteSpace: 'nowrap' }}>{f(p.type_TDC)}</TableCell>
                      <TableCell className={styleClasses.valueCell} style={{ whiteSpace: 'nowrap' }}>{f(p.rang_TDC)}</TableCell>
                    </TableRow>}
                  </React.Fragment>)}
                </TableBody>
              </Table>}
          </Paper>
          <br />
        </React.Fragment>)}
        <br />
        <div style={{ textAlign: 'center' }}>
          ⬢ : aggrégation d'informations différentes constatées sur les sources
        </div>
        <div style={{ textAlign: 'center' }}>
          ⬡ : valeurs identiques dans les registres et les tableaux des classes
        </div>
      </Container>
    )
  }
}

export default withRouter(Eleve)

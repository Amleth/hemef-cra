import { Container } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { sparqlEndpoint } from '../sparql'
import { hemefStyles, makePageTitle, makeProgress } from '../common/helpers'
import { élèvesColumns, processÉlèvesList } from '../common/élèves_helpers'

const useStyles = makeStyles(theme => ({
  ...hemefStyles(theme),
}))

const QUERY = ville => `
PREFIX hemef: <http://data-iremus.huma-num.fr/ns/hemef#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT *
WHERE {
    GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
        ?élève rdf:type hemef:Élève .
        
        ?élève hemef:naissance_ville_nom_valeur "${ville}" .
        OPTIONAL { ?élève hemef:naissance_département_nom_valeur ?département }
        OPTIONAL { ?élève hemef:naissance_pays_nom_valeur ?pays }
        OPTIONAL { ?élève hemef:date_naissance_datetime ?date_naissance_datetime }
        
        OPTIONAL { ?élève hemef:cote_AN_registre ?cote_AN_registre }
        OPTIONAL { ?élève hemef:cote_AN_registre_TDC ?cote_AN_registre_TDC }
        OPTIONAL { ?élève hemef:date_entrée_conservatoire_datetime ?date_entrée_conservatoire_datetime }
        OPTIONAL { ?élève hemef:nom ?nom }
        OPTIONAL { ?élève hemef:nom_complément ?nom_complément }
        OPTIONAL { ?élève hemef:nom_épouse ?nom_épouse }
        OPTIONAL { ?élève hemef:nom_épouse_TDC ?nom_épouse_TDC }
        OPTIONAL { ?élève hemef:prénom_1 ?prénom_1 }
        OPTIONAL { ?élève hemef:prénom_2 ?prénom_2 }
        OPTIONAL { ?élève hemef:prénom_2_TDC ?prénom_2_TDC }
        OPTIONAL { ?élève hemef:prénom_complément ?prénom_complément }
        OPTIONAL { ?élève hemef:prénom_complément_TDC ?prénom_complément_TDC }
        OPTIONAL { ?élève hemef:pseudonyme ?pseudonyme }
        OPTIONAL { ?élève hemef:pseudonyme_TDC ?pseudonyme_TDC }
        OPTIONAL { ?élève hemef:sexe ?sexe }
    }
}
`

function Ville({ history, match }) {
  const classes = useStyles()
  const ville = match.params.ville
  const [data, setData] = useState([])

  useEffect(() => {
    sparqlEndpoint(QUERY(ville)).then(res => {
      setData(processÉlèvesList(res.results.bindings, ''))
    })
  }, [ville])

  return Object.entries(data).length === 0 ? (
    makeProgress()
  ) : (
    <Container>
      {makePageTitle(`ÉLÈVES NÉ·E·S À ${ville.toUpperCase()}`, classes.pageTitle)}
      <MaterialTable
        components={{
          Container: props => <Paper {...props} elevation={0} square={true} variant="outlined" />,
        }}
        columns={[
          ...élèvesColumns(''),
          {
            title: `Date de naissance`,
            field: 'date_naissance_datetime.value',
            render: rowData =>
              rowData['date_naissance_datetime']
                ? new Date(rowData['date_naissance_datetime'].value).toLocaleDateString()
                : null,
          },
        ]}
        data={data}
        onRowClick={(evt, selectedRow) => {
          const eleveId = selectedRow.élève.value.slice(-36)
          history.push('/eleve/' + eleveId)
        }}
        options={{
          pageSize: 20,
          pageSizeOptions: [20, 50],
          filtering: true,
          sorting: true,
          cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
          headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
        }}
        title=""
      />
      <br />
    </Container>
  )
}

export default withRouter(Ville)

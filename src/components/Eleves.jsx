import { Container, Slider, Typography } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router'
import { sparqlEndpoint } from '../sparql'
import { hemefStyles, makeNom, makePageTitle, makePrénom, makeProgress, processÉlèvesList } from '../common/helpers'

const useStyles = makeStyles((theme) => ({
  ...hemefStyles(theme),
}));

const QUERY = `
SELECT *
WHERE {
  GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
    ?s rdf:type hemef:Élève .
    OPTIONAL { ?s hemef:cote_AN_registre ?cote_AN_registre . }
    OPTIONAL { ?s hemef:cote_AN_registre_TDC ?cote_AN_registre_TDC . }
    OPTIONAL { ?s hemef:nom ?nom . }
    OPTIONAL { ?s hemef:nom_complément ?nom_complément . }
    OPTIONAL { ?s hemef:nom_épouse ?nom_épouse . }
    OPTIONAL { ?s hemef:nom_épouse_TDC ?nom_épouse_TDC . }
    OPTIONAL { ?s hemef:prénom_1 ?prénom_1 . }
    OPTIONAL { ?s hemef:prénom_2 ?prénom_2 . }
    OPTIONAL { ?s hemef:prénom_2_TDC ?prénom_2_TDC . }
    OPTIONAL { ?s hemef:prénom_complément ?prénom_complément . }
    OPTIONAL { ?s hemef:prénom_complément_TDC ?prénom_complément_TDC . }
    OPTIONAL { ?s hemef:pseudonyme ?pseudonyme . }
    OPTIONAL { ?s hemef:pseudonyme_TDC ?pseudonyme_TDC . }
    OPTIONAL { ?s hemef:date_entrée_conservatoire_année ?date_entrée_conservatoire_année . }
    OPTIONAL { ?s hemef:date_entrée_conservatoire_datetime ?date_entrée_conservatoire_datetime . }
    OPTIONAL { ?s hemef:date_entrée_conservatoire_jour ?date_entrée_conservatoire_jour . }
    OPTIONAL { ?s hemef:date_entrée_conservatoire_mois ?date_entrée_conservatoire_mois . }
    OPTIONAL { ?s hemef:date_entrée_conservatoire_TDC_année ?date_entrée_conservatoire_TDC_année . }
    OPTIONAL { ?s hemef:date_entrée_conservatoire_TDC_datetime ?date_entrée_conservatoire_TDC_datetime . }
    OPTIONAL { ?s hemef:date_entrée_conservatoire_TDC_jour ?date_entrée_conservatoire_TDC_jour . }
    OPTIONAL { ?s hemef:date_entrée_conservatoire_TDC_mois ?date_entrée_conservatoire_TDC_mois . }
  }
}
`

function Eleves({ history, match }) {
  const classes = useStyles();

  const [triples, setTriples] = useState([]);
  const [minYear, setMinYear] = useState(Number.MAX_SAFE_INTEGER);
  const [maxYear, setMaxYear] = useState(Number.MIN_SAFE_INTEGER);
  const [currentMinYear, setCurrentMinYear] = useState(Number.MAX_SAFE_INTEGER);
  const [currentMaxYear, setCurrentMaxYear] = useState(Number.MIN_SAFE_INTEGER);
  const [yearsMarks, setYearsMarks] = useState([]);

  useEffect(() => {
    sparqlEndpoint(QUERY).then(res => {

      setTriples(processÉlèvesList(res.results.bindings))

      let tempMinYear = Number.MAX_SAFE_INTEGER
      let tempMaxYear = Number.MIN_SAFE_INTEGER
      const tempYearsMarks = new Set()
      for (const _ of res.results.bindings) {
        if (_.date_entrée_conservatoire_année) {
          const i = parseInt(_.date_entrée_conservatoire_année.value)
          if (i < tempMinYear) tempMinYear = i
          if (i > tempMaxYear) tempMaxYear = i
          tempYearsMarks.add(i)
        }
      }
      setYearsMarks(Array.from(tempYearsMarks).map(i => ({
        value: i,
        label: (i === tempMinYear || i === tempMaxYear) ? i.toString() : ''
      })))
      setMinYear(tempMinYear)
      setMaxYear(tempMaxYear)
      setCurrentMinYear(tempMinYear)
      setCurrentMaxYear(tempMaxYear)
    })
  }, [])

  const data = triples.filter(_ => (currentMinYear === minYear
    && currentMaxYear === maxYear
    && !_.date_entrée_conservatoire_année)
    ||
    (_.date_entrée_conservatoire_année
      && _.date_entrée_conservatoire_année.value >= currentMinYear
      && _.date_entrée_conservatoire_année.value <= currentMaxYear))

  if (triples.length === 0) {
    return makeProgress()
  } else {
    return <Container>
      {makePageTitle(`ÉLÈVES`, classes.pageTitle)}
      <Typography>
        Filtrer la liste des élèves par année d'entrée au conservatoire :
      </Typography>
      <Container>
        <Slider
          min={minYear}
          max={maxYear}
          defaultValue={[minYear, maxYear]}
          getAriaValueText={v => v}
          onChange={(e, nV) => {
            setCurrentMinYear(nV[0])
            setCurrentMaxYear(nV[1])
          }}
          value={[currentMinYear, currentMaxYear]}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          marks={yearsMarks}
          step={null}
        />
      </Container>
      <br />
      <MaterialTable
        components={{
          Container: props => <Paper {...props} elevation={0} square={true} variant='outlined' />
        }}
        columns={[
          {
            customFilterAndSearch: (term, rowData) => makeNom(rowData).indexOf(term) !== -1,
            defaultSort: 'asc',
            field: `nom.value`,
            render: r => makeNom(r),
            title: `Nom`,
          },
          {
            customFilterAndSearch: (term, rowData) => makePrénom(rowData).indexOf(term) !== -1,
            field: `prénom`,
            render: r => makePrénom(r),
            sorting: false,
            title: `Prénom`,
          },
          {
            field: `pseudonyme`,
            sorting: true,
            title: `Pseudonyme`,
          },
          {
            field: `cote_AN_registre.value`,
            title: `Cote AN du registre`
          },
          {
            title: `Date d'entrée au conservatoire`,
            field: `date_entrée_conservatoire_datetime.value`,
            render: rowData => rowData.date_entrée_conservatoire_datetime
              ? new Date(rowData.date_entrée_conservatoire_datetime.value).toLocaleDateString()
              : null
          }
        ]}
        data={data}
        onRowClick={((evt, selectedRow) => {
          const eleveId = selectedRow.s.value.slice(-36)
          history.push('/eleve/' + eleveId)
        })}
        options={{
          pageSize: 20,
          pageSizeOptions: [20, 50],
          filtering: true,
          sorting: true,
          cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
          headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
        }}
        title={`${data.length} élèves entre ${currentMinYear} et ${currentMaxYear}`}
      />
      <br />
    </Container>
  }
}

export default withRouter(Eleves)
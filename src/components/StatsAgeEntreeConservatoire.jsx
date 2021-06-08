import { Container, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import ReactApexChart from 'react-apexcharts'
import { sparqlEndpoint } from '../sparql'
import { COLOR_F, COLOR_M, hemefStyles, makePageTitle, makeProgress, range } from '../common/helpers'

const useStyles = makeStyles(theme => ({
  ...hemefStyles(theme),
}))

const QUERY = `
SELECT *
WHERE {
  GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
    ?élève rdf:type hemef:Élève .
    OPTIONAL { ?élève hemef:sexe ?sexe . }

    OPTIONAL { ?élève hemef:date_naissance_année ?date_naissance_année . }
    OPTIONAL { ?élève hemef:date_naissance_datetime ?date_naissance_datetime . }
    OPTIONAL { ?élève hemef:date_naissance_jour ?date_naissance_jour . }
    OPTIONAL { ?élève hemef:date_naissance_mois ?date_naissance_mois . }
    OPTIONAL { ?élève hemef:date_naissance_saisie ?date_naissance_saisie . }
    OPTIONAL { ?élève hemef:date_naissance_année_TDC ?date_naissance_année_TDC . }
    OPTIONAL { ?élève hemef:date_naissance_datetime_TDC ?date_naissance_datetime_TDC . }
    OPTIONAL { ?élève hemef:date_naissance_jour_TDC ?date_naissance_jour_TDC . }
    OPTIONAL { ?élève hemef:date_naissance_mois_TDC ?date_naissance_mois_TDC . }
    OPTIONAL { ?élève hemef:date_naissance_saisie_TDC ?date_naissance_saisie_TDC . }
    OPTIONAL { ?élève hemef:date_entrée_conservatoire_année ?date_entrée_conservatoire_année . }
    OPTIONAL { ?élève hemef:date_entrée_conservatoire_datetime ?date_entrée_conservatoire_datetime . }
    OPTIONAL { ?élève hemef:date_entrée_conservatoire_jour ?date_entrée_conservatoire_jour . }
    OPTIONAL { ?élève hemef:date_entrée_conservatoire_mois ?date_entrée_conservatoire_mois . }
    OPTIONAL { ?élève hemef:date_entrée_conservatoire_saisie ?date_entrée_conservatoire_saisie . }
    OPTIONAL { ?élève hemef:date_entrée_conservatoire_année_TDC ?date_entrée_conservatoire_année_TDC . }
    OPTIONAL { ?élève hemef:date_entrée_conservatoire_datetime_TDC ?date_entrée_conservatoire_datetime_TDC . }
    OPTIONAL { ?élève hemef:date_entrée_conservatoire_jour_TDC ?date_entrée_conservatoire_jour_TDC . }
    OPTIONAL { ?élève hemef:date_entrée_conservatoire_mois_TDC ?date_entrée_conservatoire_mois_TDC . }
    OPTIONAL { ?élève hemef:date_entrée_conservatoire_saisie_TDC ?date_entrée_conservatoire_saisie_TDC . }
  }
}
`

const ms2y = _ => Math.round(_ / 1000 / 2600 / 24 / 365)

function C({ history, match }) {
  const classes = useStyles()

  const [n, setN] = useState(0)
  const [noDN, setNoDN] = useState(new Set())
  const [noDEC, setNoDEC] = useState(new Set())
  const [seriesF, setSeriesF] = useState([])
  const [seriesM, setSeriesM] = useState([])
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(0)

  useEffect(() => {
    sparqlEndpoint(QUERY).then(res => {
      setN(res.results.bindings.length)
      const _noDN = new Set()
      const _noDEC = new Set()
      const _seriesF = {}
      for (let i = 0; i <= 100; i++) _seriesF[i] = 0
      const _seriesM = {}
      for (let i = 0; i <= 100; i++) _seriesM[i] = 0
      let _minAge = Number.MAX_SAFE_INTEGER
      let _maxAge = Number.MIN_SAFE_INTEGER

      for (const t of res.results.bindings) {
        // Date de naissance
        let usableDN = null
        if (t.date_naissance_datetime) {
          usableDN = new Date(t.date_naissance_datetime.value)
        } else if (t.date_naissance_année || t.date_naissance_année_TDC) {
          let y = null
          if (t.date_naissance_année) y = t.date_naissance_année.value
          if (t.date_naissance_année_TDC) y = t.date_naissance_année_TDC.value
          usableDN = new Date(y, 11, 31)
        } else {
          _noDN.add(t.élève.value)
        }

        // Date d'entrée au Conservatoire
        let usableDEC = null
        if (t.date_entrée_conservatoire_datetime) {
          usableDEC = new Date(t.date_entrée_conservatoire_datetime.value)
        } else if (t.date_entrée_conservatoire_année || t.date_entrée_conservatoire_année_TDC) {
          let y = null
          if (t.date_entrée_conservatoire_année) y = t.date_entrée_conservatoire_année.value
          if (t.date_entrée_conservatoire_année_TDC) y = t.date_entrée_conservatoire_année_TDC.value
          usableDEC = new Date(y, 11, 31)
        } else {
          _noDEC.add(t.élève.value)
        }

        // Calcul
        if (usableDN && usableDEC) {
          switch (t.sexe.value) {
            case 'F':
              const f = ms2y(usableDEC - usableDN)
              if (f < _minAge) _minAge = f
              if (f > _maxAge) _maxAge = f
              _seriesF[f]--
              break
            case 'H':
              const m = ms2y(usableDEC - usableDN)
              if (m < _minAge) _minAge = m
              if (m > _maxAge) _maxAge = m
              _seriesM[m]++
              break
            default:
          }
        }
      }

      setNoDN(_noDN)
      setNoDEC(_noDEC)
      const f = Object.entries(_seriesF)
        .filter(([k, v]) => k >= _minAge && k <= _maxAge)
        .map(([k, v]) => v)
      setSeriesF(f)
      const m = Object.entries(_seriesM)
        .filter(([k, v]) => k >= _minAge && k <= _maxAge)
        .map(([k, v]) => v)
      setSeriesM(m)
      setMinAge(_minAge)
      setMaxAge(_maxAge)
    })
  }, [])

  return !n ? (
    makeProgress()
  ) : (
    <Container>
      {makePageTitle(`ÂGES DES ÉLÈVES À LEUR ENTRÉE AU CONSERVATOIRE`, classes.pageTitle)}
      <Typography>{n} élèves dans la base.</Typography>
      <Typography>{noDN.size} élèves sans date de naissance.</Typography>
      <Typography>{noDEC.size} élèves sans date d'entrée au Conservatoire.</Typography>
      <Typography>{new Set([...noDN, ...noDEC]).size} élèves écartés dans le calcul.</Typography>
      <Typography>{n - noDN.size - noDEC.size} élèves pris en compte dans le calcul.</Typography>
      <div id="chart">
        <ReactApexChart
          options={{
            chart: {
              type: 'bar',
              stacked: true,
            },
            colors: [COLOR_F, COLOR_M],
            dataLabels: {
              enabled: false,
            },
            plotOptions: {
              bar: {
                horizontal: true,
                barHeight: '100%',
              },
            },
            tooltip: {
              y: {
                formatter: Math.abs,
              },
            },
            xaxis: {
              categories: range(minAge, maxAge).map(_ => (_ % 5 ? '' : _)),
              labels: {
                formatter: Math.abs,
              },
            },
          }}
          series={[
            { name: 'F', data: seriesF },
            { name: 'H', data: seriesM },
          ]}
          type="bar"
        />
      </div>
      <br />
    </Container>
  )
}

export default withRouter(C)

import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import MaterialTable from 'material-table'

import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'

import { hemefStyles, makeNom, makePageTitle, makePrénom, makeProgress, COLOR_F, COLOR_M } from '../common/helpers'
import { sparqlEndpoint } from '../sparql'
import queryPrix from './queryPrix'

const useStyles = makeStyles(theme => ({
  ...hemefStyles(theme),
  disciplinesPrixTable: {
    border: '1px solid #E0E0E0',
    borderCollapse: 'collapse',
    '& td:first-child': {
      padding: '0 1em',
      textAlign: 'right',
    },
    '& td, & th': {
      border: '1px solid #E0E0E0',
      padding: 0,
      textAlign: 'center',
      width: '20px',
    },
    '& th': {
      backgroundColor: '#F9F9F9',
      fontWeight: 'normal',
      verticalAlign: 'bottom',
      '& p': {
        letterSpacing: 0,
        lineHeight: 1,
        margin: 0,
        padding: '0.5em',
        overflowWrap: 'anywhere',
        width: '100%',
      },
    },
  },
  discipline: {
    backgroundColor: '#F9F9F9',
    fontWeight: 'normal',
    textAlign: 'right',
  },
  dataCell: {
    textAlign: 'center',
  },
  f: {
    color: COLOR_F,
  },
  m: {
    color: COLOR_M,
  },
}))

function C({ history }) {
  const classes = useStyles()
  const [list, setList] = useState({})

  useEffect(() => {
    sparqlEndpoint(queryPrix).then(res => {
      setList(res.results.bindings)
    })
  }, [])

  return Object.entries(list).length === 0 ? (
    makeProgress()
  ) : (
    <Container>
      {makePageTitle(`PRIX`, classes.pageTitle)}
      <MaterialTable
        components={{
          Container: props => <Paper {...props} elevation={0} square={true} variant="outlined" />,
        }}
        columns={[
          {
            defaultSort: 'asc',
            field: `nom.value`,
            title: `Nom`,
            render: r => r.nom.value + (r.nom_complément ? ` (${r.nom_complément.value})` : ''),
          },
          {
            defaultSort: 'asc',
            field: `discipline.value`,
            title: `Discipline`,
          },
          {
            defaultSort: 'asc',
            field: `type.value`,
            title: `Type`,
          },
          {
            defaultSort: 'asc',
            field: `date_année.value`,
            title: `Année`,
            render: r => (r.date_année ? r.date_année.value + (r.date_hypothèse ? ` (hypothèse)` : '') : ''),
          },
          {
            customFilterAndSearch: (term, rowData) => makeNom(rowData, 'élève_').indexOf(term) !== -1,
            defaultSort: 'asc',
            field: `élève_nom.value`,
            render: r => makeNom(r, 'élève_'),
            title: `Nom lauréat·e`,
          },
          {
            customFilterAndSearch: (term, rowData) => makePrénom(rowData, 'élève_').indexOf(term) !== -1,
            field: `élève_prénom.value`,
            render: r => makePrénom(r, 'élève_'),
            sorting: false,
            title: `Prénom lauréat·e`,
          },
          {
            defaultSort: 'asc',
            field: `élève_sexe.value`,
            title: `Sexe lauréat·e`,
          },
        ]}
        onRowClick={(evt, selectedRow) => {
          const eleveId = selectedRow.élève.value.slice(-36)
          history.push('/eleve/' + eleveId)
        }}
        data={list}
        options={{
          pageSize: 20,
          pageSizeOptions: [20, 50],
          filtering: true,
          sorting: true,
          cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
          headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
        }}
        title={`${list.length} prix`}
      />
      <br />
    </Container>
  )
}

export default withRouter(C)

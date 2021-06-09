import lodash from 'lodash'
import { withRouter } from 'react-router'
import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table'
import { Button, Container, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { hemefStyles, makePageTitle, makeProgress, COLOR_F, COLOR_M } from '../common/helpers'
import { sparqlEndpoint } from '../sparql'
import { prix_noms } from '../hemef-data'
import queryPrix from './queryPrix'
import { élèvesColumns, processÉlèvesList } from '../common/élèves_helpers'

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
    cursor: 'default',
    textAlign: 'center',

    '&:hover': {
      backgroundColor: '#F9F9F9',
    },
  },
  f: {
    color: COLOR_F,
  },
  m: {
    color: COLOR_M,
  },
}))

function insertBrBrIntoArray(arr) {
  return arr.reduce((result, element, index, array) => {
    result.push(element)
    if (index < array.length - 1) {
      result.push(
        <React.Fragment key={index}>
          <br />
          <br />
        </React.Fragment>
      )
    }
    return result
  }, [])
}

function C({ history }) {
  const classes = useStyles()
  const [stats, setStats] = useState({})
  const [focusedStudents, setFocusedStudents] = useState({})

  useEffect(() => {
    sparqlEndpoint(queryPrix).then(res => {
      // discipline => nom => sexe
      const dico = lodash.groupBy(res.results.bindings, _ => _.discipline.value)
      for (const k_discipline in dico) {
        if (k_discipline === 'total') continue
        let total = dico[k_discipline].length
        dico[k_discipline] = lodash.groupBy(dico[k_discipline], _ => _.nom.value)
        dico[k_discipline].total = total
        for (const k_nom in dico[k_discipline]) {
          if (k_nom === 'total') continue
          let total = dico[k_discipline][k_nom].length
          dico[k_discipline][k_nom] = lodash.groupBy(dico[k_discipline][k_nom], _ => _.élève_sexe.value)
          dico[k_discipline][k_nom].total = total
        }
      }
      setStats(dico)
    })
  }, [])

  if (Object.entries(stats).length === 0) {
    return makeProgress()
  } else if (Object.entries(focusedStudents).length > 0) {
    const data = processÉlèvesList(focusedStudents.students, 'élève_')
    return (
      <Container>
        <Button color="primary" variant="contained" onClick={e => setFocusedStudents({})}>
          Revenir au tableau des prix
        </Button>
        <br />
        <br />
        <MaterialTable
          columns={[
            {
              field: 'date_année.value',
              sorting: true,
              title: `Année d'obtention`,
            },
            ...élèvesColumns('élève_'),
          ]}
          components={{
            Container: props => <Paper {...props} elevation={0} square={true} variant="outlined" />,
          }}
          data={data}
          onRowClick={(evt, selectedRow) => {
            const eleveId = selectedRow.élève.value.slice(-36)
            history.push('/eleve/' + eleveId)
          }}
          options={{
            pageSize: 10,
            pageSizeOptions: [10, 30],
            filtering: true,
            sorting: true,
            cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
            headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
          }}
          title={`${focusedStudents.discipline} — ${focusedStudents.nom}`}
        />
      </Container>
    )
  } else {
    return (
      <Container>
        {makePageTitle(`PRIX`, classes.pageTitle)}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ padding: '1em' }}>TOTAL</div>
          <div style={{ padding: '1em 0' }}>=</div>
          <div style={{ color: COLOR_F, padding: '1em' }}>FEMMES</div>
          <div style={{ padding: '1em 0' }}>+</div>
          <div style={{ color: COLOR_M, padding: '1em' }}>HOMMES</div>
        </div>
        <Table className={classes.disciplinesPrixTable}>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <p>
                  T<br />O<br />T<br />A<br />L
                </p>
              </TableCell>
              {prix_noms.map(_ => {
                return (
                  <TableCell key={_}>
                    <p>{insertBrBrIntoArray(_.split(' '))}</p>
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(stats)
              .sort(([da, a], [db, b]) => {
                if (a.total < b.total) return 1
                if (a.total > b.total) return -1
                return da.localeCompare(db)
              })
              .map(([discipline, _]) => {
                return (
                  <TableRow key={discipline}>
                    <TableCell className={classes.discipline}>{discipline}</TableCell>
                    <TableCell className={classes.dataCell}>{_.total}</TableCell>
                    {prix_noms.map(nom => {
                      let students = []
                      if (_[nom] && _[nom].H) students = students.concat(_[nom].H)
                      if (_[nom] && _[nom].F) students = students.concat(_[nom].F)
                      return (
                        <TableCell
                          key={nom}
                          className={classes.dataCell}
                          onClick={e => {
                            if (students.length) setFocusedStudents({ ..._[nom], discipline, nom, students })
                          }}
                        >
                          {_[nom] && _[nom]['F'] && _[nom]['H'] ? <div>{_[nom].total}</div> : ''}
                          {_[nom] ? (
                            <div className={classes.f}>{_[nom]['F'] ? <>{_[nom]['F'].length}</> : ''}</div>
                          ) : (
                            ''
                          )}
                          {_[nom] ? (
                            <div className={classes.m}>{_[nom]['H'] ? <>{_[nom]['H'].length}</> : ''}</div>
                          ) : (
                            ''
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
        <br />
      </Container>
    )
  }
}

export default withRouter(C)

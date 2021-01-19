import lodash from 'lodash'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import MaterialTable from 'material-table'

import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'

import { hemefStyles, makeNom, makePageTitle, makePrénom, makeProgress, COLOR_F, COLOR_M } from '../common/helpers'
import { GRAPH, sparqlEndpoint } from '../sparql'
import { prix_noms } from '../hemef-data'

function insertBrBrIntoArray(arr) {
    return arr.reduce((result, element, index, array) => {
        result.push(element);
        if (index < array.length - 1) {
            result.push(<React.Fragment key={index}><br /><br /></React.Fragment>);
        }
        return result;
    }, []);
};

const QUERY = `
PREFIX hemef: <http://data-iremus.huma-num.fr/ns/hemef#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT
    ?prix ?type ?nom_lc ?nom_complément ?discipline ?date

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
    GRAPH <${GRAPH}> {
        ?prix rdf:type hemef:Prix .
        ?pc hemef:prix ?prix .
        OPTIONAL { ?prix hemef:type_valeur ?type . }
        OPTIONAL { ?prix hemef:nom_complément_valeur ?nom_complément . }
        OPTIONAL { ?prix hemef:date ?date . }
        ?prix hemef:nom_valeur ?nom .
        BIND (lcase(?nom) AS ?nom_lc)
        OPTIONAL { ?prix hemef:discipline_catégorie_valeur ?d . }
        BIND ( IF (BOUND (?d), ?d, "discipline inconnue" ) AS ?discipline  ) .
        
        ?pc hemef:élève ?élève .
        OPTIONAL { ?élève hemef:sexe ?élève_sexe . }
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
    }
}
`

const useStyles = makeStyles((theme) => ({
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
            }
        }

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
        color: COLOR_F
    },
    m: {
        color: COLOR_M
    },
}));

function C({ history }) {
    const classes = useStyles()
    const [list, setList] = useState({})
    const [stats, setStats] = useState({})

    useEffect(() => {
        sparqlEndpoint(QUERY).then(res => {
            setList(res.results.bindings)

            // discipline => nom => sexe
            const dico = lodash.groupBy(res.results.bindings, _ => _.discipline.value)
            for (const k_discipline in dico) {
                if (k_discipline === 'total') continue
                let total = dico[k_discipline].length
                dico[k_discipline] = lodash.groupBy(dico[k_discipline], _ => _.nom_lc.value)
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

    return Object.entries(stats).length === 0
        ? makeProgress()
        : <Container>
            {makePageTitle(`PRIX`, classes.pageTitle)}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div style={{ padding: '1em' }}>TOTAL</div>
                <div style={{ padding: '1em 0' }}>=</div>
                <div style={{ color: COLOR_F, padding: '1em' }}>♀</div>
                <div style={{ padding: '1em 0' }}>+</div>
                <div style={{ color: COLOR_M, padding: '1em' }}>♂</div>
            </div>
            <Table className={classes.disciplinesPrixTable}>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        {prix_noms.map(_ => {
                            return <TableCell key={_}><p>{
                                insertBrBrIntoArray(_.split(' '))
                            }</p></TableCell>
                        })}
                        <TableCell><p>T<br />O<br />T<br />A<br />L</p></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(stats).sort(([da, a], [db, b]) => {
                        if (a.total < b.total) return 1
                        if (a.total > b.total) return -1
                        return da.localeCompare(db)
                    }).map(([discipline, _]) => {
                        return <TableRow key={discipline}>
                            <TableCell className={classes.discipline}>{discipline}</TableCell>
                            {prix_noms.map(nom => {
                                return <TableCell key={nom} className={classes.dataCell}>
                                    {_[nom] && _[nom]['♀'] && _[nom]['♂'] ? <div>{_[nom].total}</div> : ''}
                                    {_[nom] ? <div className={classes.f}>{_[nom]['♀'] ? <>{_[nom]['♀'].length}</> : ''}</div> : ''}
                                    {_[nom] ? <div className={classes.m}>{_[nom]['♂'] ? <>{_[nom]['♂'].length}</> : ''}</div> : ''}
                                </TableCell>
                            })}
                            <TableCell className={classes.dataCell}>{_.total}</TableCell>
                        </TableRow>
                    }
                    )}
                </TableBody>
            </Table>
            <br />
            <MaterialTable
                columns={[
                    {
                        defaultSort: 'asc',
                        field: `type.value`,
                        title: `Type`,
                    },
                    {
                        defaultSort: 'asc',
                        field: `type.nom_lc.value`,
                        title: `Nom`,
                        render: r => r.nom_lc.value + (r.nom_complément ? ` (${r.nom_complément.value})` : '')
                    },
                    {
                        defaultSort: 'asc',
                        field: `discipline.value`,
                        title: `Discipline`
                    },
                    {
                        defaultSort: 'asc',
                        field: `date.value`,
                        title: `Date`
                    },
                    {
                        customFilterAndSearch: (term, rowData) => makeNom(rowData, 'élève_').indexOf(term) !== -1,
                        defaultSort: 'asc',
                        field: `élève_nom.value`,
                        render: r => makeNom(r, 'élève_'),
                        title: `Nom`,
                    },
                    {
                        customFilterAndSearch: (term, rowData) => makePrénom(rowData, 'élève_').indexOf(term) !== -1,
                        field: `élève_prénom.value`,
                        render: r => makePrénom(r, 'élève_'),
                        sorting: false,
                        title: `Prénom`,
                    },
                    {
                        defaultSort: 'asc',
                        field: `élève_sexe.value`,
                        title: `Sexe`
                    },
                ]}
                onRowClick={((evt, selectedRow) => {
                    const eleveId = selectedRow.élève.value.slice(-36)
                    history.push('/eleve/' + eleveId)
                })}
                data={list}
                options={{
                    pageSize: 20,
                    pageSizeOptions: [20, 50],
                    filtering: true,
                    sorting: true,
                    cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
                    headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
                }}
                title={`${list.length} prix`}
            />
            <br />
        </Container >
}

export default withRouter(C)
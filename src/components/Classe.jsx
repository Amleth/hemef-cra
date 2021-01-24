import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'

import { COLOR_F, COLOR_M, formatValue as _formatValue, hemefStyles, makeNom, makePageTitle, makePrénom, makeProgress, makeTable, processÉlèvesList } from '../common/helpers'
import { RESOURCE_PREFIX, sparqlEndpoint } from '../sparql'

const makeQueryClasse = id => `
PREFIX hemef: <http://data-iremus.huma-num.fr/ns/hemef#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT *
WHERE {
    GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
        <${RESOURCE_PREFIX + id}> rdf:type hemef:Classe .
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:discipline ?discipline . }
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:discipline_TDC ?discipline_TDC . }
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:discipline_catégorie ?discipline_catégorie . }
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:discipline_catégorie_TDC ?discipline_catégorie_TDC . }
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:nom ?nom . }
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:nom_TDC ?nom_TDC . }
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:nom_professeur ?nom_professeur . }
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:nom_professeur_TDC ?nom_professeur_TDC . }
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:type ?type . }
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:type_TDC ?type_TDC . }
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:observations ?observations . }
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:observations_TDC ?observations_TDC . }
        OPTIONAL { <${RESOURCE_PREFIX + id}> hemef:remarques_saisie ?remarques_saisie . }
    }
}
`

const makeQueryÉlèves = id => `
PREFIX hemef: <http://data-iremus.huma-num.fr/ns/hemef#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT *
WHERE {
    GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
        <${RESOURCE_PREFIX + id}> rdf:type hemef:Classe .
        ?pc hemef:classe <${RESOURCE_PREFIX + id}> .
        ?pc hemef:élève ?élève .

        OPTIONAL { ?pc hemef:classe ?classe . }
        OPTIONAL { ?pc hemef:élève ?élève . }
        
        OPTIONAL { ?élève hemef:sexe ?sexe . }
        OPTIONAL { ?élève hemef:cote_AN_registre ?cote_AN_registre . }
        OPTIONAL { ?élève hemef:cote_AN_registre_TDC ?cote_AN_registre_TDC . }
        OPTIONAL { ?élève hemef:nom ?nom . }
        OPTIONAL { ?élève hemef:nom_complément ?nom_complément . }
        OPTIONAL { ?élève hemef:nom_épouse ?nom_épouse . }
        OPTIONAL { ?élève hemef:nom_épouse_TDC ?nom_épouse_TDC . }
        OPTIONAL { ?élève hemef:prénom_1 ?prénom_1 . }
        OPTIONAL { ?élève hemef:prénom_2 ?prénom_2 . }
        OPTIONAL { ?élève hemef:prénom_2_TDC ?prénom_2_TDC . }
        OPTIONAL { ?élève hemef:prénom_complément ?prénom_complément . }
        OPTIONAL { ?élève hemef:prénom_complément_TDC ?prénom_complément_TDC . }
        OPTIONAL { ?élève hemef:pseudonyme ?pseudonyme . }
        OPTIONAL { ?élève hemef:pseudonyme_TDC ?pseudonyme_TDC . }
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

function C({ history, match }) {
    const classes = useStyles()
    const id = match.params.id
    const [classe, setClasse] = useState({})
    const [élèves, setÉlèves] = useState([])

    const formatValue = (_) => _formatValue(classe, _)

    useEffect(() => {
        sparqlEndpoint(makeQueryClasse(id)).then(res => {
            const _classe = {}
            for (const [k, v] of Object.entries(res.results.bindings[0])) {
                _classe[k] = v.value
            }
            setClasse(_classe)
        })
        sparqlEndpoint(makeQueryÉlèves(id)).then(res => {
            setÉlèves(processÉlèvesList(res.results.bindings))
        })
    }, [id])

    return Object.entries(classe).length === 0
        ? makeProgress()
        : <Container>
            {makePageTitle(`CLASSE`, classes.pageTitle)}
            {makeTable('', [
                ['Discipline', ...formatValue('discipline')],
                ['Discipline (catégorie)', ...formatValue('discipline_catégorie')],
                ['Professeur', ...formatValue('nom_professeur')],
                ['Nom', ...formatValue('nom')],
                ['Type', ...formatValue('type')],
                ['Observations', ...formatValue('observations')],
                ['Remarques saisie', ...formatValue('remarques_saisie')],
            ], classes)}
            <br />
            <div style={{ textAlign: 'center' }}>
                ⬢ : aggrégation d'informations différentes constatées sur les sources
            </div>
            <div style={{ textAlign: 'center' }}>
                ⬡ : valeurs identiques dans les registres et les tableaux des classes
            </div>
            <br />
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
                ]}
                onRowClick={((evt, selectedRow) => {
                    const eleveId = selectedRow.élève.value.slice(-36)
                    history.push('/eleve/' + eleveId)
                })}
                data={élèves}
                options={{
                    pageSize: 20,
                    pageSizeOptions: [20, 50],
                    filtering: true,
                    sorting: true,
                    cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
                    headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
                }}
                title={`${élèves.length} élèves`}
            />
            <br />
        </Container >
}

export default withRouter(C)
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import MaterialTable from 'material-table'

import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'

import { hemefStyles, makePageTitle, makeProgress, COLOR_F, COLOR_M, TDC_SEP } from '../common/helpers'
import { sparqlEndpoint } from '../sparql'

const QUERY = `
PREFIX hemef: <http://data-iremus.huma-num.fr/ns/hemef#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT
    ?classe
    ?discipline
    ?discipline_TDC
    ?discipline_catégorie
    ?discipline_catégorie_TDC
    ?discipline_catégorie_valeur
    ?nom
    ?nom_TDC
    ?type
    ?type_TDC
    ?nom_professeur
    ?nom_professeur_TDC
    ?cote_AN_TDC
    ?observations
    ?observations_TDC
    ?remarques_saisie
    (COUNT(?pc) AS ?effectif)
WHERE {
    GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
        ?classe rdf:type hemef:Classe .
        OPTIONAL { ?pc hemef:classe ?classe . }
        
        OPTIONAL { ?classe hemef:cote_AN_TDC ?cote_AN_TDC . }
        OPTIONAL { ?classe hemef:discipline ?discipline . }
        OPTIONAL { ?classe hemef:discipline_TDC ?discipline_TDC . }
        OPTIONAL { ?classe hemef:discipline_catégorie ?discipline_catégorie . }
        OPTIONAL { ?classe hemef:discipline_catégorie_TDC ?discipline_catégorie_TDC . }
        OPTIONAL { ?classe hemef:discipline_catégorie_valeur ?_d . }
            BIND ( IF (BOUND (?_d), ?_d, '?' ) AS ?discipline_catégorie_valeur  ) .
        OPTIONAL { ?classe hemef:nom ?nom . }
        OPTIONAL { ?classe hemef:nom_TDC ?nom_TDC . }
        OPTIONAL { ?classe hemef:type ?type . }
        OPTIONAL { ?classe hemef:type_TDC ?type_TDC . }
        OPTIONAL { ?classe hemef:nom_professeur ?nom_professeur . }
        OPTIONAL { ?classe hemef:nom_professeur_TDC ?nom_professeur_TDC . }
        OPTIONAL { ?classe hemef:observations ?observations . }
        OPTIONAL { ?classe hemef:observations_TDC ?observations_TDC . }
        OPTIONAL { ?classe hemef:remarques_saisie ?remarques_saisie . }
    }
}
GROUP BY
    ?classe
    ?cote_AN_TDC
    ?discipline
    ?discipline_TDC
    ?discipline_catégorie
    ?discipline_catégorie_TDC
    ?discipline_catégorie_valeur
    ?nom
    ?nom_TDC
    ?type
    ?type_TDC
    ?nom_professeur
    ?nom_professeur_TDC
    ?observations
    ?observations_TDC
    ?remarques_saisie
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
    const [list, setList] = useState([])

    useEffect(() => {
        sparqlEndpoint(QUERY).then(res => {
            const _list = res.results.bindings.map(_ => {

                const discipline_vrac = []
                _.discipline && discipline_vrac.push(_.discipline.value)
                _.discipline_TDC && discipline_vrac.includes(_.discipline_TDC.value) === -1 && discipline_vrac.push(_.discipline_TDC.value + ' [TDC]')

                const nom_professeur_vrac = []
                _.nom_professeur && nom_professeur_vrac.push(_.nom_professeur.value)
                _.nom_professeur_TDC && nom_professeur_vrac.includes(_.nom_professeur_TDC.value) === -1 && nom_professeur_vrac.push(_.nom_professeur_TDC.value + ' [TDC]')

                const type_vrac = []
                _.type && type_vrac.push(_.type.value)
                _.type_TDC && !type_vrac.includes(_.type_TDC.value) && type_vrac.push(_.type_TDC.value + ' [TDC]')

                return {
                    ..._,
                    discipline_vrac: discipline_vrac.join(TDC_SEP),
                    nom_professeur_vrac: nom_professeur_vrac.join(TDC_SEP),
                    type_vrac: type_vrac.join(TDC_SEP),
                    effectif: {
                        ..._.effectif,
                        value: parseInt(_.effectif.value)
                    }
                }
            })
            setList(_list)
        })
    }, [])

    return Object.entries(list).length === 0
        ? makeProgress()
        : <Container>
            {makePageTitle(`CLASSES`, classes.pageTitle)}
            <MaterialTable
                components={{
                    Container: props => <Paper {...props} elevation={0} square={true} variant='outlined' />
                }}
                columns={[
                    {
                        defaultSort: 'desc',
                        field: `effectif.value`,
                        title: `Effectif`,
                    },
                    {
                        defaultSort: 'asc',
                        field: `nom_professeur_vrac`,
                        title: `Professeur`,
                    },
                    {
                        defaultSort: 'asc',
                        field: `discipline_catégorie_valeur.value`,
                        title: `Discipline (catégorie)`,
                    },
                    {
                        defaultSort: 'asc',
                        field: `discipline_vrac`,
                        title: `Discipline`,
                    },
                    {
                        defaultSort: 'asc',
                        field: `type_vrac`,
                        title: `Type`,
                    },
                ]}
                onRowClick={((evt, selectedRow) => {
                    const classeId = selectedRow.classe.value.slice(-36)
                    history.push('/classe/' + classeId)
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
                title={``}
            />
            <br />
        </Container >
}

export default withRouter(C)
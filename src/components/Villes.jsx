import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper';

import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'

import { MULTIVALUE_SEP, hemefStyles, makePageTitle, makeProgress } from '../common/helpers'
import { sparqlEndpoint } from '../sparql'

const QUERY_VILLES_DE_NAISSANCE = `
PREFIX hemef: <http://data-iremus.huma-num.fr/ns/hemef#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT *
WHERE {
    GRAPH <http://data-iremus.huma-num.fr/graph/hemef> {
        ?élève hemef:naissance_ville_nom_valeur ?ville .
        OPTIONAL { ?élève hemef:naissance_département_nom_valeur ?département }
        OPTIONAL { ?élève hemef:naissance_pays_nom_valeur ?pays }
    }
}
`

const useStyles = makeStyles((theme) => ({
    ...hemefStyles(theme),
}))

function C({ history }) {
    const classes = useStyles()
    const [villesDeNaissance, setVillesDeNaissance] = useState([])

    useEffect(() => {
        sparqlEndpoint(QUERY_VILLES_DE_NAISSANCE).then(res => {
            const dico = {}
            for (const t of res.results.bindings) {
                if (!dico[t.ville.value]) dico[t.ville.value] = {}
                if (!dico[t.ville.value].élèves) dico[t.ville.value].élèves = new Set()
                if (!dico[t.ville.value].départements) dico[t.ville.value].départements = new Set()
                if (!dico[t.ville.value].pays) dico[t.ville.value].pays = new Set()
                dico[t.ville.value].élèves.add(t.élève.value)
                t.département && dico[t.ville.value].départements.add(t.département.value)
                t.pays && dico[t.ville.value].pays.add(t.pays.value)
            }
            setVillesDeNaissance(Object.entries(dico).sort(
                ([k1, v1], [k2, v2]) => {
                    if (v1.élèves.size < v2.élèves.size) return 1
                    if (v1.élèves.size > v2.élèves.size) return -1
                    return k1.localeCompare(k2)
                }
            ))
        })
    }, [])

    return Object.entries(villesDeNaissance).length === 0
        ? makeProgress()
        : <Container>
            {makePageTitle(`VILLES DE NAISSANCE`, classes.pageTitle)}
            <Paper elevation={0} square={true} variant='outlined'>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Ville</TableCell>
                            <TableCell>Département</TableCell>
                            <TableCell>Pays</TableCell>
                            <TableCell>Nombres d'élèves nés</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {villesDeNaissance.map((row) => <TableRow key={row[0]}>
                            <TableCell>
                                {row[0]}
                            </TableCell>
                            <TableCell>{Array.from(row[1].départements).join(MULTIVALUE_SEP)}</TableCell>
                            <TableCell>{Array.from(row[1].pays).join(MULTIVALUE_SEP)}</TableCell>
                            <TableCell align="center">{row[1].élèves.size}</TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
            <br />
        </Container >
}

export default withRouter(C)
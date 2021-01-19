import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import { CircularProgress, Container, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    formControl: {
        marginLeft: theme.spacing(2),
        minWidth: 150
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
}))


function Prix({ history }) {

    const classes = useStyles()
    const [prixData, setData] = useState([])
    const [nameP, setNomPrix] = useState('')
    const [typeP, setTypePrix] = useState('')
    const [discP, setDisciplinePrix] = useState('')
    const [yearP, setAnneePrix] = useState('')
    const [compnP, setCompNomPrix] = useState('')

    async function fetchData() {
        const res = await fetch('http://data-iremus.huma-num.fr/api/hemef/prix')
        res.json().then((res) => {
            const initData = res
            let dataArray = []
            for (const o of initData) {
                if (!o.année) {
                    if (o.année_hypothèse) {
                        o.année = o.année_hypothèse.split('-')[0] + ' (hypothèse)'
                    }
                }
                else {
                    o.année = o.année.split('^^')[0]
                }
                dataArray.push(o)
            }
            setData(res)
        })
    }

    const handleNomPrixChange = (event) => {
        setNomPrix(event.target.value)
    }

    const handleCompNomPrixChange = (event) => {
        setCompNomPrix(event.target.value)
    }

    const handleDisciplinePrixChange = (event) => {
        setDisciplinePrix(event.target.value)
    }

    const handleTypePrixChange = (event) => {
        setTypePrix(event.target.value)
    }

    const handleAnneePrixChange = (event) => {
        setAnneePrix(event.target.value)
    }

    let nomPrix = prixData.map((_) => _.nom_label).map((_) => (_ ? _.toLowerCase() : ''))
    let n = {}
    for (let s of nomPrix) n[s] = null
    nomPrix = Object.keys(n)
        .filter((s) => s.length > 0)
        .sort()

    let compnomPrix = prixData.map((_) => _.complément_nom_prix_label).map((_) => (_ ? _.toLowerCase() : ''))
    let cn = {}
    for (let s of compnomPrix) cn[s] = null
    compnomPrix = Object.keys(cn)
        .filter((s) => s.length > 0)
        .sort()

    let disciplinePrix = prixData.map((_) => _.discipline_label).map((_) => (_ ? _.toLowerCase() : ''))
    let d = {}
    for (let s of disciplinePrix) d[s] = null
    disciplinePrix = Object.keys(d)
        .filter((s) => s.length > 0)
        .sort()

    let anneePrix = prixData.map((_) => _.année).map((_) => (_ ? _.toLowerCase() : ''))
    let a = {}
    for (let s of anneePrix) a[s] = null
    anneePrix = Object.keys(a)
        .filter((s) => s.length > 0)
        .sort()

    let typePrix = prixData.map((_) => _.type_label).map((_) => (_ ? _.toLowerCase() : ''))
    let t = {}
    for (let s of typePrix) t[s] = null
    typePrix = Object.keys(t)
        .filter((s) => s.length > 0)
        .sort()

    useEffect(() => {
        fetchData()
    }, [])

    return prixData.length === 0 ? (
        <Container maxWidth='md' align='center'>
            <CircularProgress />
        </Container>
    ) : (
            <>
                <FormControl className={classes.formControl}>
                    <InputLabel id='type-select-label'>Nom de Prix</InputLabel>
                    <Select
                        labelId='nom-select-label'
                        id='nom-select'
                        onChange={handleNomPrixChange}
                        value={nameP}
                    >
                        <MenuItem value=''>
                            <em>Pas de filtre</em>
                        </MenuItem>
                        {nomPrix.map((s) => (
                            <MenuItem key={s} value={s}>
                                {s}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                    <InputLabel id='type-select-label'>Type de Prix</InputLabel>
                    <Select
                        labelId='nom-select-label'
                        id='nom-select'
                        onChange={handleTypePrixChange}
                        value={typeP}
                    >
                        <MenuItem value=''>
                            <em>Pas de filtre</em>
                        </MenuItem>
                        {typePrix.map((s) => (
                            <MenuItem key={s} value={s}>
                                {s}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                    <InputLabel id='type-select-label'>Discipline de Prix</InputLabel>
                    <Select
                        labelId='nom-select-label'
                        id='nom-select'
                        onChange={handleDisciplinePrixChange}
                        value={discP}
                    >
                        <MenuItem value=''>
                            <em>Pas de filtre</em>
                        </MenuItem>
                        {disciplinePrix.map((s) => (
                            <MenuItem key={s} value={s}>
                                {s}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                    <InputLabel id='type-select-label'>Année de Prix</InputLabel>
                    <Select
                        labelId='nom-select-label'
                        id='nom-select'
                        onChange={handleAnneePrixChange}
                        value={yearP}
                    >
                        <MenuItem value=''>
                            <em>Pas de filtre</em>
                        </MenuItem>
                        {anneePrix.map((s) => (
                            <MenuItem key={s} value={s}>
                                {s}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                    <InputLabel id='type-select-label'>Complément de Prix</InputLabel>
                    <Select
                        labelId='nom-select-label'
                        id='nom-select'
                        onChange={handleCompNomPrixChange}
                        value={compnP}
                    >
                        <MenuItem value=''>
                            <em>Pas de filtre</em>
                        </MenuItem>
                        {compnomPrix.map((s) => (
                            <MenuItem key={s} value={s}>
                                {s}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div style={{ maxWidth: '100%' }}>
                    <MaterialTable
                        title='Prix'
                        columns={[
                            { title: 'Nom', field: 'nom_label', defaultFilter: nameP },
                            { title: 'Type', field: 'type_label', defaultFilter: typeP },
                            { title: 'Discipline', field: 'discipline_label', defaultFilter: discP },
                            { title: 'Complément', field: 'complément_nom_prix_label', defaultFilter: compnP },
                            { title: "Année d'attribution", field: 'année', defaultFilter: yearP },
                            { title: 'Prénom lauréat.e', field: 'élève_prénom' },
                            { title: 'Nom lauréat.e', field: 'élève_nom' },
                            { title: 'Cote AN du registre lauréat.e', field: 'élève_cote_AN_registre' },
                            { title: 'Sexe lauréat.e', field: 'élève_sexe', sorting: false }
                        ]}
                        options={{
                            pageSize: 50,
                            pageSizeOptions: [20, 50, 100],
                            filtering: true,
                            sorting: true,
                            cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
                            headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
                        }}
                        data={prixData}
                        onRowClick={((evt, selectedRow) => {
                            const eleveId = selectedRow.élève.slice(-36)
                            history.push('/eleve/' + eleveId)
                        })}
                    >
                    </MaterialTable>
                </div>
            </>
        )
}

export default withRouter(Prix)
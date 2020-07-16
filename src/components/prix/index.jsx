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


function Prix({history}) {

    const classes = useStyles()
    const [prixData, setData] = useState([])
    const [nameP, setNomPrix] = useState('')

    async function fetchData() {
        const res = await fetch('http://data-iremus.huma-num.fr/api/hemef/prix')
        res.json().then((res) => {
            console.log(res)
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

    let nomPrix = prixData.map((_) => _.nom_label).map((_) => (_ ? _.toLowerCase() : ''))
    let o = {}
    for (let s of nomPrix) o[s] = null
    nomPrix = Object.keys(o)
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
                    <InputLabel id='type-select-label'>Noms de Prix</InputLabel>
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

                <div style={{ maxWidth: '100%' }}>
                    <MaterialTable
                        title='Liste des prix recensés'
                        columns={[
                            { title: 'Nom du prix', field: 'nom_label', defaultFilter: nameP},
                            { title: 'Discipline', field: 'discipline_label' },
                            { title: "Année d'attribution", field: 'année' },
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


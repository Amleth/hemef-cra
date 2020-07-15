import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'
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


class prix extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            prixData: [],
            NomPrix:''
        }

        this.handleNomPrixChange = this.handleNomPrixChange.bind(this);
       
    }

    handleNomPrixChange(e){
        e.preventDefault()
        this.setState({NomPrix: e.target.value});
    }

    componentDidMount() {   
        axios.get('http://data-iremus.huma-num.fr/api/hemef/prix').then(res => {
            const initData = res.data
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
            this.setState({ prixData: dataArray })
        })
    }

    

    render() {

        let nomPrix = this.state.prixData.map((_) => _.nom_label).map((_) => (_ ? _.toLowerCase() : ''))
        let o = {}
        for (let s of nomPrix) o[s] = null
        nomPrix = Object.keys(o)
            .filter((s) => s.length > 0)
            .sort()

        if (!this.state.prixData) {
            return (<Container maxWidth='md' align='center'>
                <CircularProgress />
            </Container>)
        } else {
            return (
                <>
                    <FormControl className={useStyles.formControl}>
                        <InputLabel id='type-select-label'>Noms de Prix</InputLabel>
                        <Select
                            labelId='nom-select-label'
                            id='nom-select'
                            onChange={this.handleNomPrixChange}
                            value={this.state.NomPrix}
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
                                { title: 'Nom du prix', field: 'nom_label', defaultFilter: this.state.NomPrix},
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
                            data={this.state.prixData}
                            onRowClick={((evt, selectedRow) => {
                                const eleveId = selectedRow.élève.slice(-36)
                                this.props.history.push('/eleve/' + eleveId)
                            })}
                        >
                        </MaterialTable>
                    </div>
                </>
            )
        }
    }
}

export default withRouter(prix)


import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'
import { CircularProgress, Container } from '@material-ui/core'

class prix extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            prixData: [],
        }
    }
    componentDidMount() {
        axios.get('http://data-iremus.huma-num.fr/api/hemef/prix').then(res => {
            const initData = res.data
            let dataArray = []
            for (const o of initData){
                if(!o.année){
                    if (o.année_hypothèse) {
                        o.année = o.année_hypothèse.split('-')[0] + ' (hypothèse)'
                    }
                }
                else {
                    o.année = o.année.split('^^')[0]
                }
            dataArray.push(o)
            }
            this.setState({ prixData: dataArray})
        })
    }

    render() {
        if (!this.state.prixData) {
            return (<Container maxWidth='md' align='center'>
                <CircularProgress />
            </Container>)
        } else {
            return (
                <div style={{ maxWidth: '100%' }}>
                    <MaterialTable
                        title='Liste des prix recensés'
                        columns={[
                            { title: 'Nom du prix', field: 'nom_label' },
                            { title: 'Discipline', field: 'discipline_label' },
                            { title: "Année d'attribution", field: 'année'},
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
            )
        }
    }
}

export default withRouter(prix)

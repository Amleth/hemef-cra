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
    //a adapter
    componentDidMount() {
        axios.get('http://data-iremus.huma-num.fr/api/hemef/prix').then(res => {
            this.setState({ prixData: res.data })
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
                            { title: "Année d'attribution", render: (r)=>{
                                if (r.année){
                                    return r.année.split('^^')[0]
                                }
                                else if (r.année_hypothèse){
                                    return (r.année_hypothèse.split('-')[0] + ' (hypothèse)')
                                }
                            },
                            sorting: false},
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

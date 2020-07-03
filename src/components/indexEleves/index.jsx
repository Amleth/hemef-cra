import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'

class indexEleves extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      elevesData: [],
    }
  }
//a adapter
  componentDidMount() {
    axios.get('http://data-iremus.huma-num.fr/api/hemef/eleves').then(res => {
      this.setState({ elevesData: res.data })
    })
  }

  render() {
    if (!this.state.elevesData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      return (
        <div style={{ maxWidth: '100%' }}>
          <MaterialTable
            title='Liste des élèves du conservatoire'
            columns={[
              { title: 'Nom', field: 'nom' },
              { title: 'Prénom', field: 'prénom' },
              { title: 'Cote AN du registre', field: 'cote_AN_registre' }
            ]}
            options={{
              pageSize : 20,
              pageSizeOptions : [10,20,50],
              filtering : true,
              sorting : true
            }}
            data={this.state.elevesData}
            onRowClick={((evt, selectedRow) => {
              const eleveId = selectedRow.élève.slice(-36)
              this.props.history.push('/eleve/'+eleveId)
            })}
          >
          </MaterialTable>
        </div>
      )
    }
  }
}

export default withRouter(indexEleves)

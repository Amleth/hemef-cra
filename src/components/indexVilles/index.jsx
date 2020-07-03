import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'

class indexVilles extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityData: [],
    }
  }
//a adapter
  componentDidMount() {
    axios.get('http://data-iremus.huma-num.fr/api/hemef/villes').then(res => {
      this.setState({ cityData: res.data })
    })
  }

  render() {
    if (!this.state.cityData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      return (
        <div style={{ maxWidth: '100%' }}>
          <MaterialTable
            title='Liste des villes'
            columns={[
              { title: 'Nom', field: 'ville_label' },
              { title: 'Département', field : 'département_label'},
            ]}
            options={{
              pageSize: 20,
              pageSizeOptions: [10, 20, 50]
            }}
            data={this.state.cityData}
            onRowClick={((evt, selectedRow) => {
              const id = selectedRow.ville.slice(-36)
              this.props.history.push('/ville/'+id)
            })}
          >
          </MaterialTable>
        </div>
      )
    }

  }
}

export default withRouter(indexVilles)

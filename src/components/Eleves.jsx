import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'
import { CircularProgress, Container } from '@material-ui/core'

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
      return (<Container maxWidth='md' align='center'>
        <CircularProgress />
      </Container>)
    } else {
      return (
        <div style={{ maxWidth: '100%' }}>
          <MaterialTable
            title='Liste des élèves du conservatoire'
            columns={[
              { title: 'Nom', field: 'nom', defaultSort: 'asc' },
              { title: 'Prénom', field: 'prénom' },
              { title: 'Cote AN du registre', field: 'cote_AN_registre' }
            ]}
            options={{
              pageSize: 20,
              pageSizeOptions: [10, 20, 50],
              filtering: true,
              sorting: true,
              cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
              headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
            }}
            data={this.state.elevesData}
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

export default withRouter(indexEleves)

import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'
import { CircularProgress, Container } from '@material-ui/core'

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
      return (<Container maxWidth='md' align='center'>
      <CircularProgress />
    </Container>)
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
              pageSizeOptions: [10, 20, 50],
              cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
              headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
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

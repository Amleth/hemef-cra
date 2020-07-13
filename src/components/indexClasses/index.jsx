import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'
import { CircularProgress,Container } from '@material-ui/core'

class indexClasses extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ClassesData: [],
    }
  }

  componentDidMount() {
    axios.get('http://data-iremus.huma-num.fr/api/hemef/classes').then(res => {
      this.setState({ ClassesData: res.data })
    })
  }

  render() {
    if (!this.state.ClassesData) {
      return (<Container maxWidth='md' align='center'>
      <CircularProgress />
    </Container>)
    } else {
      return (
        <div style={{ maxWidth: '100%' }}>
          <MaterialTable
            title='Liste des Classes'
            columns={[
              { title: 'Discipline', field: 'discipline_label' },
              { title : "Professeur", field : 'professeur_label'
              },
              // Si un tri sur le nombre d'élèves est souhaité, rejouté dans la colonne dédiée au Nombre d'élèves la commande field : 'parcours_classe_count',
              { title : "Nombre d'élèves", 
              render : row => {
                let count = row.parcours_classe_count.split("^^")[0]
                return count
              }
              
              }
            ]}
            options={{
              pageSize : 20,
              pageSizeOptions : [10,20,50],
              filtering : true,
              sorting : true,
              cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
              headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
            }}
            data={this.state.ClassesData}
            onRowClick={((evt, selectedRow) => {
              const classeId = selectedRow.classe.slice(-36)
              this.props.history.push('/classe/'+classeId)
            })}
          >
          </MaterialTable>
        </div>
      )
    }
  }
}

export default withRouter(indexClasses)

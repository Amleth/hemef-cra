import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'

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
      return <div>Données en cours de téléchargement...</div>
    } else {
      return (
        <div style={{ maxWidth: '100%' }}>
          <MaterialTable
            title='Liste des Classes'
            columns={[
              { title: 'Discipline', field: 'discipline_label' },
              { title : "Professeur", field : 'professeur_label'
              },
              { title : "Nombre d'élèves", field : 'parcours_classe_count',
              render : row => {
                let count = row.parcours_classe_count.split("^^")[0]
                return count
              }
              
              }
            ]}
            options={{
              pageSize : 20,
              pageSizeOptions : [10,20,50]
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

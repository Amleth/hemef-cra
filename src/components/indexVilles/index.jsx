import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'
import lodash from 'lodash'

class indexVilles extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      worksData: [],
    }
  }
//a adapter
  componentDidMount() {
    axios.get('http://data-iremus.huma-num.fr/api/musrad30/works/').then(res => {
      const identifiedWorks = res.data.filter(w => w.work_name || w.composer)
      console.log(identifiedWorks.length)
      let newData = []
      const data = lodash.groupBy(identifiedWorks, 'work')
      console.log(data)
      for (const work in data){
        const composers = data[work].map(item =>
          (item.composer_surname ? (item.composer_given_name ? item.composer_given_name + " " : "") + item.composer_surname : null)
        )
        data[work][0].composer = composers
        newData.push(data[work][0])
      }
      this.setState({ worksData: newData })
    })
  }

  render() {
    if (!this.state.worksData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      return (
        <div style={{ maxWidth: '100%' }}>
          <MaterialTable
            title='Liste des oeuvres identifiées'
            columns={[
              { title: 'Nom', field: 'work_name' },
              { title: 'Compositeurs', field : 'string', render: r => {
                if (r.composer[0]) {
                  console.log(r.composer.length)
                  let chaine = ""
                  for (let i = 0; i < (r.composer.length) - 1; i++) {
                    chaine = chaine + r.composer[i] + ", "
                  }
                  chaine = chaine + r.composer[r.composer.length - 1]
                  return (chaine)
                } else return ('Compositeur anonyme')
                }
              },
            ]}
            options={{
              pageSize: 20,
              pageSizeOptions: [10, 20, 50]
            }}
            data={this.state.worksData}
            onRowClick={((evt, selectedRow) => {
              const workId = selectedRow.work.slice(-36)
              this.props.history.push('/work/'+workId)
            })}
          >
          </MaterialTable>
        </div>
      )
    }

  }
}

export default withRouter(IdentifiedWorks)

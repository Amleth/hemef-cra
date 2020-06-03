import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'

class indexDisciplines extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      programsData: [],
    }
  }
//a adapter
  componentDidMount() {
    axios.get('http://data-iremus.huma-num.fr/api/musrad30/super_events').then(res => {
      this.setState({ programsData: res.data })
    })
  }

  render() {
    if (!this.state.programsData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      return (
        <div style={{ maxWidth: '100%' }}>
          <MaterialTable
            title='Liste des programmes'
            columns={[
              { title: 'Radio', field: 'station_label' },
              { title : "Date", render: rowData => {
                let date = rowData.start_date.split('T')[0]
                return (date.split('-')[2] + "-" + date.split('-')[1] + "-" + date.split('-')[0])
              }},
              { title : "Plage horaire", type : 'date', render: rowData => {
                let heuredebut = rowData.start_date.split('T')[1]
                let heurefin = rowData.end_date.split('T')[1]
                return (heuredebut.split(':00+')[0] + ' - ' + heurefin.split(':00+')[0])
              }},
              // { title : "Durée", type : 'time', render: rowData => {
              //   let duree = rowData.duration.split('T')[1]
              //   let heures = duree.split('H')[0]
              //   let minutes = duree.split('H')[1]
              //   minutes = minutes.split('M')[0]
              //   return (heures + 'h' + minutes +'min.')
              // }}, a mettre dans super_event/id !!

              { title: 'Type', field: 'type_label' },
              { title: 'Titre', field: 'title_label' },
              { title: 'Format', field: 'format_label' },
              { title: 'Compositeurs mentionnés', render : rowData => {
                return(rowData.composers_count.split('^^')[0])
              } },
              { title: 'Interprètes mentionnés', render : rowData => {
                return(rowData.performers_count.split('^^')[0])
              } },
              { title: 'Oeuvres mentionnées', render : rowData => {
                return(rowData.works_count.split('^^')[0])
              } },
            ]}
            options={{
              pageSize : 20,
              pageSizeOptions : [10,20,50]
            }}
            data={this.state.programsData}
            onRowClick={((evt, selectedRow) => {
              const progId = selectedRow.super_event.slice(-36)
              this.props.history.push('/super_event/'+progId)
            })}
          >
          </MaterialTable>
        </div>
      )
    }
  }
}

export default withRouter(Programs)

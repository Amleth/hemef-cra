import React from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'
import {
  Box,
  Grid,
  Container,
  Typography
} from '@material-ui/core'
import MaterialTable from 'material-table'
import lodash from 'lodash'

class ville extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      workData: null,
    }
  }
//a adapter
  componentDidMount() {
    const id = this.props.match.params.id

    axios.get('http://data-iremus.huma-num.fr/api/musrad30/work/' + id).then(res => {
      let newData = []
      const data = lodash.groupBy(res.data, 'sub_event')
      for (const sub_event in data) {
        const performers = data[sub_event].map(item =>
          (item.performer_surname ? (item.performer_given_name ? item.performer_given_name + " " : "") + item.performer_surname : null)
        )

        // console.log(data[sub_event])
        const composers = data[sub_event].map(item =>
          (item.composer_surname ? (item.composer_given_name ? item.composer_given_name + " " : "") + item.composer_surname : null)
        // item.composer_given_name + " " + item.composer_surname
        )
        const distinctPerformers = [...new Set(performers)]
        const distinctComposers = [...new Set(composers)]
        data[sub_event][0].performer = distinctPerformers
        data[sub_event][0].composer = distinctComposers
        newData.push(data[sub_event][0])
      }
      this.setState({ workData: newData })
    })
  }

  render() {
    if (!this.state.workData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      const wData = this.state.workData[0]
      let heuredebut = wData.super_event_start_date.split('T')[1]
      let heurefin = wData.super_event_end_date.split('T')[1]
      let plageHoraire = heuredebut.split(':00+')[0] + ' - ' + heurefin.split(':00+')[0]
      console.log(plageHoraire)

      let compositeurs = ""
      if (wData.composer[0] !== undefined) {
        for (let i = 0; i < (wData.composer.length) - 1; i++) {
          compositeurs = compositeurs + wData.composer[i] + ", "
        }
        compositeurs = compositeurs + wData.composer[wData.composer.length - 1]
      } else compositeurs = 'Compositeur anonyme';
    
    return (
      <Container>

<Typography component='h1' variant='h3'>Page de l'oeuvre</Typography>
          <Grid container direction='row' justify='flex-start' alignItems='center'>
            <Grid item>
              <Typography variant='button' component='h2'>
                <Box p={2}>Titre :</Box>
                <Box p={2}>Compositeur(s) :</Box>
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant='body1' component='body' >
              <Box p={2}>{this.state.workData[0].work_name}</Box>
                <Box p={2}>{compositeurs}</Box>
              </Typography>
            </Grid>
          </Grid>

        <MaterialTable
          title="Diffusions de l'oeuvre"
          columns={[
            { title: "Radio", field: "super_event_station_label" },
            { title: "Jour", field: "super_event_jour_debut_diffusion" },
            {
              title: "Date", render: rowData => {
                return (rowData.super_event_start_date.slice(8, 10) + "-" + rowData.super_event_start_date.slice(5, 7) + "-" + rowData.super_event_start_date.slice(0, 4))
              }
            },
            { title: "Plage Horaire", type: 'datetime', render: r => { return (plageHoraire) } },
            { title: "Titre du programme", field: "super_event_title_label" },
            { title: "Type du programme", field: "super_event_type_label" },
            { title: "Format de diffusion", field: "super_event_format_label" },
            {
              title: "Interprète", render: r => {
                if (r.performer[0]) {
                  // console.log(r.performer.length)
                  let chaine = ""
                  for (let i = 0; i < (r.performer.length) - 1; i++) {
                    chaine = chaine + r.performer[i] + ", "
                  }
                  chaine = chaine + r.performer[r.performer.length - 1]
                  return (chaine)
                } else return ('Interprète anonyme')
              }
            },
          ]}
          data={this.state.workData}
          onRowClick={((evt, selectedRow) => {
            const progId = selectedRow.super_event.slice(-36)
            this.props.history.push('/super_event/' + progId)
          })}
          options={{
            filtering: true
          }}
        >

        </MaterialTable>
      </Container>
    )
        }
  }
}


export default withRouter(Work)

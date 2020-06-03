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

class discipline extends React.Component {
  constructor(props) {
    super(props)
    this.state = { programData: null }
  }
//a adapter
  componentDidMount() {
    const id = this.props.match.params.id
    axios.get('http://data-iremus.huma-num.fr/api/musrad30/super_event/' + id).then(res => {
      let newData = []
      const data = lodash.groupBy(res.data, 'music_event')
      // console.log(data)
      for (const work in data) {
        const performers = data[work].map(item =>
          (item.performer_surname ? (item.performer_given_name ? item.performer_given_name + " " : "") + item.performer_surname : null)
        )
        const composers = data[work].map(item =>
          (item.composer_surname ? (item.composer_given_name ? item.composer_given_name + " " : "") + item.composer_surname : null)
        )
        data[work][0].performer = performers
        data[work][0].composer = composers
        newData.push(data[work][0])
      }
      this.setState({ programData: newData })
    })
  }

  render() {
    if (!this.state.programData) {
      return <div>Rien…</div>
    } else {
      const pData = this.state.programData[0]
      let description = pData.description
      description = description.split('@fr')[0]

      let heuredebut = pData.start_date.split('T')[1]
      let heurefin = pData.end_date.split('T')[1]
      let plageHoraire = heuredebut.split(':00+')[0] + ' - ' + heurefin.split(':00+')[0]

      let duree = pData.duration.split('T')[1]
      const heures = duree.split('H')[0]
      let minutes = duree.split('H')[1]
      minutes = minutes.split('M')[0]
      duree = heures + 'h' + minutes + 'min.'

      return (
        <Container>
          <Typography component='h1' variant='h3'>Page du programme</Typography>
          <Grid container direction='row' justify='flex-start' alignItems='center'>
            <Grid item>
              <Typography variant='button' component='h2'>
                <Box p={2}>Titre :</Box>
                <Box p={2}>Station de diffusion :</Box>
                
                <Box p={2}>Date de diffusion :</Box>
                <Box p={2}>Plage Horaire :</Box>
                <Box p={2}>Durée :</Box>
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant='body1' component='body' >
                <Box p={2}>{pData.title_label}</Box>
                <Box p={2}>{pData.station_label}</Box>
                
                <Box p={2}>{pData.jour_debut_diffusion + " " + pData.start_date.slice(8, 10) + "-" + pData.start_date.slice(5, 7) + "-" + pData.start_date.slice(0, 4)}</Box>
                <Box p={2}>{plageHoraire}</Box>
                <Box p={2}>{duree}</Box>
              </Typography>
            </Grid>
          </Grid>

          <Grid>
          <Typography variant='button' component='h2'><Box p={2}>Description :</Box></Typography>
          <Typography variant='body1' component='body' ><Box p={2}>{description}</Box></Typography>
          </Grid>

          <MaterialTable
            title="Plages diffusées"
            columns={[
              {
                title: "Titre de l'oeuvre", render: rowdata => {
                  if (rowdata.work_name) {
                    return rowdata.work_name
                  } else return ('Oeuvre anonyme')
                }
              },
              {
                title: "Compositeurs", render: r => {
                  if (r.composer[0]) {
                    console.log(r.composer.length)
                    let chaine = ""
                    for (let i = 0; i < (r.composer.length) - 1; i++) {
                      chaine = chaine + r.composer[i] + ", "
                    }
                    chaine = chaine + r.composer[r.composer.length - 1]
                    return (chaine)
                  } else return ('Compositeur anonyme')

                  // if (r.composer) {
                  //   console.log(r.performer.length)
                  //   let name = (r.composer_given_name ? r.composer_given_name + " " : "") + r.composer_surname
                  //   return (name)
                  // } else return ('Compositeur anonyme')
                }
              },
              {
                title: "Interprètes", render: r => {
                  if (r.performer[0]) {
                    console.log(r.performer.length)
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
            data={this.state.programData}
            onRowClick={((evt, selectedRow) => {
              const workId = selectedRow.work.slice(-36)
              this.props.history.push('/work/' + workId)
            })}
          >

          </MaterialTable>

        </Container>
      )
    }
  }
}

export default withRouter(Program)
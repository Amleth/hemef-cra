import React from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'
import {
  Box,
  Grid,
  Container,
  Typography,
  TextField
} from '@material-ui/core'
import MaterialTable from 'material-table'

class classeCursus extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      classeCursusData: null,
    }
  }

  //a adapter
  componentDidMount() {
    const id = this.props.match.params.id

    axios.get('http://data-iremus.huma-num.fr/api/hemef/parcours_classe/' + id).then(res => {
      this.setState({ classeCursusData: res.data })
    }
    )
  }
  
  render() {
    if (!this.state.classeCursusData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      console.log('données : ')
      console.log(this.state.classeCursusData)
      let parcours_classe = this.state.classeCursusData
      let tablePrix = null
      // let tableInterpretations = null

      //A ADAPTER AVEC LA MAJ API
      if (this.state.classeCursusData.prix !== undefined) {;
        tablePrix =
          <Grid>
            <Box m={3}>
              <MaterialTable
                title='Prix Obtenus'
                columns={[
                  { title: "Intitulé", field: "prix_nom" },
                  { title: "Date", field: "string",
                render : (r) => {
                  if (r.prix_année){
                    console.log(r.prix_année)
                  }
                  else if (r.prix_hypothèse_année){
                    console.log(r.prix_hypothèse_année)
                  }
                } },

                  { title: "Discipline", field: "prix_discipline_label" }
                ]}
                data={this.state.classeCursusData.prix}
                // onRowClick={((evt, selectedRow) => {
                //   const workId = selectedRow.work.slice(-36)
                //   this.props.history.push('/work/' + workId)
                // })}
              >

              </MaterialTable>
            </Box>
          </Grid>
      }

      let informations_clés = null

      if (this.state.classeCursusData.hypothèse_date_sortie){
        informations_clés =
        <Grid container direction='row' justify='flex-start' alignItems='center'>
            {makeTextField('Élève', parcours_classe.nom + parcours_classe.prénom)})}
          </Grid>
      }

      return (
        <Container>
          <Typography component='h1' variant='h3'>Parcours Classe</Typography>
          <Grid container direction='row' justify='flex-start' alignItems='center'>
            <Grid item>
              <Typography variant='button' component='h2'>
                <Box p={2}>Elève :</Box>
                <Box p={2}>Discipline :</Box>
                <Box p={2}>Professeur :</Box>
                <Box p={2}>Date d'entrée :</Box>
                <Box p={2}>Motif d'entrée :</Box>
                <Box p={2}>Date sortie :</Box>
                <Box p={2}>Motif de sortie :</Box>
                <Box p={2}>Observations :</Box>
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant='body1' >
                {/* <Box p={2}>{this.state.classeCursusData[0].prénom}</Box> */}
                {/* <Box p={2}>{this.state.musicianData.given_name}</Box>
                <Box p={2}>{datesMusicien}</Box>
                <Box p={2}>{this.state.musicianData.status_label}</Box>
                <Box p={2}>{this.state.musicianData.nationality_label}</Box>
                <Box p={2}>{this.state.musicianData.style_label}</Box>
                <Box p={2}>{this.state.musicianData.description}</Box> */}
              </Typography>
            </Grid>
          </Grid>
          {tablePrix}
        </Container>
      )
    }
  }
}

function makeTextField(f, v) {
  return (
    <TextField
      label={f}
      defaultValue={v}
      InputProps={{
        readOnly: true
      }}
    />
  )
}

function makeDate(d) {
  if (d){
    let tempDate = d.split('^^')[0]
    return (tempDate.split('-')[2] + '/' + tempDate.split('-')[1] + '/' + tempDate.split('-')[0])
  }
}

export default withRouter(classeCursus)

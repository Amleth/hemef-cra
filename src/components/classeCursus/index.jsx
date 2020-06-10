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

      // if (res.data.composed_works) {
      //   let newDataComp = {}
      //   let tabDataComp = []
      //   const tab = res.data.composed_works
      //   for (let i = 0; i < tab.length; i++) {
      //     if (!(tab[i].work in newDataComp)) {
      //       newDataComp[tab[i].work] = tab[i].work_name
      //     }
      //   }
      //   for (let key in newDataComp) {
      //     let workObj = {}
      //     workObj.work = key
      //     workObj.work_name = newDataComp[key]
      //     tabDataComp.push(workObj)
      //   }
      //   console.log(tabDataComp)
      //   res.data.composed_works = tabDataComp
      // }

      this.setState({ classeCursusData: res.data })
    }
    )
  }

  // handleClick(rang) {
  //   const WorkId = (rang).slice(-36)
  //   this.props.history.push('/work/' + WorkId)
  // }

  render() {
    if (!this.state.classeCursusData) {
      return <div>Données en cours de téléchargement...</div>
    } else {

      console.log(this.state.classeCursusData)
      let tablePrix = null
      // let tableInterpretations = null

      //A ADAPTER AVEC LA MAJ API
      if (this.state.classeCursusData.prix !== undefined) {
        //let compositionData = this.state.musicianData.composed_works;
        tablePrix =
          <Grid>
            <Box m={3}>
              <MaterialTable
                title='Prix Obtenus'
                columns={[
                  { title: "Intitulé", field: "" },
                  { title: "Discipline", field: "" },
                  { title: "Date", field: "" }
                ]}
                data={this.state.classeCursusData.prix}
                onRowClick={((evt, selectedRow) => {
                  const workId = selectedRow.work.slice(-36)
                  this.props.history.push('/work/' + workId)
                })}
              >

              </MaterialTable>
            </Box>
          </Grid>
      }

      // if (this.state.musicianData.performed_works !== undefined) {
      //   let performanceData = this.state.musicianData.performed_works;
      //   tableInterpretations =
      //     <Grid>
      //       <Box m={3}>
      //         <MaterialTable
      //           title='Oeuvres Interprétées'
      //           columns={[
      //             {
      //               title: "Titre", render: row => {
      //                 return (row.work_name ? row.work_name : 'Oeuvre anonyme')
      //               }
      //             },
      //             { title: "Radio de diffusion", field: "radio_name" },
      //             {
      //               title: "Date d'interprétation", render: row => {
      //                 let date = row.start_date.split('T')[0]
      //                 date = date.split('-')
      //                 return (date[2] + "-" + date[1] + "-" + date[0])
      //               }
      //             },
      //             {
      //               title: "Plage horaire d'interprétation", render: row => {
      //                 let HDeb = row.start_date.split('T')[1]
      //                 HDeb = HDeb.split(':00+')[0]
      //                 let HFin = row.end_date.split('T')[1]
      //                 HFin = HFin.split(':00+')[0]
      //                 return (HDeb + " - " + HFin)
      //               }
      //             },
      //             {
      //               title: "Compositeur de l'oeuvre", render: row => {
      //                 return (row.composer_surname ? (row.composer_given_name ? row.composer_given_name + " " : "") + row.composer_surname : 'Compositeur anonyme')
      //               }
      //             },
      //           ]}
      //           data={performanceData}
      //           onRowClick={((evt, selectedRow) => {
      //             const workId = selectedRow.work.slice(-36)
      //             this.props.history.push('/work/' + workId)
      //           })}>
      //         </MaterialTable>
      //       </Box>
      //     </Grid>
      // }

      // const dateNaissance = this.state.musicianData.birth_date
      // const dateMort = this.state.musicianData.death_date
      // let datesMusicien = ""
      // if (dateNaissance !== undefined) {
      //   datesMusicien = dateNaissance + " - "
      // } else {
      //   datesMusicien = "???? - "
      // }
      // if (dateMort !== undefined) {
      //   datesMusicien = datesMusicien + dateMort
      // }
      // else {
      //   datesMusicien = datesMusicien + "????"
      // }

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
{/* 
          
          {tableInterpretations} */}
        </Container>
      )
    }
  }
}

export default withRouter(classeCursus)

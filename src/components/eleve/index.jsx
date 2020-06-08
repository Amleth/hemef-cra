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

class eleve extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      eleveData: null,
    }
  }
  //a adapter
  componentDidMount() {
    const id = this.props.match.params.id

    axios.get('http://data-iremus.huma-num.fr/api/hemef/eleve/' + id).then(res => {

      this.setState({ eleveData: res.data })
    }
    )
  }

  render() {
    if (!this.state.eleveData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      //affichage conditionnel pour le champ date de sortie
      let intitule_date_sortie_conservatoire = null
      let champ_date_sortie_conservatoire = null
      if (this.state.eleveData.hypothese_cursus_date_sortie_conservatoire) {
        intitule_date_sortie_conservatoire = "Date de sortie supposée :"
        champ_date_sortie_conservatoire = <Box p={2}>{this.state.eleveData.hypothese_cursus_date_sortie_conservatoire}</Box>
      }
      else if (this.state.eleveData.cursus_date_sortie_conservatoire) {
        intitule_date_sortie_conservatoire = "Date de sortie :"
        champ_date_sortie_conservatoire = <Box p={2}>{this.state.eleveData.cursus_date_sortie_conservatoire.split("^^")[0]}</Box>
      }

      //affichage conditionnel pour le champ motif de sortie
      let intitule_motif_sortie_conservatoire = null
      let champ_motif_sortie_conservatoire = null
      if (this.state.eleveData.hypothese_cursus_motif_sortie) {
        intitule_motif_sortie_conservatoire = "Motif de sortie supposé :"
        champ_motif_sortie_conservatoire = <Box p={2}>{this.state.eleveData.hypothese_cursus_motif_sortie}</Box>
      }
      else if (this.state.eleveData.cursus_motif_sortie) {
        intitule_motif_sortie_conservatoire = "Motif de sortie :"
        champ_motif_sortie_conservatoire = <Box p={2}>{this.state.eleveData.cursus_motif_sortie.split("^^")[0]}</Box>
      }

      //affichage conditionnel du pseudonyme
      let pseudonyme = "Non Renseigné"
      if (this.state.eleveData.pseudonyme){
        let pseudonyme = this.state.eleveData.pseudonyme
      }

      return (
        <Container>
          <Typography component='h1' variant='h3'>Page de l'élève</Typography>
          <Grid container direction='row' justify='flex-start' alignItems='center'>
            <Grid item>
              <Typography variant='button' component='h2'>
                <Box p={2}>Nom :</Box>
                <Box p={2}>Prénom :</Box>
                <Box p={2}>Pseudonyme :</Box>
                <Box p={2}>Sexe :</Box>
                <Box p={2}>Date de naissance :</Box>
                <Box p={2}>Lieu de naissance :</Box>
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant='body1' component='body' >
                <Box p={2}>{this.state.eleveData.nom}</Box>
                <Box p={2}>{this.state.eleveData.prenom}</Box>
                <Box p={2}>{pseudonyme}</Box>
                <Box p={2}>{this.state.eleveData.sexe}</Box>
                <Box p={2}>{this.state.eleveData.date_de_naissance.split("^^")[0]}</Box>
                <Box p={2}>{this.state.eleveData.nait_a_label}</Box>
              </Typography>
            </Grid>
          </Grid>
          {/* Insérer des intitulés optionnels/conditionnels pour les hypothèses et potentiellement vides */}
          <Typography component='h2' variant='h4'>Informations relatives au cursus</Typography>
          <Grid container direction='row' justify='flex-start' alignItems='center'>
            <Grid item>
              <Typography variant='button' component='h2'>
                <Box p={2}>Cote registre AN :</Box>
                <Box p={2}>Date d'entrée au conservatoire :</Box>
                <Box p={2}>Motif d'admission :</Box>
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant='body1' component='body' >
                <Box p={2}>{this.state.eleveData.cote_AN_registre}</Box>
                <Box p={2}>{this.state.eleveData.cursus_date_entree_conservatoire.split("^^")[0]}</Box>
                <Box p={2}>{this.state.eleveData.cursus_motif_admission}</Box>
              </Typography>
            </Grid>
          </Grid>

          <Grid container direction='row' justify='flex-start' alignItems='center'>
            <Grid item>
              <Typography variant='button' component='h2'>
                <Box p={2}>{intitule_date_sortie_conservatoire}</Box>
                <Box p={2}>{intitule_motif_sortie_conservatoire}</Box>
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant='body1' component='body' >
                {champ_date_sortie_conservatoire}
                {champ_motif_sortie_conservatoire}
              </Typography>
            </Grid>
          </Grid>
          <MaterialTable
            title="Classes suivies"
            columns={[
              {title: "Discipline", field: "discipline_enseignée_label"},
              {title: "Professeur", field: "professeur_label"},{
                title: "Date d'entrée", render: row => {
                  let date = row.date_entrée.split('T')[0]
                  date = date.split('-')
                  return (date[2] + "-" + date[1] + "-" + date[0])
                }
              }
            ]}
            data={this.state.eleveData.parcours}
          />
        </Container>

      )
    }
  }
}

export default withRouter(eleve)

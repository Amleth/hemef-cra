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
      let intitule_sortie_conservatoire = ""
      let champ_sortie_conservatoire = null
      if (this.state.eleveData.hypothese_cursus_date_sortie_conservatoire) {
        intitule_sortie_conservatoire = "Date de sortie supposée :"
        champ_sortie_conservatoire = <Box p={2}>{this.state.eleveData.hypothese_cursus_date_sortie_conservatoire}</Box>
      }
      else {
        intitule_sortie_conservatoire = "Date de sortie :"
        champ_sortie_conservatoire = <Box p={2}>{this.state.eleveData.cursus_date_sortie_conservatoire.split("^^")[0]}</Box>
      }

      

      return (
        <Container>
          <Typography component='h1' variant='h3'>Page de l'élève</Typography>
          <Grid container direction='row' justify='flex-start' alignItems='center'>
            <Grid item>
              <Typography variant='button' component='h2'>
                <Box p={2}>Nom :</Box>
                <Box p={2}>Prénom :</Box>
                <Box p={2}>Sexe :</Box>
                <Box p={2}>Date de naissance :</Box>
                <Box p={2}>Lieu de naissance :</Box>
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant='body1' component='body' >
                <Box p={2}>{this.state.eleveData.nom}</Box>
                <Box p={2}>{this.state.eleveData.prenom}</Box>
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
                <Box p={2}>{intitule_sortie_conservatoire}</Box>
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant='body1' component='body' >
                <Box p={2}>{this.state.eleveData.cote_AN_registre}</Box>
                <Box p={2}>{this.state.eleveData.cursus_date_entree_conservatoire.split("^^")[0]}</Box>
                <Box p={2}>{this.state.eleveData.cursus_motif_admission}</Box>
                {champ_sortie_conservatoire}
              </Typography>
            </Grid>
          </Grid>
        </Container>

      )
    }
  }
}


export default withRouter(eleve)

import React from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'
import {
  CircularProgress,
  Grid,
  TextField,
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
      return (<Container maxWidth='md' align='center'>
      <CircularProgress />
    </Container>)
    } else {
      //affichage conditionnel pour le champ date de sortie
      let eleve = this.state.eleveData
      let intitule_date_sortie_conservatoire = null
      let champ_date_sortie_conservatoire = null
      if (this.state.eleveData.hypothese_cursus_date_sortie_conservatoire) {
        intitule_date_sortie_conservatoire = "Date de sortie supposée :"
        champ_date_sortie_conservatoire = this.state.eleveData.hypothese_cursus_date_sortie_conservatoire
      }
      else if (this.state.eleveData.cursus_date_sortie_conservatoire) {
        intitule_date_sortie_conservatoire = "Date de sortie :"
        champ_date_sortie_conservatoire = makeDate(this.state.eleveData.cursus_date_sortie_conservatoire)
      }

      //affichage conditionnel pour le champ motif de sortie
      let intitule_motif_sortie_conservatoire = null
      let champ_motif_sortie_conservatoire = null
      if (this.state.eleveData.hypothese_cursus_motif_sortie) {
        intitule_motif_sortie_conservatoire = "Motif de sortie supposé :"
        champ_motif_sortie_conservatoire = this.state.eleveData.hypothese_cursus_motif_sortie
      }
      else if (this.state.eleveData.cursus_motif_sortie) {
        intitule_motif_sortie_conservatoire = "Motif de sortie :"
        champ_motif_sortie_conservatoire = this.state.eleveData.cursus_motif_sortie
      }


      //affichage conditionnel du pseudonyme
      let infos_eleve = null

      const dateNaissance = makeDate(eleve.date_de_naissance)

      if (this.state.eleveData.pseudonyme) {
        infos_eleve =
          <Grid container direction='column' >
            {makeTextField('Nom', eleve.nom)}
            {makeTextField('Prénom', eleve.prenom)}
            {makeTextField('Sexe', eleve.sexe)}
            {makeTextField('Date de naissance', dateNaissance)}
            {makeTextField('Lieu de naissance', eleve.nait_a_label)}
            {makeTextField('Pseudonyme', eleve.pseudonyme)}
          </Grid>
      } else {
        infos_eleve =
          <Grid container direction='column' >
            {makeTextField('Nom', eleve.nom)}
            {makeTextField('Prénom', eleve.prenom)}
            {makeTextField('Sexe', eleve.sexe)}
            {makeTextField('Date de naissance', dateNaissance)}
            {makeTextField('Lieu de naissance', eleve.nait_a_label)}
          </Grid>
      }

      //Creation conditionnelle des infos_cursus
      let infos_cursus =
        <Grid container direction='column' >
          {makeTextField('Cote AN Registre', eleve.cote_AN_registre)}
          <br />
          {makeTextField("Date d'entrée au concervatoire ", makeDate(eleve.cursus_date_entree_conservatoire))}
          {makeTextField("Motif d'entrée", eleve.cursus_motif_admission)}
          <br />
          {makeTextField(intitule_date_sortie_conservatoire, champ_date_sortie_conservatoire)}
          {makeTextField(intitule_motif_sortie_conservatoire, champ_motif_sortie_conservatoire)}
        </Grid>

      return (
        <Container>
          <Typography component='h1' variant='h3'>Page de l'élève</Typography>
          {infos_eleve}
          <br />
          <br />
          <Typography component='h2' variant='h5'>Informations de cursus</Typography>
          {infos_cursus}
          <br />
          <br />
          <MaterialTable
            title="Classes suivies"
            columns={[
              { title: "Discipline", field: "discipline_enseignée_label" },
              { title: "Professeur", field: "professeur_label" }, {
                title: "Date d'entrée", render: row => {
                  let date = row.date_entrée.split('T')[0]
                  date = date.split('-')
                  return (date[2] + "/" + date[1] + "/" + date[0])
                }
              }
            ]}
            options={{
              pageSize: 5,
              pageSizeOptions: [5, 10, 20],
              cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
              headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
            }}
            data={this.state.eleveData.parcours}
            onRowClick={(evt, selectedRow) => {
              const parcoursClasseID = selectedRow.parcours.slice(-36)
              this.props.history.push('/classe_cursus/' + parcoursClasseID)
            }}

          />
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
  if (d) {
    let tempDate = d.split('^^')[0]
    return (tempDate.split('-')[2] + '/' + tempDate.split('-')[1] + '/' + tempDate.split('-')[0])
  }
}

export default withRouter(eleve)



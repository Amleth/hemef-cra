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
      if (this.state.classeCursusData.prix !== undefined) {
        tablePrix =
              <MaterialTable
                title='Prix Obtenus'
                columns={[
                  { title: "Intitulé", field: "prix_nom" },
                  {
                    title: "Date", field: "string",
                    render: (r) => {
                      if (r.prix_année) {
                       return(r.prix_année)
                      }
                      else if (r.prix_hypothèse_année) {
                        return('[' + r.prix_hypothèse_année.split("^^")[0] + ']')
                      }
                    }
                  },

                  { title: "Discipline", field: "prix_discipline_label" }
                ]}
                data={this.state.classeCursusData.prix}
              >

              </MaterialTable>
      }

      let informations_clés =
        <Grid container direction='column' justify='flex-start' >
          {makeTextField('Élève', parcours_classe.prénom + ' ' + parcours_classe.nom)}
          {makeTextField('Dicsipline', parcours_classe.discipline_label)}
        </Grid>;

      let infos_parcours = null

      if (this.state.classeCursusData.date_sortie) {
        infos_parcours =
          <Grid container direction='column' justify='flex-start' >
            {makeTextField("Date d'entrée", makeDate(parcours_classe.date_entrée.split('T')[0]))}
            {makeTextField("Motif d'entrée", parcours_classe.motif_entrée)}
            {makeTextField("Date de sortie", makeDate(parcours_classe.date_sortie.split('T')[0]))}
            {makeTextField("Motif de sortie", parcours_classe.motif_sortie)}
          </Grid>;
      }
      else if (this.state.classeCursusData.hypothèse_date_sortie) {
        infos_parcours =
          <Grid container direction='column' justify='flex-start' >
            {makeTextField("Date d'entrée", makeDate(parcours_classe.date_entrée.split('T')[0]))}
            {makeTextField("Motif d'entrée", parcours_classe.motif_entrée)}
            {makeTextField("Hypothèse date de sortie", parcours_classe.hypothèse_date_sortie)}
            {makeTextField("Motif de sortie", parcours_classe.motif_sortie)}
          </Grid>;
      }

      const observation = parcours_classe.observations_élève
      ? parcours_classe.observations_élève
          .trim()
          .split(';')
          .map((_) => _.trim())
          .filter((_) => _.length > 0)
          .join(' • ')
      : ''
      return (
        <Container>
          <Typography component='h1' variant='h3'>Parcours Classe</Typography>
          {informations_clés}
          <br />
          <br />
          {infos_parcours}
          <br />
          Observations : 
          <Box fontStyle='italic'>{observation && <Typography>{observation}</Typography>}</Box>
          <br/>
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
  if (d) {
    let tempDate = d.split('^^')[0]
    return (tempDate.split('-')[2] + '/' + tempDate.split('-')[1] + '/' + tempDate.split('-')[0])
  }
}

export default withRouter(classeCursus)

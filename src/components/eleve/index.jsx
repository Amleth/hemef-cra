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
      return (
        <Container>
          <Typography component='h1' variant='h3'>Page de l'élève</Typography>
          <Grid container direction='row' justify='flex-start' alignItems='center'>
            <Grid item>
              <Typography variant='button' component='h2'>
                <Box p={2}>Nom :</Box>
                <Box p={2}>Prénom :</Box>
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant='body1' component='body' >
                <Box p={2}>{this.state.eleveData.nom}</Box>
                <Box p={2}>{this.state.eleveData.prenom}</Box>
              </Typography>
            </Grid>
          </Grid>
        </Container>

      )
    }
  }
}


export default withRouter(eleve)

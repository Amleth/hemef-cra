import React from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'
import {
  CircularProgress,
  Box,
  Grid,
  Container,
  TextField,
  Typography
} from '@material-ui/core'
import MaterialTable from 'material-table'

class classe extends React.Component {
  constructor(props) {
    super(props)
    this.state = { classeData: null }
  }

  componentDidMount() {
    const id = this.props.match.params.id
    axios.get('http://data-iremus.huma-num.fr/api/hemef/classe/' + id).then(res => {
      this.setState({ classeData: res.data })
    })
  }

  render() {
    if (!this.state.classeData) {
      return (<Container maxWidth='md' align='center'>
      <CircularProgress />
    </Container>)
    } else {
      return (
        <Container>
          <Typography component='h1' variant='h3'>Page de la classe</Typography>
          <Grid container direction='column' >
            {makeTextField('Discipline', this.state.classeData.discipline_label)}
            <br />
            {makeTextField("Professeur", this.state.classeData.professeur_label)}
          </Grid>
          <br />
          <MaterialTable
            title="Élèves associés"
            columns={[
              {
                title: "Nom", 
                field: "élève_nom"
              },
              {
                title: "Prénom",
                field: "élève_prenom"
              },
              {
                title: "Cote AN Registre", 
                field: "élève_cote_AN_registre"
              },
            ]}
            data={this.state.classeData.élèves}
            onRowClick={((evt, selectedRow) => {
              const eleveId = selectedRow.élève.slice(-36)
              this.props.history.push('/eleve/' + eleveId)
            })}
          >
          </MaterialTable>
        </Container >
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


export default withRouter(classe)
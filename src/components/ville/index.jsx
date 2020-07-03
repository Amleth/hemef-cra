import React from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'
import {
  Container,
  Typography,
  Grid,
  TextField
} from '@material-ui/core'

class ville extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityData: null,
    }
  }
  componentDidMount() {
    const id = this.props.match.params.id

    axios.get('http://data-iremus.huma-num.fr/api/hemef/ville/' + id).then(res => {

      this.setState({ cityData: res.data })
    }
    )
  }
  render() {
    if (!this.state.cityData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      let ville = this.state.cityData
      let infoVille = null
      if (!ville.département_label) {
        infoVille = <Grid container direction='column' >
          {makeTextField('Pays', ville.pays_label)}
        </Grid>
      } else {
        infoVille =
          <Grid container direction='column' >
            {makeTextField('Département', ville.département_label)}
            {makeTextField('Pays', ville.pays_label)}
          </Grid>
      }
      return (<Container>
        <Typography component='h1' variant='h3'>{this.state.cityData.ville_label}</Typography>
        {infoVille}
      </Container>)
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

export default withRouter(ville)
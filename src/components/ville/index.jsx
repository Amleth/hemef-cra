import React from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'
import {
  Container,
  Typography,
  Grid,
  TextField
} from '@material-ui/core'
import MaterialTable from 'material-table'

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
      let tableau = null
      if(ville.élèves){
        tableau = <MaterialTable 
        title='Ville de naissance de :'
            columns={[
              { title: 'Nom', field: 'élève_nom' },
              { title: 'Prénom', field: 'élève_prénom' },
              { title: 'Cote', field: 'élève_cote_AN_registre' },
              { title: 'Sexe', field : 'élève_sexe'},
              // { title: 'pseudonyme', field : 'élève_sexe'}, a continuer
            ]}
            options={{
              pageSize: 20,
              pageSizeOptions: [10, 20, 50]
            }}
            data={ville.élèves}
            onRowClick={((evt, selectedRow) => {
              const id = selectedRow.élève.slice(-36)
              this.props.history.push('/eleve/'+id)
            })}>
          
        </MaterialTable>
      }
      return (<Container>
        <Typography component='h1' variant='h3'>{this.state.cityData.ville_label}</Typography>
        {infoVille}
        <br/>
        <br/>
        {tableau}
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
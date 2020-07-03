import React from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'
import {
  Container,
  Typography
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
      return(<Container>
        <Typography component='h1' variant='h3'>{this.state.cityData.ville_label}</Typography>
      </Container>)
    }
  }

}

export default withRouter(ville)
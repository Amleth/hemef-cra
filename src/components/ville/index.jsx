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
      villeData: null,
    }
  }
  //a adapter
  componentDidMount() {
    const id = this.props.match.params.id
    axios.get('http://data-iremus.huma-num.fr/api/hemef/ville/'+id).then(res => {
      this.setState({ villeData: res.data })
    }
    )

  }

  render() {
    if (!this.state.villeData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      return (
        console.log('test')
      )
    }
  }
}

export default withRouter(ville)

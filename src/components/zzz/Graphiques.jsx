import React from 'react'
import { Typography, List, Link, ListItem, Container } from '@material-ui/core'
import { withRouter } from 'react-router'

class indexGraphiques extends React.Component {
  render() {
    const list = (
      <List>
        <ListItem key={1}>
          <Link key={1} href={'/graph_sexe_discipline'}>
            Répartition sexuée des disciplines
          </Link>
        </ListItem>
      </List>
    )

    return (
      <Container>
        <Typography component='h1' variant='h4'>
          Graphiques disponibles
        </Typography>
        {list}
      </Container>
    )
  }
}

export default withRouter(indexGraphiques)

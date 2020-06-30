import React from 'react'
import { Typography, List, Link, ListItem, Container } from '@material-ui/core'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'

class indexGraphiques extends React.Component {


    render() {
        const list =
            <List>
                <ListItem key ={1}>
                    <Link key = {1} href={'/graphique'}>graphe test</Link>
                </ListItem>
            </List>

        return (
            <Container>
                <Typography component='h1' variant='h4'>Graphiques disponibles :</Typography>
                {list}
            </Container>

        )
    }
}

export default withRouter(indexGraphiques)
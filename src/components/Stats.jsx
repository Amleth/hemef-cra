import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import { hemefStyles, makePageTitle } from '../common/helpers'

const useStyles = makeStyles((theme) => ({
    ...hemefStyles(theme),
}))

function ListItemLink(props) {
    return <ListItem button component={Link} {...props} />;
}

function C() {
    const classes = useStyles()

    return <Container>
        {makePageTitle(`GRAPHIQUES DISPONIBLES`, classes.pageTitle)}
        <List>
            <ListItemLink to="/stats-age-entree-conservatoire">
                <ListItemText primary="Âges des élèves à leur entrée au Conservatoire" />
            </ListItemLink>
        </List>
        <br />
    </Container >
}

export default withRouter(C)
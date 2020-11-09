import { Box, Grid, Button, AppBar, Toolbar } from '@material-ui/core'
import { Home } from '@material-ui/icons'
import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import indexEleves from './components/Eleves'
import eleve from './components/Eleve'
import classeCursus from './components/ClasseCursus'
import indexClasses from './components/Classes'
import classe from './components/Classe'
import indexGraphes from './components/Graphiques'
import graph_sexe_discipline from './components/GraphSexeDiscipline'
import indexVilles from './components/Villes'
import ville from './components/Ville'
import prix from './components/Prix'
import home from './components/Home'

export default function App() {
  return (
    <Router basename='/hemef'>
      <AppBar position='static'>
        <Toolbar>
          <Grid container justify='center' direction='row' alignItems='center'>
            <Button
              edge='center'
              color='inherit'
              aria-label='home'
              component={Link}
              to='/'
              startIcon={<Home />}
            >
              Accueil
            </Button>
            <Button
              color='inherit'
              component={Link}
              to='/index_eleves'
              startIcon={<i className='fas fa-user'></i>}
            >
              Élèves
            </Button>
            <Button
              color='inherit'
              component={Link}
              to='/indexClasses'
              startIcon={<i className='fas fa-chalkboard-teacher'></i>}
            >
              Classes
            </Button>
            <Button
              color='inherit'
              component={Link}
              to='/prix'
              startIcon={<i className='fas fa-award'></i>}
            >
              Prix
            </Button>
            <Button
              color='inherit'
              component={Link}
              to='/indexVilles'
              startIcon={<i className='fas fa-city'></i>}
            >
              Villes
            </Button>
            <Button
              color='inherit'
              // component={Link}
              // to='/indexGraphes'
              startIcon={<i className='far fa-chart-bar'></i>}
            >
              Statistiques
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box m={2} />
      <div>
        <Switch>
          <Route exact path='/' children={home} />
          <Route path='/classe/:id' children={classe} />
          <Route path='/classe_cursus/:id' children={classeCursus} />
          <Route path='/index_eleves' children={indexEleves} />
          <Route path='/eleve/:id' children={eleve} />
          <Route path='/indexClasses' children={indexClasses} />
          <Route path='/indexVilles' children={indexVilles} />
          <Route path='/ville/:id' children={ville} />
          <Route path='/indexGraphes' children={indexGraphes} />
          <Route path='/graph_sexe_discipline' children={graph_sexe_discipline} />
          <Route path='/prix' children={prix} />
        </Switch>
      </div>
    </Router>
  )
}

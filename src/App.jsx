import { Box, Grid, Button, AppBar, Toolbar } from '@material-ui/core'
import { Home } from '@material-ui/icons'
import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Eleves from './components/Eleves'
import Eleve from './components/Eleve'
import ClasseCursus from './components/ClasseCursus'
import Classes from './components/Classes'
import Classe from './components/Classe'
// import indexGraphes from './components/Graphiques'
// import graph_sexe_discipline from './components/GraphSexeDiscipline'
import Villes from './components/Villes'
import Ville from './components/Ville'
import Prix from './components/Prix'
import Home_ from './components/Home'

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
              to='/eleves'
              startIcon={<i className='fas fa-user'></i>}
            >
              Élèves
            </Button>
            <Button
              color='inherit'
              component={Link}
              to='/classes'
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
              to='/villes'
              startIcon={<i className='fas fa-city'></i>}
            >
              Villes
            </Button>
            {/* <Button
              color='inherit'
              component={Link}
              to='/indexGraphes'
              startIcon={<i className='far fa-chart-bar'></i>}
            >
              Statistiques
            </Button> */}
          </Grid>
        </Toolbar>
      </AppBar>
      <Box m={2} />
      <div>
        <Switch>
          <Route exact path='/' children={Home_} />
          <Route path='/classe/:id' children={Classe} />
          <Route path='/classe_cursus/:id' children={ClasseCursus} />
          <Route path='/eleves' children={Eleves} />
          <Route path='/eleve/:id' children={Eleve} />
          <Route path='/classes' children={Classes} />
          <Route path='/villes' children={Villes} />
          <Route path='/ville/:id' children={Ville} />
          {/* <Route path='/indexGraphes' children={indexGraphes} /> */}
          {/* <Route path='/graph_sexe_discipline' children={graph_sexe_discipline} /> */}
          <Route path='/prix' children={Prix} />
        </Switch>
      </div>
    </Router>
  )
}

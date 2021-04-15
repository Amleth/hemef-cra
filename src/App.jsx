import { Box, Grid, Button, AppBar, Toolbar } from '@material-ui/core'
import { Home } from '@material-ui/icons'
import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Classe from './components/Classe'
import Classes from './components/Classes'
import Eleve from './components/Eleve'
import Eleves from './components/Eleves'
import Home_ from './components/Home'
import Prix from './components/Prix'
import Stats from './components/Stats'
import StatsPrixTable from './components/StatsPrixTable'
import StatsAgeEntreeConservatoire from './components/StatsAgeEntreeConservatoire'
import Villes from './components/Villes'

export default function App() {
  return (
    <Router basename="/hemef">
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Grid container justify="center" direction="row" alignItems="center">
            <Button edge="center" color="inherit" aria-label="home" component={Link} to="/" startIcon={<Home />}>
              Accueil
            </Button>
            <Button color="inherit" component={Link} to="/eleves" startIcon={<i className="fas fa-user"></i>}>
              Élèves
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/classes"
              startIcon={<i className="fas fa-chalkboard-teacher"></i>}
            >
              Classes
            </Button>
            <Button color="inherit" component={Link} to="/prix" startIcon={<i className="fas fa-award"></i>}>
              Prix
            </Button>
            <Button color="inherit" component={Link} to="/villes" startIcon={<i className="fas fa-city"></i>}>
              Villes
            </Button>
            <Button color="inherit" component={Link} to="/stats" startIcon={<i className="far fa-chart-bar"></i>}>
              Statistiques
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box m={2} />
      <div>
        <Switch>
          <Route exact path="/" children={Home_} />
          <Route path="/eleve/:id" children={Eleve} />
          <Route path="/eleves" children={Eleves} />
          <Route path="/classe/:id" children={Classe} />
          <Route path="/classes" children={Classes} />
          <Route path="/prix" children={Prix} />
          <Route path="/villes" children={Villes} />
          <Route path="/stats" children={Stats} />
          <Route path="/stats-prix" children={StatsPrixTable} />
          <Route path="/stats-age-entree-conservatoire" children={StatsAgeEntreeConservatoire} />
        </Switch>
      </div>
    </Router>
  )
}

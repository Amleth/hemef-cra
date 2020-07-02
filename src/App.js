import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'


// import indexElevesCursus from './components/eleveCursus'



import { Typography, Box, Grid, Container, Button, AppBar, Toolbar } from '@material-ui/core'
import { Home } from '@material-ui/icons';
import indexEleves from './components/indexEleves'
import eleve from './components/eleve'
import classeCursus from './components/classeCursus'
import indexClasses from './components/indexClasses'
import classe from './components/classe'
import indexGraphes from './components/indexGraphiques'
import graphique from './components/graphique'
import indexVilles from './components/indexVilles'
import ville from './components/ville'

//a adapter
export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Grid container justify="space-between" direction='row' alignItems="center" >
            <Grid item>
              <Button edge="start" color="inherit" aria-label="home" component={Link} to="/" startIcon={<Home />}>
                Home
          </Button>
            </Grid>

            <Grid item>
              <Box>
                <Button color='inherit' component={Link} to="/index_eleves" startIcon={<i className="fas fa-user"></i>}>Index Elèves</Button>
                <Button color='inherit' component={Link} to="/indexClasses" startIcon={<i className="fas fa-chalkboard-teacher"></i>}>Index Classes</Button>
                <Button color='inherit' component={Link} to="/indexVilles" startIcon={<i className="fas fa-city"></i>}>Index des Villes</Button>
                <Button color='inherit' component={Link} to="/indexGraphes" startIcon={<i className="far fa-chart-bar"></i>}>Index Graphiques</Button>
                

                {/* <Button color='inherit' component={Link} to="/performers" startIcon={<i className="far fa-user"></i>}>Disciplines</Button>

                <Button color='inherit' component={Link} to="/identified_works" startIcon={<i className="fas fa-music"></i>}>Villes</Button> */}
              </Box>
            </Grid>

            <Grid item>

            </Grid>

          </Grid>
        </Toolbar>
      </AppBar>
      <Box m={2} />
      <div>
        <Switch>
          <Route exact path='/'>
            <Container maxWidth="md">
              <Grid container justify="center">
                <Typography variant="h2" component="h1" align="center">
                  HEMEF
              </Typography>
              </Grid>
              <Box m={5} />
              <Grid container justify="space-between" direction='column'>
                <Grid container justify="space-between">
                  <Box width={1 / 2}>
                    <Button size='large' variant='contained' color='primary' fullWidth={true} component={Link} to="/index_eleves">Élèves</Button>
                  </Box>
                  <Box width={1 / 2}>
                    <Button size='large' variant='contained' color='primary' fullWidth={true} component={Link} to="/indexClasses">Classes</Button>
                  </Box>
                </Grid>

                <Grid container justify="space-between">
                  <Box width={1 / 2}>
                    <Button size='large' variant='contained' color='primary' fullWidth={true}>In Progress</Button>
                  </Box>
                  <Box width={1 / 2}>
                    <Button size='large' variant='contained' color='primary' fullWidth={true} >In Progress</Button>
                  </Box>
                </Grid>
              </Grid>
              <Box m={5} />

            </Container>

          </Route>
          {/*
          

          <Route path='/ville/:id' children={ville} />
          
          <Route path='/index_villes' children={indexVilles} /> */}
          <Route path='/classe/:id' children={classe} />
          <Route path='/classe_cursus/:id' children={classeCursus} />
          <Route path='/index_eleves' children={indexEleves} />
          <Route path='/eleve/:id' children={eleve} />
          <Route path='/indexClasses' children={indexClasses} />
          <Route path='/indexVilles' children={indexVilles}/>
          <Route path='/ville/:id ' children={ville}/>
          <Route path='/indexGraphes' children={indexGraphes}/>
          <Route path='/graphique' children={graphique}/>
        </Switch>
      </div>
    </Router>
  )
}

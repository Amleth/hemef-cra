import { Box } from '@material-ui/core'
import { Container } from '@material-ui/core'
import { Grid } from '@material-ui/core'
import { List } from '@material-ui/core'
import { ListItem } from '@material-ui/core'
import { ListItemText } from '@material-ui/core'
import { ListItemAvatar } from '@material-ui/core'
import { Avatar } from '@material-ui/core'
import { Typography } from '@material-ui/core'
import { Search as SearchIcon } from '@material-ui/icons'
import { ViewList as ViewListIcon } from '@material-ui/icons'
import { Group as GroupIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { DeveloperMode as DeveloperModeIcon } from '@material-ui/icons'
import React from 'react'
import { withRouter } from 'react-router'

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    flexGrow: 1
  },
  list: {
    margin: 0,
    padding: 0,
    '& li': {
      margin: 0,
      marginBottom: theme.spacing(2),
      padding: 0
    }
  }
}))

function Home() {
  const classes = useStyles()
  return (
    <Container maxWidth='md'>
      <Box pt={5} pb={10}>
        <Typography variant='h2' component='h1' align='center'>
          Histoire de l’enseignement de la musique en France au XIXe siècle
        </Typography>
      </Box>
      <Grid container className={classes.gridContainer} spacing={10}>
        <Grid item xs={7}>
          <Typography variant='body1' color='textSecondary' align='justify'>
            Cette base de données recense les élèves, musiciens ou comédiens, inscrits au
            Conservatoire national de Paris depuis sa fondation en 1795 jusqu’en 1914. Elle permet
            de suivre leur cursus au sein du Conservatoire et de croiser ces données avec celles qui
            concernent leur état civil, origine sociale, origine géographique, cursus antérieur et
            postérieur à celui du Conservatoire.
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <List className={classes.list}>
            <ListItem disableGutters={true}>
              <ListItemAvatar>
                <Avatar>
                  <SearchIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary='Responsables scientifiques'
                secondary='Marie DUCHÊNE-THÉGARID & Cécile REYNAUD'
              />
            </ListItem>

            <ListItem disableGutters={true}>
              <ListItemAvatar>
                <Avatar>
                  <DeveloperModeIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary='Modélisation sémantique & développement logiciel'
                secondary='Pierre LA ROCCA & Thomas BOTTINI'
              />
            </ListItem>

            <ListItem disableGutters={true}>
              <ListItemAvatar>
                <Avatar>
                  <GroupIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary='Contributeur•rice•s'
                secondary='Catherine MEROT,
Valérie BARBAT, 
Gabriela Elgarrista, 
Emmanuel HERVE, 
Yvette ISSELIN,
Françoise LAURENDEAU,
Audrey POTTIER,
Anastasiia SYREISCHIKOVA'
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Container>
  )
}

export default withRouter(Home)

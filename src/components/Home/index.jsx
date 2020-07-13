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
            Cette base de données rencense les informations d'élèves au Conservatoire de Paris de 1906 à 1910 puis de 1912 à 1914.
            Liés à ces élèves sont également présentes les classes suivies, les villes d'origines mais aussi les prix obtenus.
            Enfin, un receuil de graphiques permet l'étude statistique des données par leurs croisements selon différentes thématiques.
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
              <ListItemText primary='Responsables scientifiques' secondary='Marie THEGARID & Cécile REYNAUD' />
            </ListItem>
            {/* <ListItem disableGutters={true}>
              <ListItemAvatar>
                <Avatar>
                  <ViewListIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Prétraitement des données' secondary='Florence LE PRIOL' />
            </ListItem> */}
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
          </List>
        </Grid>
      </Grid>
    </Container>
  )
}

export default withRouter(Home)

import {
  CircularProgress,
  Grid,
  Container,
  TextField,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router'
import { formatDate, makeTextField, formStyle } from '../common/helpers'

const useStyles = makeStyles((theme) => ({
  ...formStyle(theme)
}))

function Classe({ history, match }) {
  const classes = useStyles();
  const id = match.params.id;
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://data-iremus.huma-num.fr/api/hemef/classe/' + id);
      const json = await res.json()
      setData(json)
    }
    fetchData();
  }, [id]);

  if (Object.entries(data).length === 0) {
    return (
      <Container maxWidth='md' align='center'>
        <CircularProgress />
      </Container>
    );
  } else {
    return (
      <Container>
        <Typography component='h1' variant='h3'>Classe</Typography>
        <div className={classes.form}>
          {makeTextField('Discipline', data.discipline_label)}
          {makeTextField("Professeur", data.professeur_label)}
        </div>
        <br />
        <MaterialTable
          title="Élèves"
          columns={[
            {
              title: "Nom",
              field: "élève_nom"
            },
            {
              title: "Prénom",
              field: "élève_prenom"
            },
            {
              title: "Cote AN Registre",
              field: "élève_cote_AN_registre"
            },
          ]}
          options={{
            pageSize: 5,
            pageSizeOptions: [5, 10, 20],
            cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
            headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
          }}
          data={data.élèves}
          onRowClick={((evt, selectedRow) => {
            const eleveId = selectedRow.élève.slice(-36)
            history.push('/eleve/' + eleveId)
          })}
        />
      </Container>
    )
  }
}






export default withRouter(Classe)
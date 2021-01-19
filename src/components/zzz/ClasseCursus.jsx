import {
  Button,
  CircularProgress,
  Container,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { formatDate, makeTextField, formStyle } from '../common/helpers'

const useStyles = makeStyles((theme) => ({
  // ...formStyle(theme)
}))

function ClasseCursus({ history, match }) {
  const id = match.params.id;
  const classes = useStyles();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://data-iremus.huma-num.fr/api/hemef/parcours_classe/' + id);
      const json = await res.json()
      setData(json)
    }
    fetchData();
  }, [id]);

  const observations = data.observations_élève
    ? data.observations_élève
      .trim()
      .split(';')
      .map((_) => _.trim())
      .filter((_) => _.length > 0)
      .join(' • ')
    : ''

  if (Object.entries(data).length === 0) {
    return (
      <Container maxWidth='md' align='center'>
        <CircularProgress />
      </Container>
    );
  } else {
    return <Container>
      {/* <Typography component='h1' variant='h3'>Parcours classe</Typography>
      <div className={classes.form}>
        {makeTextField('Élève', data.prénom + ' ' + data.nom)}
        {makeTextField('Dicsipline', data.discipline_label)}
        {makeTextField(`Date d'entrée`, formatDate(data['date_entrée'], data['hypothèse_date_entrée']))}
        {makeTextField(`Motif d'entrée`, data['motif_entrée'])}
        {makeTextField(`Date de sortie`, formatDate(data['date_sortie'], data['hypothèse_date_sortie']))}
        {makeTextField(`Motif de sortie`, data['motif_sortie'])}
        {makeTextField(`Observations`, observations, true)}
      </div>
      <br />
      {data.classe && <Button
        variant="outlined"
        color="primary"
        onClick={() => { history.push('/classe/' + data.classe.slice(-36)) }}
      >Accès à la classe</Button>}
      <br />
      <br />
      <MaterialTable
        title='Prix obtenus'
        data={data.prix}
        options={{
          pageSize: 5,
          pageSizeOptions: [5, 10, 20],
          cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
          headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
          search: false,
          sort: false,
          filter: false
        }}
        columns={[
          { title: "Intitulé", field: "prix_nom_label" },
          {
            title: "Date", field: "string",
            render: r => formatDate(r.prix_année, r.prix_hypothèse_année)
          },
          { title: "Discipline", field: "prix_discipline_label" },
          { title: "Complément", field: "prix_complément_nom_prix_label" }
        ]}
      /> */}
    </Container>
  }
}

export default withRouter(ClasseCursus)
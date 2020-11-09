import { CircularProgress, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { formatDate, makeTextField, formStyle } from '../common/helpers'

const useStyles = makeStyles((theme) => ({
  ...formStyle(theme)
}))

function Eleve({ history, match }) {
  const classes = useStyles();
  const id = match.params.id;
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://data-iremus.huma-num.fr/api/hemef/eleve/' + id);
      res.json().then((res) => {
        res.parcours = res.parcours.map((_) => ({
          ..._,
          date_entrée: formatDate(_['date_entrée'], _['hypothèse_date_entrée']),
          date_sortie: formatDate(_['date_sortie'], _['hypothèse_date_sortie']),
        }));
        setData({
          ...res,
          date_de_naissance: formatDate(res['date_de_naissance'], res['hypothèse_date_de_naissance']),
          cursus_date_entree_conservatoire: formatDate(res['cursus_date_entree_conservatoire'], res['hypothese_cursus_date_entree_conservatoire']),
          cursus_date_sortie_conservatoire: formatDate(res['cursus_date_sortie_conservatoire'], res['hypothese_cursus_date_sortie_conservatoire']),
        });
      });
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
        <Typography component='h1' variant='h3'>
          Élève
        </Typography>
        <div className={classes.form}>
          {makeTextField('Nom', data.nom)}
          {makeTextField('Prénom', data.prenom)}
          {makeTextField('Sexe', data.sexe)}
          {makeTextField('Date de naissance', data.date_de_naissance)}
          {makeTextField('Lieu de naissance', data.nait_a_label)}
          {data.pseudonyme && makeTextField('Pseudonyme', data.pseudonyme)}
        </div>
        <br />
        <br />
        <Typography component='h2' variant='h5'>
          Informations de cursus
        </Typography>
        <div className={classes.form}>
          {makeTextField('Cote AN Registre', data.cote_AN_registre)}
          {makeTextField("Date d'entrée au conservatoire ", data.cursus_date_entree_conservatoire)}
          {makeTextField("Motif d'entrée", data.cursus_motif_admission)}
          {makeTextField('Date de sortie du conservatoire', data.cursus_date_sortie_conservatoire)}
          {makeTextField('Motif de sortie du conservatoire', data.cursus_motif_sortie)}
        </div>
        <br />
        <br />
        <MaterialTable
          title='Classes suivies'
          columns={[
            { title: 'Discipline', field: 'discipline_enseignée_label' },
            { title: 'Professeur', field: 'professeur_label' },
            {
              title: "Date d'entrée",
              field: 'date_entrée',
            },
            {
              title: 'Date de sortie',
              field: 'date_sortie',
            },
          ]}
          options={{
            pageSize: 5,
            pageSizeOptions: [5, 10, 20],
            cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
            headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
          }}
          data={data.parcours}
          onRowClick={(evt, selectedRow) => {
            if (!selectedRow["date_entréé"] && !selectedRow["date_sortie"]) return
            const parcoursClasseID = selectedRow.parcours.slice(-36);
            history.push('/classe_cursus/' + parcoursClasseID);
          }}
        />
      </Container>
    );
  }
}

export default withRouter(Eleve);
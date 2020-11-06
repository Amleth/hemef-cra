import dayjs from 'dayjs';
import { CircularProgress, TextField, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   alignItems: 'flex-start',
  //   display: 'flex',
  // },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 0,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      marginLeft: 0,
      marginRight: theme.spacing(4),
    },
  },
}));

function Eleve({ history, match }) {
  const classes = useStyles();
  const id = match.params.id;

  const [eleve, setEleve] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://data-iremus.huma-num.fr/api/hemef/eleve/' + id);
      res.json().then((res) => {
        res.parcours = res.parcours.map((_) => ({
          ..._,
          date_entrée: formatDate(_['date_entrée'], _['hypothèse_date_entrée']),
          date_sortie: formatDate(_['date_sortie'], _['hypothèse_date_sortie']),
        }));
        setEleve({
          ...res,
          date_de_naissance: formatDate(res['date_de_naissance'], res['hypothèse_date_de_naissance']),
          cursus_date_entree_conservatoire: formatDate(res['cursus_date_entree_conservatoire'], res['hypothese_cursus_date_entree_conservatoire']),
          cursus_date_sortie_conservatoire: formatDate(res['cursus_date_sortie_conservatoire'], res['hypothese_cursus_date_sortie_conservatoire']),
        });
      });
    }
    fetchData();
  }, [id]);

  if (Object.entries(eleve).length === 0) {
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
          {makeTextField('Nom', eleve.nom)}
          {makeTextField('Prénom', eleve.prenom)}
          {makeTextField('Sexe', eleve.sexe)}
          {makeTextField('Date de naissance', eleve.date_de_naissance)}
          {makeTextField('Lieu de naissance', eleve.nait_a_label)}
          {eleve.pseudonyme && makeTextField('Pseudonyme', eleve.pseudonyme)}
        </div>
        <br />
        <br />
        <Typography component='h2' variant='h5'>
          Informations de cursus
        </Typography>
        <div className={classes.form}>
          {makeTextField('Cote AN Registre', eleve.cote_AN_registre)}
          {makeTextField("Date d'entrée au conservatoire ", eleve.cursus_date_entree_conservatoire)}
          {makeTextField("Motif d'entrée", eleve.cursus_motif_admission)}
          {makeTextField('Date de sortie du conservatoire', eleve.cursus_date_sortie_conservatoire)}
          {makeTextField('Motif de sortie du conservatoire', eleve.cursus_motif_sortie)}
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
          data={eleve.parcours}
          onRowClick={(evt, selectedRow) => {
            const parcoursClasseID = selectedRow.parcours.slice(-36);
            history.push('/classe_cursus/' + parcoursClasseID);
          }}
        />
      </Container>
    );
  }
}

function makeTextField(f, v) {
  return (
    <TextField
      label={f}
      defaultValue={v}
      fullWidth={false}
      InputProps={{
        readOnly: true,
      }}
    />
  );
}

// hemef:date_de_naissance
// hemef:hypothèse_date_de_naissance
// hemef:cursus_date_entree_conservatoire
// hemef:hypothese_cursus_date_entree_conservatoire
// hemef:cursus_date_sortie_conservatoire
// hemef:hypothese_cursus_date_sortie_conservatoire
// parcours — hemef:date_entree
// parcours — hemef:hypothèse_date_entrée
// parcours — hemef:date_sortie
// parcours — hemef:hypothèse_date_sortie
function formatDate(d, h) {
  d = d ? d.split('^^')[0] : '';
  h = h ? h.replace('[', '').replace(']', '') + ' (hypothèse)' : '';
  d = d ? dayjs(d).format('DD/MM/YYYY') : '';
  return d || h;
}

export default withRouter(Eleve);

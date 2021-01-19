import { CircularProgress, Container, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router'
import { makeTextField } from '../common/helpers'

const useStyles = makeStyles((theme) => ({
  // ...formStyle(theme)
}))

function Ville({ history, match }) {
  const classes = useStyles();
  const id = match.params.id;
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://data-iremus.huma-num.fr/api/hemef/ville/' + id);
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
        <Typography component='h1' variant='h3'>{data.ville_label}</Typography>
        <div className={classes.form}>
          {makeTextField('Pays', data['pays_label'])}
          {data['département_label'] && makeTextField('Département', data['département_label'])}
        </div>
        <br />
        <MaterialTable
          title='Ville de naissance de :'
          columns={[
            { title: 'Nom', field: 'élève_nom' },
            { title: 'Prénom', field: 'élève_prénom' },
            { title: 'Cote', field: 'élève_cote_AN_registre' },
            { title: 'Sexe', field: 'élève_sexe' },
            {
              title: 'pseudonyme', field: 'élève_pseudonyme', render: row => {
                if (row.élève_pseudonyme)
                  return row.élève_pseudonyme;
                else return ('')
              }
            }
          ]}
          options={{
            pageSize: 10,
            pageSizeOptions: [5, 10, 20],
            cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
            headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
          }}
          data={data.élèves}
          onRowClick={((evt, selectedRow) => {
            const id = selectedRow.élève.slice(-36)
            history.push('/eleve/' + id)
          })} />
      </Container>
    )
  }
}

export default withRouter(Ville)
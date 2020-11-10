import { CircularProgress, Container } from '@material-ui/core'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router'

function Eleves({ history, match }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://data-iremus.huma-num.fr/api/hemef/eleves');
      const json = await res.json()
      setData(json)
    }
    fetchData();
  }, []);

  if (Object.entries(data).length === 0) {
    return (
      <Container maxWidth='md' align='center'>
        <CircularProgress />
      </Container>
    );
  } else {
    return <Container>
      <MaterialTable
        title='Élèves du conservatoire'
        columns={[
          { title: 'Nom', field: 'nom', defaultSort: 'asc' },
          { title: 'Prénom', field: 'prénom' },
          { title: 'Cote AN du registre', field: 'cote_AN_registre' }
        ]}
        options={{
          pageSize: 20,
          pageSizeOptions: [10, 20, 50],
          filtering: true,
          sorting: true,
          cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
          headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
        }}
        data={data}
        onRowClick={((evt, selectedRow) => {
          const eleveId = selectedRow.élève.slice(-36)
          history.push('/eleve/' + eleveId)
        })}
      />
    </Container>
  }
}

export default withRouter(Eleves)

import { CircularProgress, Container } from '@material-ui/core'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router'

function Villes({ history, match }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://data-iremus.huma-num.fr/api/hemef/villes');
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
        title='Villes'
        columns={[
          { title: 'Nom', field: 'ville_label' },
          { title: 'Département', field: 'département_label' },
        ]}
        options={{
          pageSize: 20,
          pageSizeOptions: [10, 20, 50],
          cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
          headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
        }}
        data={data}
        onRowClick={((evt, selectedRow) => {
          const id = selectedRow.ville.slice(-36)
          history.push('/ville/' + id)
        })}
      />
    </Container>
  }
}

export default withRouter(Villes)


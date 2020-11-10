import { CircularProgress, Container } from '@material-ui/core'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router'

function Classes({ history, match }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://data-iremus.huma-num.fr/api/hemef/classes');
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
        title='Classes'
        columns={[
          { title: 'Discipline', field: 'discipline_label' },
          {
            title: "Professeur", field: 'professeur_label'
          },
          // Si un tri sur le nombre d'élèves est souhaité, rejouté dans la colonne dédiée au Nombre d'élèves la commande field : 'parcours_classe_count',
          {
            title: "Nombre d'élèves",
            render: row => {
              let count = row.parcours_classe_count.split("^^")[0]
              return count
            }

          }
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
          const classeId = selectedRow.classe.slice(-36)
          history.push('/classe/' + classeId)
        })}
      />
    </Container>
  }
}

export default withRouter(Classes)
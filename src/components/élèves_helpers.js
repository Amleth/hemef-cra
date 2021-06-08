import { makeNom, makePrénom } from '../common/helpers'

export const élèvesColumns = prefix => [{
    customFilterAndSearch: (term, rowData) =>
        makeNom(rowData, prefix).toLowerCase().indexOf(term.toLowerCase()) !== -1,
    defaultSort: 'asc',
    field: prefix + `nom.value`,
    render: r => makeNom(r, prefix),
    title: `Nom`,
},
{
    customFilterAndSearch: (term, rowData) =>
        makePrénom(rowData, prefix).toLowerCase().indexOf(term.toLowerCase()) !== -1,
    field: prefix + `prénom`,
    render: r => makePrénom(r, prefix),
    sorting: false,
    title: `Prénom`,
},
{
    field: prefix + `pseudonyme.value`,
    sorting: true,
    title: `Pseudonyme`,
},
{
    field: prefix + `sexe.value`,
    sorting: true,
    title: `Sexe`,
},
{
    field: prefix + `cote_AN_registre.value`,
    title: `Cote AN du registre`,
},
{
    title: `Date d'entrée au conservatoire`,
    field: prefix + `date_entrée_conservatoire_datetime.value`,
    render: rowData =>
        rowData[prefix + 'date_entrée_conservatoire_datetime']
            ? new Date(rowData[prefix + 'date_entrée_conservatoire_datetime'].value).toLocaleDateString()
            : null,
},]
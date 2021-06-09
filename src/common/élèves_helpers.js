import { TDC_SEP } from './helpers'

export function processÉlèvesList(triples) {
    for (const t of triples) {
        if (t.nom.value.toLowerCase().slice(0, 6) === 'de la ') {
            t.nom.value = t.nom.value.slice(6) + ', ' + t.nom.value.slice(0, 6).trim()
        }
        else if (t.nom.value.toLowerCase().slice(0, 3) === 'de ') {
            t.nom.value = t.nom.value.slice(3) + ', ' + t.nom.value.slice(0, 3).trim()
        }
        else if (t.nom.value.toLowerCase().slice(0, 2) === 'd\'') {
            t.nom.value = t.nom.value.slice(2) + ', ' + t.nom.value.slice(0, 2).trim()
        }
    }

    return triples
}

export function makePseudonyme(t, prefix = '') {
    const _pseudonyme = t[prefix + 'pseudonyme'] && t[prefix + 'pseudonyme'].value
    const _pseudonyme_TDC = t[prefix + 'pseudonyme_TDC'] && t[prefix + 'pseudonyme_TDC'].value
    let pseudonyme = new Set()
    _pseudonyme && pseudonyme.add(_pseudonyme)
    _pseudonyme_TDC && pseudonyme.add(_pseudonyme_TDC + ' [TDC]')
    pseudonyme = Array.from(pseudonyme).join(TDC_SEP)
    return pseudonyme || ''
}

export function makeNom(élève, predicates_prefix = '') {
    const parts = []

    const nom = (élève[predicates_prefix + 'nom'] && élève[predicates_prefix + 'nom'].value) || ''
    // const nom_TDC = élève[predicates_prefix + 'nom_TDC'] && élève[predicates_prefix + 'nom_TDC'].value || ''
    const nom_complément = (élève[predicates_prefix + 'nom_complément'] && élève[predicates_prefix + 'nom_complément'].value) || ''
    const nom_épouse = (élève[predicates_prefix + 'nom_épouse'] && élève[predicates_prefix + 'nom_épouse'].value) || ''
    const nom_épouse_TDC = (élève[predicates_prefix + 'nom_épouse_TDC'] && élève[predicates_prefix + 'nom_épouse_TDC'].value) || ''

    if (nom_complément) parts.push(élève[predicates_prefix + 'nom_complément'].value)
    if (nom_épouse) parts.push(`ép. ${nom_épouse}`)
    if (nom_épouse_TDC && nom_épouse_TDC !== nom_épouse) parts.push(`ép. ${nom_épouse_TDC} [TDC]`)

    return parts.length > 0
        ? nom + `, ${parts.join(', ')}`
        : nom
}

export function makePrénom(élève, predicates_prefix = '') {
    const parts = []

    const prénom_1 = (élève[predicates_prefix + 'prénom_1'] && élève[predicates_prefix + 'prénom_1'].value) || ''
    const prénom_2 = (élève[predicates_prefix + 'prénom_2'] && élève[predicates_prefix + 'prénom_2'].value) || ''
    const prénom_2_TDC = (élève[predicates_prefix + 'prénom_2_TDC'] && élève[predicates_prefix + 'prénom_2_TDC'].value) || ''
    const prénom_complément = (élève[predicates_prefix + 'prénom_complément'] && élève[predicates_prefix + 'prénom_complément'].value) || ''
    const prénom_complément_TDC = (élève[predicates_prefix + 'prénom_complément_TDC'] && élève[predicates_prefix + 'prénom_complément_TDC'].value) || ''

    if (prénom_1) parts.push(prénom_1)
    if (prénom_2) parts.push(prénom_2)
    if (prénom_2_TDC && prénom_2_TDC !== prénom_2) parts.push(prénom_2_TDC + ' [TDC]')
    if (prénom_complément) parts.push(prénom_complément)
    if (prénom_complément_TDC && prénom_complément_TDC !== prénom_complément) parts.push(prénom_complément_TDC + ' [TDC]')
    const res = parts.join(', ')
    return res
}

export const élèvesColumns = prefix => [
    {
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
        render: r => makePrénom(r, prefix),
        sorting: false,
        title: `Prénom`,
    },
    {
        customFilterAndSearch: (term, rowData) =>
            makePseudonyme(rowData, prefix).toLowerCase().indexOf(term.toLowerCase()) !== -1,
        render: r => makePseudonyme(r, prefix),
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
    }
]
import dayjs from 'dayjs'
import { Button, CircularProgress, Container, Paper, TextField, Typography } from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import React from 'react'
import { Link } from 'react-router-dom'

export const TDC_SEP = ' ⬢ '
export const MULTIVALUE_SEP = ' ⬢ '

export const hemefStyles = theme => ({
  root: {
    marginBottom: `${theme.spacing(4)}px`,
  },
  pageTitle: {
    letterSpacing: '7px',
    margin: `${theme.spacing(4)}px 0`,
  },
  pageSectionTitle: {
    letterSpacing: '5px',
    margin: `${theme.spacing(4)}px 0`,
  },
  table: {
    '& thead': {
      backgroundColor: '#F9F9F9'
    },
    '& tr:last-child td': {
      borderBottom: 'none' // Parce qu'on imbrique les tableaux dans des conteneurs bordés
    }
  },
  fieldCell: {
    color: 'gray',
    width: '30%',
    whiteSpace: 'nowrap'
  },
  valueCell: {
    width: '35%',
  },
  inlineButtonLink: {
    fontSize: '0.875rem',
    textTransform: 'none',
    padding: '0.25em 0.5em 0.25em 0.5em'
  }
})

export function makeLink(label, path, page, buttonClassName) {
  return <Link
    key={label + path + page}
    style={{ textDecoration: 'none' }}
    to={path + '/' + encodeURIComponent(page)}
  >
    <Button
      className={buttonClassName}
      color='primary'
      variant='contained'
    >
      {label}
    </Button>
  </Link>
}

export function makeTextField(f, v, fw = false) {
  if (!v) v = '—'
  return (
    <TextField
      label={f}
      defaultValue={v}
      fullWidth={true}
      InputProps={{
        readOnly: true,
      }}
    />
  );
}

export function makePageTitle(title, className) {
  return <Typography component="h1" variant="h4" className={className} align='center' style={{ margin: '2em' }}>
    {title}
  </Typography >
}

export function makeSectionTitle(title, className) {
  return <Typography component="h2" variant="h5" className={className}>
    {title}
  </Typography>
}

export function makeProgress() {
  return <Container maxWidth='md' align='center'>
    <CircularProgress />
  </Container>
}

const BOTH_VALUE_EQUAL = '⬡'

export function formatDate(triples, k) {
  let v_dt = triples[k + "_datetime"]
  let v_y = triples[k + "_année"] || '?'
  let v_m = triples[k + "_mois"] || '?'
  let v_d = triples[k + "_jour"] || '?'
  const h = triples[k + "_hypothèse"]
  // const s = triples[k + "_saisie"]

  let value = null
  if (v_dt) value = dayjs(v_dt).format('D/M/YYYY') + (h ? ' (hypothèse)' : '')
  else if (v_y === '?' && v_m === '?' && v_d === '?') value = null
  else value = v_d + '/' + v_m + '/' + v_y + (h ? ' (hypothèse)' : '')

  let v_dt_tdc = triples[k + "_datetime_TDC"]
  let v_y_tdc = triples[k + "_année_TDC"] || '?'
  let v_m_tdc = triples[k + "_mois_TDC"] || '?'
  let v_d_tdc = triples[k + "_jour_TDC"] || '?'
  const h_tdc = triples[k + "_hypothèse_TDC"]
  // const s_tdc = triples[k + "_saisie_TDC"]

  let tdc_value = null
  if (v_dt_tdc) tdc_value = dayjs(v_dt_tdc).format('D/M/YYYY')
  else if (v_y_tdc === '?' && v_m_tdc === '?' && v_d_tdc === '?') tdc_value = null
  else tdc_value = TDC_SEP + v_d_tdc + '/' + v_m_tdc + '/' + v_y_tdc + (h_tdc ? ' (hypothèse) ' : '')

  if (value === tdc_value)
    return [value, BOTH_VALUE_EQUAL]
  else
    return [value, tdc_value]
}

export function formatValue(triples, k) {
  let value = triples[k]

  let tdc_value = null
  if (triples[k + "_TDC"])
    tdc_value = triples[k + "_TDC"]

  if (value === tdc_value)
    return [value, BOTH_VALUE_EQUAL]
  else
    return [value, tdc_value]
}

export function f(v) {
  return v ? v : ''
}

export const COLOR_F = '#20B2AA'
export const COLOR_M = '#FF7F50'

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

export function makeTable(title, data, styleClasses, paper = true) {
  const t = _makeTable(
    [[title, 'Registres', 'Tableaux des classes']],
    data,
    styleClasses,
  )
  return paper
    ? <Paper variant="outlined" square>{t}</Paper>
    : t
}

export function _makeTable(headRows, bodyRows, styleClasses) {
  const t = <TableContainer>
    <Table size='small' className={styleClasses.table}>
      <TableHead>
        {headRows.map((row, i) => <TableRow key={i}>
          {row.map((cell, i) => <TableCell key={i}>{cell}</TableCell>)}
        </TableRow>)}
      </TableHead>
      <TableBody>
        {bodyRows.map((row, i) => <TableRow key={i}>
          {row.map((cell, i) => <TableCell key={i} className={styleClasses.valueCell}>{cell}</TableCell>)}
        </TableRow>)}
      </TableBody>
    </Table>
  </TableContainer>
  return t
}

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
    // Gestion du pseudonyme
    const _pseudonyme = t.pseudonyme && t.pseudonyme.value
    const _pseudonyme_TDC = t.pseudonyme_TDC && t.pseudonyme_TDC.value
    let pseudonyme = new Set()
    _pseudonyme && pseudonyme.add(_pseudonyme)
    _pseudonyme_TDC && pseudonyme.add(_pseudonyme_TDC + ' [TDC]')
    pseudonyme = Array.from(pseudonyme).join(TDC_SEP)
    pseudonyme && (t.pseudonyme = pseudonyme)
  }

  return triples
}

export function range(from, to) {
  const res = []
  for (let i = from; i <= to; i++) res.push(i)
  return res
}
import React from 'react';
import { withRouter } from 'react-router'

function DisciplineClasse(props) {
    return <h1>Bonjour, {props.name}</h1>;
}

export default withRouter(DisciplineClasse)
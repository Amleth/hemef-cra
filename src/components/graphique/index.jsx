import React, { PureComponent } from 'react';
import { withRouter } from 'react-router'
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { Typography, Container } from '@material-ui/core'

const data = [
    {
        discipline: 'Piano', H: 4000, F: 2400, 
    },
    {
        discipline: 'Flûte', H: 3000, F: 1398, 
    },
    {
        discipline: 'Clavicorde', H: 2000, F: 9800, 
    },
    {
        discipline: 'Guitare Electrique', H: 2780, F: 3908, 
    },
];

class graphique extends PureComponent {

    render() {
        return (
            <Container>
                <Typography component='h1' variant='h4'>Graphe test</Typography>
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 20, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="discipline" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="H" stackId="a" fill="#e933ff" />
                    <Bar dataKey="F" stackId="a" fill="#15c2b0" />
                </BarChart>
            </Container>

        );
    }
}

export default withRouter(graphique)
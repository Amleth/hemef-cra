import React, { Component } from 'react';
import { withRouter } from 'react-router'
import axios from 'axios'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Typography, Container, Button, Grid, CircularProgress } from '@material-ui/core'

class graph_sexe_discipline extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: null,
        }
    }

    componentDidMount() {
        axios.get('http://data-iremus.huma-num.fr/api/hemef/stats/sexe_discipline').then(res => {
            const puredata = res.data
            let newdata = []
            for (const [key, value] of Object.entries(puredata)) {
                let tempObj = {}
                tempObj.discipline = key
                tempObj.Homme = value["hommes"]
                tempObj.Femme = value["femmes"]
                tempObj.total = Number(value.hommes) + Number(value.femmes)
                newdata.push(tempObj)
            }
            newdata.sort(compareInscrits)
            this.setState({ data: newdata })
        }
        )
    }

    render() {
        if (!this.state.data) {
            return (<Container maxWidth='md' align='center'>
            <CircularProgress />
          </Container>)
        }
        else {
            // let data = this.state.data

            const CustomTooltip = ({ active, payload, label }) => {
                if (active) {
                    return (
                        <div className="custom-tooltip">
                            <p className="label">{`${label} : ${payload[0].payload.total}`} inscrit.e.s</p>
                            <p className="hommes">Hommes :  {payload[0].payload.Homme} </p>
                            <p className="hommes">Femmes :  {payload[0].payload.Femme} </p>
                        </div>
                    );
                }
                return null;
            }

            return (
                <Container>
                    <Typography component='h1' variant='h4'>Répartition sexuée des disciplines</Typography>
                    <Grid
                        container
                        direction="row"
                        justify="space-around"
                        alignItems="center"
                    >
                        <Button variant="outlined" color="primary" onClick={() => {
                            this.setState({ data: this.state.data.sort(compareName) });
                        }}>
                            Tri par nom
                    </Button>
                        <Button variant="outlined" color="primary" onClick={() => {
                            this.setState({ data: this.state.data.sort(compareInscrits) });
                        }}>
                            Tri par nombre d'élèves
                    </Button>
                    </Grid>

                    <ResponsiveContainer width="110%" height={1000}>
                        <BarChart
                            data={this.state.data}
                            margin={{
                                top: 5, right: 5, left: 5, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="discipline" height={190} angle={-60} textAnchor="end" interval={0} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="Homme" stackId="a" fill="#34c3eb" />
                            <Bar dataKey="Femme" stackId="a" fill="#eba234" />
                        </BarChart>
                    </ResponsiveContainer>
                </Container>
            );
        }
    }
}

export default withRouter(graph_sexe_discipline)

function compareName(a, b) {
    // Use toUpperCase() to ignore character casing
    const discA = a.discipline.toUpperCase();
    const discB = b.discipline.toUpperCase();

    let comparison = 0;
    if (discA > discB) {
        comparison = 1;
    } else if (discA < discB) {
        comparison = -1;
    }
    return comparison;
}

function compareInscrits(a, b) {
    // Use toUpperCase() to ignore character casing
    const discA = Number(a.total);
    const discB = Number(b.total);

    let comparison = 0;
    if (discA > discB) {
        comparison = 1;
    } else if (discA < discB) {
        comparison = -1;
    }
    return comparison;
}

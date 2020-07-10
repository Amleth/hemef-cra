import React, { PureComponent } from 'react';
import { withRouter } from 'react-router'
import axios from 'axios'
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { Typography, Container } from '@material-ui/core'

class graph_sexe_discipline extends PureComponent {

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
            // console.log(puredata)
            for (const [key, value] of Object.entries(puredata)) {
                // console.log(key)
                let tempObj = {}
                tempObj.discipline = key
                tempObj.Homme = value["hommes"]
                tempObj.Femme = value["femmes"]
                tempObj.total = Number(value.hommes) + Number(value.femmes)
                newdata.push(tempObj)
            }
            console.log(newdata)
            newdata.sort(compareInscrits)
            this.setState({ data: newdata })
        }
        )
    }

    render() {
        if (!this.state.data) {
          return <div>Données en cours de téléchargement...</div>
        }
        else {
            const data = this.state.data

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
                    <BarChart
                        width={1250}
                        height={700}
                        data={data}
                        margin={{
                            top: 20, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="discipline" height={160} angle={-45} textAnchor="end" interval={0} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="Homme" stackId="a" fill="#34c3eb" />
                        <Bar dataKey="Femme" stackId="a" fill="#eba234" />
                    </BarChart>
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

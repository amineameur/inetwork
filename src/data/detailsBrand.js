import fire from "../firebase";
import firebase from "firebase";
import {React, Component} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import {withRouter} from 'react-router';
import ReactTable from 'react-table'
import {count, unique} from "react-table/src/aggregations";
import Moment from 'moment';
import {Line} from 'react-chartjs-2';

class DetailsBrand extends Component {

    id = this.props.match.params.id;

    state = {
        brand: {},
        brandDetails: [],
        data: [],
        influencers: []
    };


    componentDidMount() {
        this.getdata(this.id)
    }


    getdata(id) {

        let salesnumber = 0;
        let amountnumber = 0;
        let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let brand;
        let influencers = [];
        let dataTable = [];
        let purchases = [];

        fire.database().ref("brands").orderByChild("offerId")
            .equalTo(parseInt(id))
            .on("value", snapshot => {
                brand = {};
                snapshot.forEach(snap_3 => {
                    brand = snap_3.val();
                })
                this.setState({
                    brand: brand
                })
            });

        fire.database().ref("conversions/purchase")
            .orderByChild("offerId")
            .equalTo(parseInt(id))
            .on("value", snapshot => {

                snapshot.forEach(snap => {
                    let pur = snap.val();
                    fire.database().ref("Influencers/" + snap.val()["influencer"])
                        .orderByChild("name")
                        .on("value", snapshot_1 => {
                            snapshot_1.forEach(snap_2 => {
                                pur['inf'] = snap_2.val();
                            });
                            purchases.push(pur);
                        });


                });

                purchases.forEach(element => {
                    salesnumber += parseFloat(element['goal']);
                    amountnumber += parseFloat(element['amount']);
                    influencers.push(element.inf);
                    data.map(function (value, index) {
                        if (parseInt(Moment(element['createdAt'] * 1000).format('MM')) === index) {
                            data[index] += element['amount'];
                        }
                        return data;
                    })

                });
                this.setState(
                    {
                        data: data
                    }
                );
                console.log(purchases)

                if (influencers.length > 0 && influencers[0] !== undefined) {
                    console.log(influencers)
                    influencers = [...new Map(influencers.map(item =>
                        [item['name'], item])).values()];

                    influencers.forEach(element => {

                        dataTable.push({
                            influencer: element, goal: purchases.reduce(function (sum, obj) {
                                if (element.name === obj.inf['name']) {
                                    return parseFloat(sum) + parseFloat(obj.goal);
                                }
                                return parseFloat(sum);
                            }, 0), com: purchases.reduce(function (sum, obj) {
                                if (element.name === obj.inf['name']) {
                                    return parseFloat(sum) + parseFloat(obj.commission);
                                }
                                return parseFloat(sum);
                            }, 0)
                        });
                    });


                    this.setState(
                        {
                            brandDetails: dataTable,
                            influencers: influencers
                        }
                    );

                }
            });

        console.log(this.state)


    }

    render() {
        const linedata = {
            labels: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'sep', 'septembre', 'octobre', 'novembre', 'décembre'],
            datasets: [
                {
                    label: 'sales',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.data,
                }
            ]
        };

        const lineOptions = {
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,

                    },
                }],
                yAxes: [{
                    // stacked: true,
                    gridLines: {
                        display: false,
                        ticks: {
                            min: 0
                        }
                    },
                    ticks: {
                        beginAtZero: true,
                        // Return an empty string to draw the tick line but hide the tick label
                        // Return `null` or `undefined` to hide the tick line entirely
                        userCallback(value) {
                            // Convert the number to a string and splite the string every 3 charaters from the end
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);

                            // Convert the array to a string and format the output
                            value = value.join('.');
                            return `${value}.‎€`;
                        },
                    },
                }],
            },
            legend: {
                display: false,
            },
            tooltips: {
                enabled: true,
            },
        };


        const styles = {
            fontFamily: 'sans-serif',
            textAlign: 'center',
        };
        return (
            <div className={"container"}>
                <div className={"row pt-5"}>
                    <div className={"col-md-4"}>
                        <div className={"card"}>
                            <img className={"img-circle d-block mx-auto my-2"} src={this.state.brand['pic']} width={200}
                                 height={200}/>
                            <h1 className={"row justify-content-center"}>{this.state.brand['name']}</h1>
                        </div>
                    </div>
                    <div className={"col-md-4"}>
                        <div className={"card"}>
                            <div className={"d-block mx-auto my-2"}>
                                <h4 className={"row justify-content-center"}> sales number</h4>
                                <strong className={"row justify-content-center"}>{this.salesnumber}</strong>
                                <h4 className={"row justify-content-center"}>sales amount </h4>
                                <strong className={"row justify-content-center"}>{this.amountnumber}</strong>
                            </div>

                        </div>
                    </div>
                    <div className={"col-md-4"}>
                        <div style={styles}>
                            <Line data={linedata} options={lineOptions}/>
                        </div>
                    </div>
                </div>

                <div className={"row pt-5"}>
                    <div className={"col-md-12"}>
                        <div className={"card"}>

                            <table className={"table responsive"}>
                                <thead>
                                <tr key={"header"}>
                                    <th>Influencers</th>
                                    <th>Sales Number</th>
                                    <th>Commissions amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.brandDetails.map((p, i) => (
                                    <tr key={i}>
                                        <td key={p.influencer.name}>
                                            <div className={"col-md-12"}>
                                                <div className={"col-md-3"}>
                                                    <img className={"img-circle"} src={p.influencer.banner} width={100}
                                                         height={100}/>

                                                </div>
                                                <div className={"col-md-9"}>
                                                    <strong>{p.influencer.name}</strong>
                                                    <p>{p.influencer.mail}</p>
                                                </div>
                                            </div>

                                        </td>
                                        <td key={p.goal}>{p.goal}</td>
                                        <td key={p.com}>{p.com} ‎€</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(DetailsBrand);

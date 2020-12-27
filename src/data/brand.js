import React, {Component} from "react";
import fire from "../firebase";

class Brand extends Component {

    state = {
        Brands: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            Brands: []
        }
    }

    componentDidMount() {
        this.getBrandList();
    }

    getBrandList() {
        let Allbrands = [];
        fire.database().ref("brands")
            .on("value", snapshot => {
                snapshot.forEach(snap => {
                    Allbrands.push(snap.val());
                });
                this.setState({
                    Brands: Allbrands
                })
            });
    }


    render() {

        return (<div>
            <h2>Brand list</h2>
            <div className={"container"}>
                <div className={"row pt-5"}>
                    {this.state.Brands.map((b, i) => (
                        <div className={"col-md-3 pt-2"}>
                            <div key={i} className={"card justify-content-center"}>
                                <div className={"card-header justify-content-center"}>
                                    {b.name}
                                </div>
                                <div className={"card-body justify-content-center"}>
                                    <img src={b.pic} className={"img-rounded"} width={200} height={200}/>
                                </div>
                                <div className={"card-footer"}>
                                    <a href={"/brand/" + b.offerId}>sales</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>);
    }
}

export default Brand;

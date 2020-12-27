import React, {Component, Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import DetailsBrand from "./data/detailsBrand";
import brand from "./data/brand";
import Home from "./data/home";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchase: []
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <Router>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand href="/">Influens Network
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href={"#"}>Test Technique Amine Ameur</Nav.Link>

                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/brand' component={brand} />
                    <Route path="/brand/:id" render={({match}) => (
                        <DetailsBrand
                            id={match.params.id}
                        />
                    )}/>
                </Switch>
            </Router>
        );
    }


}

export default App;

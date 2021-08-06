import logo from './piggybank.png';
import './App.css';
import { Component } from 'react';
import Web3 from 'web3'
import Countdown from 'react-countdown';
import {InputGroup, Button, FormControl, Container, Row, Col, Dropdown, DropdownButton, Tooltip, OverlayTrigger, Alert} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

class Main extends Component{
    constructor(props) {
        super(props)
        this.state = {
            input: '',
            time: '60'
        }
    }

    handleSelect = (e) => {
        this.setState({time: e})
    }
    render(){

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Time left to unlock the withdrawal.
        </Tooltip>
      );

    function Time(props){
        const dateIsSet = props.date;
        if(dateIsSet){
            return(
                <div>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                  >
                      {/*  */}
                      <Alert>
                      <Countdown date={props.date} />
                      </Alert>
                  </OverlayTrigger>
                </div>
            )
        }
        if(!dateIsSet){
            return(<div><Alert></Alert></div>)
        }
    }
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Blockchain Piggybank</h1>
          <h5><small className="text-muted">{this.props.version} (alpha)</small></h5>
          <h3 className="divider">Your savings: {Web3.utils.fromWei(this.props.piggybankBalance, 'ether')} BNB</h3>
          <small>Tokens balance: {Web3.utils.fromWei(this.props.pigBalance, 'ether')} PIG</small>
          <Time date={this.props.date} />
          <h3>Deposit & Withdraw</h3>
          <Container>
            <Row>
            <Col></Col>
            <Col>
            <InputGroup>
            <FormControl
              placeholder={this.props.ethBalanceReduced}
              aria-label="Input value"
              onChange={(event) => {
                const etherAmount = event.target.value;
                this.setState({input: etherAmount})
              }}
            />
            <InputGroup.Text>BNB</InputGroup.Text>
            <DropdownButton
            variant="secondary"
            title="Time"
            id="input-group-dropdown-1"
            onSelect={this.handleSelect}
            >
            <Dropdown.Item eventKey="60">1 minute</Dropdown.Item>
            <Dropdown.Item eventKey="300">5 minutes</Dropdown.Item>
            <Dropdown.Item eventKey="3600">1 hour</Dropdown.Item>
            <Dropdown.Item eventKey="86400">1 day</Dropdown.Item>
            </DropdownButton>
            <Button variant="success" onClick={(event) => this.props.saveFunds(this.state.input, this.state.time)}>
              Save
            </Button>
            <Button variant="danger" onClick={(event) => this.props.withdrawFunds()}>
              Withdraw
            </Button>
            </InputGroup>
            </Col>
            <Col></Col>
            </Row>
            <Row>
              <Col></Col>
              <Col>
              <Button variant="warning" onClick={(event) => this.props.withdrawTokens()}>
              Tokens!
            </Button>
              </Col>
              <Col></Col>
            </Row>
            </Container>

            
        </header>
      </div>
    );
  }
}



export default Main;

import { Component } from 'react';
import Piggybank from './abis/Piggybank.json'
import Token from './abis/Token.json'
import Web3 from 'web3'
import Main from './Main'
import {Spinner} from 'react-bootstrap'
import './App.css';

class App extends Component{

  async componentDidMount() {
    await this.loadWeb3()
    if(!this.state.noWallet){
      await this.loadBlockchainData()
      this.setState({loading: false})
    }
  }

  async loadWeb3() {
    if(window.etherum) {
      window.web3 = new Web3(window.etherum)
      await window.etherum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-blockchain browser detected. Try Metamask!')
      this.setState({noWallet: true});
    }
  }

  fromJager(amount) {
    return amount / 1000000000000000000;
  }

  toJager(amount) {
    return amount * 1000000000000000000; 
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.requestAccounts()
    
    this.setState({ account: accounts[0]})

    //console.log(accounts[0])

    //const ethBalance = await web3.eth.getBalance(this.state.account)

    const bnbBalance = await web3.eth.getBalance(this.state.account)

    const bnbBalanceInBnb = await this.fromJager(bnbBalance)

    //const bnbBalanceReduced = bnbBalanceInBnb.substring(0, bnbBalanceInBnb.length - 10)

    //const ethBalanceInEth = await Web3.utils.fromWei(ethBalance)

    //const ethBalanceReduced = ethBalanceInEth.substring(0, ethBalanceInEth.length - 10)

    //console.log(ethBalance/1000000000000000000);

    this.setState({ ethBalance: bnbBalance })
    this.setState({ ethBalanceReduced: bnbBalanceInBnb })

    const networkId = await web3.eth.net.getId()

    // Load token contract
    const tokenData = Token.networks[networkId]
    if(tokenData){
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({token})

      let balance = await token.methods.balanceOf(this.state.account).call()
      //console.log(balance)
      this.setState({pigBalance: balance})
    }
    else {
      window.alert('Token contract not deployed to detected network. Use BinanceSmartchainTestnet instead!')
    }

    //Load piggybank contract
    
    const piggybankData = Piggybank.networks[networkId]
    if(piggybankData) {
      const piggybank = new web3.eth.Contract(Piggybank.abi, piggybankData.address)
      this.setState({ piggybank })
      let piggybankAccount = await piggybank.methods.showData().call({from: this.state.account});
            

      this.setState({ piggybankBalance: piggybankAccount[0] })
  

      if(piggybankAccount[1] !== '0'){
        var date = new Date(Number(piggybankAccount[1]) * 1000)
        this.setState({date: piggybankAccount[1] * 1000})
        this.setState({ dateString: date.toString() })
      }     
    }
    else {
      window.alert('Token contract not deployed to detected network. Use BinanceSmartchainTestnet instead!')
    }

  }

  saveFunds = (input, time) => {
    this.setState.loading = true;
    this.state.piggybank.methods.payment(time).send({value: Web3.utils.toWei(input, 'ether'), from: this.state.account})
    .on('receipt', function(hash){
      window.location.reload();
    })
    .catch((err) => {
      console.log(err.message.substring(141))
      alert('Transaction error, tap F12 for details!')
    })
  }

  withdrawFunds = async() => {
    this.setState.loading = true;
      this.state.piggybank.methods.withdraw().send({from: this.state.account})
      .on('receipt', function(hash){
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.message.substring(141))
        alert('Transaction error, tap F12 for details!')
      })
  }

  withdrawTokens = () => {
    this.setState.loading = true;
    this.state.piggybank.methods.withdrawTokens().send({from: this.state.account})
    .on('receipt', function(hash){
      window.location.reload();
    })
    .catch((err) => {
      console.log(err.message.substring(141))
      alert('Transaction error, tap F12 for details!')
    })
  }

  constructor(props) {
    super(props)
    this.state = { 
      account: '', 
      piggybank: {},
      ethSwap: {}, 
      ethBalance: '0',
      ethBalanceReduced: '0',
      piggybankBalance: '0',
      pigBalance: '',
      dateString: '',
      date: '',
      input: '0',
      loading: true,
      noWallet: false
      }
  }

  render(){
      if(this.state.loading) return(
        <div><Spinner className="spinner" animation="border" /></div>
      )
      else return(
      <Main
      version={this.props.version} 
      ethBalance={this.state.ethBalance}
      ethBalanceReduced={this.state.ethBalanceReduced}
      saveFunds={this.saveFunds}
      withdrawFunds={this.withdrawFunds}
      withdrawTokens={this.withdrawTokens}
      dateString={this.state.dateString}
      date={this.state.date}
      piggybankBalance={this.state.piggybankBalance}
      pigBalance={this.state.pigBalance}
      ></Main>
      )
  }
}



export default App;

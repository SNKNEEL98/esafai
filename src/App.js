import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import Consumer from './build/contracts/Consumer.json'
import Navbar from './Navbar'
import Main from './Main'
import BulletList from './BulletList'
import Footer from './Footer'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Consumer.networks[networkId]
    if (networkData) {
      const contracts = new web3.eth.Contract(Consumer.abi, networkData.address)
      this.setState({ contracts })
      const EwasteCount = await contracts.methods.EwasteCount().call()
      this.setState({ EwasteCount })
      // Load e-products
      for (var i = 1; i <= EwasteCount; i++) {
        const ewaste = await contracts.methods.ewastes(i).call()
        this.setState({
          ewastes: [...this.state.ewastes, ewaste]
        })
      }
      this.setState({ loading: false })
    } else {
      window.alert('Contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      EwasteCount: 0,
      ewastes: [],
      loading: true
    }

    this.createEwaste = this.createEwaste.bind(this)
    this.approveEwaste = this.approveEwaste.bind(this)
    this.purchaseEwaste = this.purchaseEwaste.bind(this)
  }

  createEwaste(name, price, description) {
    this.setState({ loading: true })
    this.state.contracts.methods.createEwaste(name, price, description).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  approveEwaste(id) {
    this.setState({ loading: true })
    this.state.contracts.methods.approveEwaste(id).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  purchaseEwaste(id, price) {
    this.setState({ loading: true })
    this.state.contracts.methods.purchaseEwaste(id).send({ from: this.state.account, value: price })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  render() {
    return (
      <div className="esafai_main" >
        <Navbar account={this.state.account} />
        <div className="container mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading
                ? <BulletList /> : <Main
                  ewastes={this.state.ewastes}
                  createEwaste={this.createEwaste}
                  approveEwaste={this.approveEwaste}
                  purchaseEwaste={this.purchaseEwaste} />
              }
            </main>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

}

export default App;

import React, { Component } from 'react';
import { Table, Header, Segment } from 'semantic-ui-react'
import { Checkmark } from 'react-checkmark'

class Main extends Component {

  render() {
    return (
      <div id="content" className="esafai_main_content">
        <div className="esafai_form">
          <Header as='h1' attached='top' className="esafai_form_header">
            E-SAFAI Form
          </Header>
          <Segment attached>
            <form className="row g-3" onSubmit={(event) => {
              event.preventDefault()
              const name = this.ewasteName.value
              const price = window.web3.utils.toWei(this.ewastePrice.value.toString(), 'Ether')
              const description = this.ewasteDescription.value
              this.props.createEwaste(name, price, description)
            }}>
              <div className="form-group col-md-6">
                <label className="form-label">Your E-Waste/E-Products</label>
                <input
                  id="ewasteName"
                  type="text"
                  ref={(input) => { this.ewasteName = input }}
                  className="form-control"
                  placeholder="E-Waste/E-Product Name..."
                  required />
              </div>
              <div className="form-group col-md-6">
                <label className="form-label">Price</label>
                <input
                  id="ewastePrice"
                  type="text"
                  ref={(input) => { this.ewastePrice = input }}
                  className="form-control"
                  placeholder="E-Waste/E-Product Price..."
                  required />
              </div>
              <div className="form-group col-12">
                <label className="form-label">Your E-Waste/E-Products Description</label>
                <input
                  id="ewasteDescription"
                  type="text"
                  ref={(input) => { this.ewasteDescription = input }}
                  className="form-control"
                  placeholder="E-Waste/E-Product Description..."
                  required />
              </div>
              <div className="col-12"><button type="submit" className="btn btn-success">Add E-Waste/E-Product</button></div>
            </form>
          </Segment>
        </div>
        <p>&nbsp;</p>
        <div className="esafai_dashboard">
          <Header as='h3' block>
            Dashboard
          </Header>

          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Id</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Owner</Table.HeaderCell>
                <Table.HeaderCell>Approved</Table.HeaderCell>
                <Table.HeaderCell>Purchased</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body id="ewasteList">
              {this.props.ewastes.map((ewaste, key) => {
                return (
                  <Table.Row key={key}>
                    <Table.Cell scope="row">{ewaste.id.toString()}</Table.Cell>
                    <Table.Cell>{ewaste.name}</Table.Cell>
                    <Table.Cell>{window.web3.utils.fromWei(ewaste.price.toString(), 'Ether')} Eth</
                    Table.Cell>
                    <Table.Cell>{ewaste.description}</Table.Cell>
                    <Table.Cell>{ewaste.owner}</Table.Cell>
                    <Table.Cell>
                      {ewaste.approved
                        ? <Checkmark size='medium' />
                        : <button
                          className="btn btn-outline-success"
                          name={ewaste.id}
                          onClick={(event) => {
                            this.props.approveEwaste(event.target.name)
                          }}
                        >
                          Approve
                        </button>
                      }
                    </Table.Cell>
                    <Table.Cell>
                      {ewaste.purchased
                        ? <Checkmark size='medium' />
                        : <button
                          className="btn btn-info esafai_buy"
                          name={ewaste.id}
                          value={ewaste.price}
                          onClick={(event) => {
                            this.props.purchaseEwaste(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      }
                    </Table.Cell>
                  </Table.Row>
                )
              }
              )
              }
            </Table.Body>
          </Table>
        </div>
      </div>
    );
  }
}

export default Main;

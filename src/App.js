import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { connect } from "react-redux";

class App extends Component {
  fetchItems = searchTerm => {
    const { dispatch } = this.props;
    // const searchTerm = "ipod";
    console.log("Fetching Items");
    dispatch({
      type: "FETCHING_ITEMS"
    });
    fetch(
      "http://api.walmartlabs.com/v1/search?query=" +
        searchTerm +
        "&format=json&apiKey=9ne25bvthvaa6e3aae9b4r74"
    )
      .then(response => response.json())
      .then(json =>
        dispatch({
          type: "LOAD_ITEMS",
          payload: [
            ...json.items.map((item, i) => {
              return { ...item, id: i, quantity: 0, checkbox: false };
            })
          ]
        })
      )
      .catch(reason =>
        dispatch({
          type: "FETCHING_ITEMS_FAILED",
          payload: { reason }
        })
      );
  };

  addToCart = i => {
    const { dispatch } = this.props;

    console.log(i);
    dispatch({
      type: "ADD_TO_CART",
      payload: [i]
    });
  };

  // addNewItemToCart = itemname => {
  //   const { items, cart, total } = this.state;
  //   const updatedCart = [...cart];
  //   const itemFromList = items.filter(item => item.name === itemname);
  //   const itemPrice = itemFromList[0].price;
  //   const newCartItem = { name: itemname, quantity: 1, price: itemPrice };
  //   updatedCart.push(newCartItem);
  //   const oldTotal = total;
  //   this.setState({
  //     cart: updatedCart,
  //     total: (+oldTotal + +newCartItem.price).toFixed(2)
  //   });
  // };

  render() {
    const { items, isFetching, error } = this.props;
    return (
      <div
        className="App"
        onSubmit={e => {
          e.preventDefault();
          const value = e.target.elements.namedItem("query").value;
          console.log(value);
          e.target.elements.namedItem("query").value = "";
          this.fetchItems(value);
        }}
      >
        <form id="form">
          Search
          <input type="text" name="query" />
        </form>
        <h1>Your Item Results</h1>
        {isFetching && <div>Loading Items</div>}
        {items.map(item => (
          <div key={item.id}>
            <img src={item.thumbnailImage} /> {item.name}: ${item.salePrice}
            <button
              id="addOne"
              className="centered"
              onClick={() => this.addToCart(item)}
            >
              Add 1
            </button>
          </div>
        ))}
        {error && <div>{error}</div>}

        <h4>Items in cart:</h4>
        {this.props.cart.map(item => (
          <div key={item.itemId} className="divcont">
            <img id="pic" src={item.thumbnailImage} />
            <span id="name" className="centered">
              Product: {item.name}{" "}
            </span>
            <span id="price" className="centered">
              Price: {item.salePrice}
            </span>
          </div>
        ))}
      </div>
    );
  }
}

const mapStatetoProps = state => ({
  items: state.items,
  isFetching: state.isFetching,
  error: state.error,
  cart: state.cart
});

export default connect(mapStatetoProps)(App);

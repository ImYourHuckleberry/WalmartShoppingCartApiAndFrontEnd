import React, { Component } from "react";
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
              return { ...item, id: i, quantity: 1, checkbox: false };
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
    const { dispatch, cart } = this.props;
    const updatedCart = [...cart];
    const newCart = [i];
    updatedCart.push(newCart);
    dispatch({
      type: "ADD_TO_CART",
      payload: updatedCart
    });
  };

  handleCheckout = () => {
    const { dispatch } = this.props;

    dispatch({
      type: "CHECKOUT"
    });
  };

  findCartItemByItemName = item => {
    const { cart } = this.props;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].name === item) {
        return cart[i];
      }
    }
  };

  handleOnQuantityAdded = itemname => {
    const { cart, total } = this.props;
    if (cart.length === 0) {
      this.addToCart(itemname);
      console.log("only first add");

      return;
    } else {
      let itemIsInCart = false;
      for (let i = 0; i < cart.length; i++) {
        const checkItem = cart[i].map(item => item.name);
        if (checkItem[0] === itemname.name) {
          console.log("im switching item in cart boolean");
          itemIsInCart = true;
        }
      }
      if (!itemIsInCart) {
        this.addToCart(itemname);
        console.log("in adding an item not in cart to the cart");
      } else {
        const updatedCart = cart.map(item => {
          console.log(item[0])
          console.log(itemname)
          if (item[0] === itemname) {
            const updatedItem = item[0];
            console.log("i am the updated item");
            console.log(updatedItem);
            updatedItem.quantity += 1;
            console.log("i am updating quantity");
            return updatedItem;
            
           
          } else {
            return item;
          }
        });
        const oldTotal = total;
        const cartItem = this.findCartItemByItemName(itemname);
        this.setState({
          cart: updatedCart
          //         total: (+oldTotal + +cartItem.price).toFixed(2)
        });
      }
    }
  };

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
              onClick={() => this.handleOnQuantityAdded(item)}
            >
              Add 1
            </button>
          </div>
        ))}
        {error && <div>{error}</div>}

        <h4>Items in cart:</h4>
        {this.props.cart.map(item => (
          <div key={item[0].itemId} className="divcont">
            <img id="pic" src={item[0].thumbnailImage} />
            <span id="name" className="centered">
              Product: {item[0].name}{" "}
            </span>
            <span id="price" className="centered">
              Price: {item[0].salePrice}
            </span>
            <span id="quantity" className="centered">
              {" "}
              Quantity: {item[0].quantity}
            </span>
          </div>
        ))}
        <div>
          <button onClick={() => this.handleCheckout()}>Checkout</button>
        </div>
      </div>
    );
  }
}

const mapStatetoProps = state => ({
  items: state.items,
  isFetching: state.isFetching,
  error: state.error,
  cart: state.cart,
  total: state.total
});

export default connect(mapStatetoProps)(App);

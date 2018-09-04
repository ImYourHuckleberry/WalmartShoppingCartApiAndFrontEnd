const initialState = {
  items: [],
  isFetching: false,
  error: "",
  cart: [],
  total: 0,
  total: (0.0).toFixed(2)
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCHING_ITEMS":
      {
        return { ...state, isFetching: true };
      }
      break;
    case "LOAD_ITEMS":
      {
        return { ...state, items: action.payload, isFetching: false };
      }
      break;
      break;
    case "FETCHING_ITEMS_FAILED":
      {
        console.warn("Failed to fetch!");
        return {
          ...state,
          items: [],
          isFetching: false,
          error: action.payload.reason.message
        };
      }
      break;
    case "ADD_TO_CART":
      {
        console.log("i got pinged");

        return {
          ...state,
          cart: action.payload
        };
      }
      break;
    case "CHECKOUT":
      {
        alert("$",action.payload);
        console.log("check me out");
        return state;
      }
      break;
    default: {
      console.log("Unhandled action", action.type);
      return state;
    }
  }
};

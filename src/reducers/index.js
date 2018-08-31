const initialState = {
    items: [],
    isFetching: false,
    error: '',
    cart:[]
  };
  
  export const reducer = (state = initialState, action) => {
  
    switch (action.type) {
      case 'FETCHING_ITEMS': {
        return { ...state, isFetching: true }
      }
      case 'LOAD_ITEMS': {
        return { ...state, items: action.payload, isFetching: false }
      }
      case 'FETCHING_ITEMS_FAILED': {
        console.warn('Failed to fetch!');
        return { 
          ...state, 
          items: [], 
          isFetching: false, 
          error: action.payload.reason.message 
        }
      }
      case 'ADD_TO_CART':{
          console.log("i got pinged")
          
          return {
           ...state,
           cart: action.payload
           
      }}
      default: {
        console.log('Unhandled action', action.type);
        return state;
      }
    }
  
  };
  
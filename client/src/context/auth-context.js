import React, { useReducer } from 'react';

export const AuthContext = React.createContext({
  token: null,
  userId: null,
  login: (userId, token, tokenExpiration) => { },
  logout: () => { },
  addTrainer: () => {},
  jockeys: [],
  stables: [],
  trainers: []
})

const listReducer = (state, action) => {
  switch (action.type) {
    case "STABLE":
      return {
        ...state,
        stables: [...state.stables, action.payload]
      }
    case "TRAINER":
      return {
        ...state,
        trainers: [...state.trainers, action.payload]
      }
    case "JOCKEY":
      return {
        ...state,
        jockeys: [...state.jockeys, action.payload]
      }
    case 'SET':
      return {
        ...state,
        ...action.payload
      }

    default:
      break;
  }
}

const createProviderContext = () => {
  const [state, dispatch] = useReducer(listReducer, {
    jockeys: [],
    stables: [],
    trainers: []
  });
  return {
    ...state,
    addJockey: (jockey) => {
      dispatch({ type: 'JOCKEY', payload: jockey })
    },
    addStable: (stable) => {
      dispatch({ type: 'STABLE', payload: stable })
    },
    addTrainer: (trainer) => {
      dispatch({ type: 'TRAINER', payload: trainer })
    },
    setList: (values) => {
      dispatch({ type: 'SET', payload: values })
    }
  }
}

const AuthContextProvider = ({ children }) => {
  const initialContext = createProviderContext();

  return (
    <AuthContext.Provider
      value={{ ...initialContext }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;
import {User} from "../../../../user.model";
import * as AuthActions from './auth.acions';

export interface State {
  user: User | null;
  authError: string | null;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(state: State = initialState, action: any) {
  return authReduce(state, action);
}

function authReduce(state: State, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      )
      return {
        ...state,
        authError: null,
        user: user,
        loading: false
      }
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      }
    case AuthActions.LOGIN_START:
      return {
        ...state,
        authError: null,
        loading: true
      }
    case AuthActions.LOGIN_FAIL:
      return {
        ...state,
        authError: action.payload,
        loading: false
      }
    default:
      return state;
  }
}

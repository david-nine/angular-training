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
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      )
      return {
        ...state,
        authError: null,
        user: user
      }
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        loading: false
      }
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true
      }
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        authError: action.payload,
        loading: false
      }
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      }
    default:
      return state;
  }
}

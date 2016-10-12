import { OPEN_MODAL,
  CLOSE_MODAL, OPEN_MODAL_EDIT,
  ADD_NEW_ENDPOINT, FETCH_ENDPOINTS,
  UPDATE_GITHUB_AUTH, SIGN_OUT_USER,
  SET_MODAL_MODE } from '../utils/AppConstants';

const assign = Object.assign;

const initialState = {
  showModal: false,
  modalModeAddUrl: false,
  endpoints: null,
  githubAuthStatus: false,
  addingNewEndpoint: false,
  isEditing: false,
  associatedKey: null
  //associated key will have a value when isEditing is true,
  //value of key being edited
};

export default function keyModalReducer(state = initialState, action) {
  switch (action.type) {
  case OPEN_MODAL:
    return assign({}, state, { showModal: true });
  case CLOSE_MODAL:
    return assign({}, state, {
      showModal: false,
      addingNewEndpoint: false,
      isEditing: false,
      associatedKey: null
    });
  case SET_MODAL_MODE:
    return assign({}, state, { modalModeAddUrl: action.modalModeAddUrl });
  case OPEN_MODAL_EDIT:
    return assign({}, state, {
      showModal: true,
      isEditing: true,
      associatedKey: action.payload
    });
  case UPDATE_GITHUB_AUTH:
    return assign({}, state, {
      githubAuthStatus: true,
      addingNewEndpoint: false
    });
  case ADD_NEW_ENDPOINT:
    return assign({}, state, { addingNewEndpoint: true });
  case FETCH_ENDPOINTS:
    return assign({}, state, { endpoints: action.payload });
  case SIGN_OUT_USER:
    return assign({}, state, initialState);
  default:
    return state;
  }
}

// neither github nor url - show select from 2 on add
// has url but no github - show dropdown + select from 2 on add
// has no url but has github - show dropdown + select from 1
//has github and url - show dropdown + select from 1

const initialState = {
    username: '',
    profilePic: ''
}

const UPDATE_USER = 'UPDATE_USER';
const LOGOUT = 'LOGOUT'

export default function (state = initialState, action){
    let { type, payload } = action
    switch (type) {
        case UPDATE_USER:
            return {...state, username: payload.username, profilePic: payload.profilePic};
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}

export function updateUser(user) {
    return {
        type: UPDATE_USER,
        payload: user
    }
}

export function logout() {
    return {
        type: LOGOUT
    }
}
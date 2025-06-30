import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    loading: false,
    loginTime : 0,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signinstart: (state) => {
            state.loading = true
        },
        signinSuccess: (state, action) => {
            state.loading = false
            state.currentUser = action.payload
            state.loginTime = Date.now()
        },
        signinFailure: (state) => {
            state.loading = false
            state.currentUser = null
        },
        signout: (state) => {
            state.currentUser = null,
            state.loginTime = 0
        }
    }
})

export const { signinstart, signinSuccess, signinFailure, signout } = userSlice.actions
export default userSlice.reducer
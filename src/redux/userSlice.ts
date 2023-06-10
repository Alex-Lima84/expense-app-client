import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        logout: (state, action) => {
            state.isLoggedIn = action.payload;
        }
    }
})

export const { login, logout } = userSlice.actions;
export const selectUser = (state: { user: { isLoggedIn: boolean; }; }) => (state.user.isLoggedIn);
export default userSlice.reducer;
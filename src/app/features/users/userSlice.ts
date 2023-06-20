import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
    id: string;
    name: string;
}

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';


// const initialState: User[] = [
//     {
//         id: '0',
//         name: 'Dude Lebowski'
//     },
//     {
//         id: '1',
//         name: 'Nail Young'
//     },
//     {
//         id: '3',
//         name: 'Dave Gray'
//     },
// ]

const initialState: User[] = []

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    try {
        const response = await axios.get(USERS_URL);
        return response.data;
    } catch (err: any) {
        return err.message
    }
})

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.fulfilled, (_state, action) => {
                return action.payload;
            })
    }
})

export const selectAllUsers = (state: { users: User[] }) => state.users;

export const selectUserById = (state: { users: User[] }, userId: string | number) =>
    state.users.find(user => user.id === userId);

export default userSlice.reducer;
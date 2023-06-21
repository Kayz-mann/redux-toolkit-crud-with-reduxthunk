import { createSlice, PayloadAction, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'


export interface Post {
    id?: string;
    title?: string;
    content?: string;
    userId?: string | number;
    date: string;
    reactions?: Object;
}

export interface DynamicPostProp {
    posts: Post[];
    status: string;
    error: any
    count: number
}

export interface RootState {
    posts: DynamicPostProp;
    // Add other slices' state types here if needed
}

export type UpdatePostProp = Pick<Post, 'id' | 'title' | 'content' | 'userId' | 'reactions'>;

export type DeletePostProp = Pick<Post, 'id'>;

// In Redux Toolkit, createEntityAdapter is a utility function provided to simplify the management of normalized data in your Redux store. It helps you define and manipulate entities in a normalized data structure, making it easier to handle CRUD operations (create, read, update, delete) for those entities.

// The createEntityAdapter function creates an adapter object that contains pre-defined selectors and reducer logic for managing entities. It abstracts away the boilerplate code that you would typically write to handle entity-related actions and reducers

const postAdapter = createEntityAdapter<Post>({
    sortComparer: (a: Post, b: Post) => b.date.localeCompare(a.date),
});


const initialState: DynamicPostProp = postAdapter.getInitialState({
    posts: [],
    status: 'idle',
    error: null,
    count: 0
})



export const fetchPosts = createAsyncThunk<Post[], void>('posts/fetchPosts', async () => {
    try {
        const response = await axios.get(POSTS_URL);
        return response.data;
    } catch (err: any) {
        return err.message;
    }
})

export const addNewPost = createAsyncThunk<Post[], UpdatePostProp>('posts/addPosts', async (initialPost) => {
    try {
        const response = await axios.post(POSTS_URL, initialPost);
        return response.data;
    } catch (err: any) {
        return err.message;
    }
});

export const updatePost = createAsyncThunk<Post, UpdatePostProp>('posts/updatePost', async (initialPost) => {
    const { id } = initialPost;
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
        return response.data;
    } catch (err: any) {
        // return err.message;

        return initialPost; //only for testing purposes
    }
});

export const deletePost = createAsyncThunk<Post, DeletePostProp>('posts/deletePost', async (initialPost) => {
    const { id } = initialPost;
    try {
        const response = await axios.delete(`${POSTS_URL}/${id}`);
        if (response?.status === 200) return initialPost;
        return `${response?.status}: ${response?.statusText}`
    } catch (err: any) {
        return err.message;
    }
});





// static data
// const initialState: Post[] = [
//     {
//         id: '1',
//         title: 'Learning Redux Toolkit',
//         content: "I've heard good things.",
//         date: sub(new Date(), { minutes: 10 }).toISOString(),
//         reactions: {
//             thumbsUp: 0,
//             wow: 0,
//             heart: 0,
//             rocket: 0,
//             coffee: 0
//         }
//     },
//     {
//         id: '2',
//         title: 'Slices...',
//         content: "The more I say slice, the more I want pizza",
//         date: sub(new Date(), { minutes: 10 }).toISOString(),
//         reactions: {
//             thumbsUp: 0,
//             wow: 0,
//             heart: 0,
//             rocket: 0,
//             coffee: 0
//         }
//     },
// ];

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        // postAdded: {
        //     reducer: (state, action: PayloadAction<Post>) => {
        //         state.posts.push(action.payload);
        //         //static
        //         // state.push(action.payload);
        //     },

        //     prepare: (title: string, content: string, userId: string) => {
        //         return {
        //             payload: {
        //                 id: nanoid(),
        //                 title,
        //                 content,
        //                 userId,
        //                 date: new Date().toISOString(),
        //                 reactions: {
        //                     thumbsUp: 0,
        //                     wow: 0,
        //                     heart: 0,
        //                     rocket: 0,
        //                     coffee: 0
        //                 }
        //             }
        //         }
        //     }
        // },
        reactionAdded: (state: any, action: PayloadAction<{ postId: string; reaction: keyof Post['reactions'] }>) => {
            const { postId, reaction } = action.payload
            //fetching by postId 
            // const existingPost: any = state.posts.find(post => post.id === postId)
            //fetching id in a flat array
            const existingPost: any = state.entities[postId]
            //static 
            //const existingPost: any = state.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        increaseCount: (state) => {
            state.count = state.count + 1
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state: any, action) => {
                state.status = 'succeeded'

                //Adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map((post: Post) => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString()

                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });

                //Add any fetched posts to the array
                // state.posts = state.posts.concat(loadedPosts)
                postAdapter.upsertMany(state, loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state: any, action: any) => {
                const newPost = action.payload[0]; // Access the first post in the array
                newPost.userId = Number(newPost.userId);
                newPost.date = new Date().toISOString();
                newPost.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                };
                console.log(newPost);
                // state.posts.push(newPost);
                postAdapter.addOne(state, action.payload)
            })
            .addCase(updatePost.fulfilled, (state: any, action) => {
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return;
                }
                // const { id } = action.payload;
                action.payload.date = new Date().toISOString();
                // const posts = state.posts.filter((post: any) => post.id !== id)
                // state.posts = [...posts, action.payload];
                postAdapter.upsertOne(state, action.payload)
            })
            .addCase(deletePost.fulfilled, (state: any, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                // const posts = state.posts.filter((post: any) => post.id !== id);
                // state.posts = posts
                postAdapter.removeOne(state, id)
            })

    }
});

//get Selectors creates these selectors and we rename them with aliases using destructuring

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostsIds,
} = postAdapter.getSelectors((state: any) => state.posts)

// export const selectAllPosts = (state: any): Post[] => state.posts.posts;
export const getPostsStatus = (state: any): string => state.posts.status;
export const getPostsError = (state: any): any => state.posts.error;
export const getCount = (state: any) => state.posts.count;
// export const selectPostByI = (state: RootState, postId: number): Post | undefined => {
//     return state.posts.posts.find((post: Post) => post.id === postId);
// };

// export const selectPostById = (state: RootState, postId: number | undefined) => state.posts.posts.find((post: Post) => post.id === postId);



//static
//export const selectAllPosts = (state: any): Post[] => state.posts;

export const {
    // postAdded, 
    increaseCount,
    reactionAdded
} = postsSlice.actions;

export default postsSlice.reducer;

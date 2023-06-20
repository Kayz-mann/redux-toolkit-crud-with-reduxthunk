import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AddPostForm from './app/features/posts/AddPostForm'
import PostsList from './app/features/posts/PostsList'
import Layout from './components/Layout'
import SinglePostPage from './app/features/posts/SinglePostPage'
import EditPostForm from './app/features/posts/EditPostForm'
import UsersList from './app/features/users/UsersList'
import UserPage from './app/features/users/UserPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostsList />} />

        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>

        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>

        {/* Catch all - replace with 404 component if you want */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App

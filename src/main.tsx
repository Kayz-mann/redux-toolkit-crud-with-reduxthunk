import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { fetchUsers } from './app/features/users/userSlice.ts'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


store.dispatch(fetchUsers())

//to fetch posts globally from the server
// store.dispatch(fetchPosts())

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
)

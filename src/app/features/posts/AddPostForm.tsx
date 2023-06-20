import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addNewPost } from './postSlice';
import styles from './index.module.css'
import { selectAllUsers } from '../users/userSlice';
import { useNavigate } from 'react-router-dom';

const AddPostForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    // const [date, setDate] = useState<string>('');
    const [addRequestStatus, setAddRequestStatus] = useState<string>('idle');

    const users = useSelector(selectAllUsers);
    const onTitleChanged = (e: { target: { value: React.SetStateAction<string>; }; }) => setTitle(e.target.value)
    const onContentChanged = (e: { target: { value: React.SetStateAction<string>; }; }) => setContent(e.target.value);
    const onAuthorChanged = (e: { target: { value: React.SetStateAction<string>; }; }) => setUserId(e.target.value)

    //disable button if form is not filled
    // const canSave = Boolean(title) && Boolean(content) && Boolean(userId);

    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

    const onSavePostClicked = () => {
        // if (title && content) {
        //     dispatch(
        //         postAdded(title, content, userId)
        //     )
        //     setTitle('');
        //     setContent('')
        // }

        if (canSave) {
            try {
                setAddRequestStatus('pending')
                dispatch(addNewPost({ title, content, userId }) as any).unwrap()

                setTitle('')
                setContent('')
                setUserId('')
                navigate('/')
            } catch (err: any) {
                console.error('Failed to save the post', err)
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }

    const userOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ));



    return (
        <section className={styles.container}>
            <h2>Add a New Post</h2>

            <form className={styles.formContent}>
                <label htmlFor='postTitle'>Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                    placeholder='enter title'

                />

                <label htmlFor='postAuthor'>Author:</label>
                <select id='postAuthor' value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {userOptions}
                </select>

                <label htmlFor='postContent'>Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                    placeholder='enter content'
                />

                <button disabled={!canSave} onClick={onSavePostClicked} type="button">Save Post</button>
            </form>
        </section>
    )
}

export default AddPostForm
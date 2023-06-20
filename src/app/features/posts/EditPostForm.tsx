import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { RootState, deletePost, selectPostById, updatePost } from './postSlice';
import { selectAllUsers } from '../users/userSlice';
import { SetStateAction, useState } from 'react';

const EditPostForm = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    const post = useSelector((state: RootState) => selectPostById(state, Number(postId)));
    const users = useSelector(selectAllUsers);

    const [title, setTitle] = useState<string | undefined>(post?.title);
    const [content, setContent] = useState<string | undefined>(post?.content);
    const [userId, setUserId] = useState<string | number | undefined>(post?.userId);
    const [requestStatus, setRequestStatus] = useState('idle');

    const dispatch = useDispatch();

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    const onTitleChanged = (e: { target: { value: SetStateAction<string | undefined>; }; }) => setTitle(e.target.value);
    const onContentChanged = (e: { target: { value: SetStateAction<string | undefined>; }; }) => setContent(e.target.value);
    const onAuthorChanged = (e: { target: { value: SetStateAction<string | number | undefined>; }; }) => setUserId(e.target.value);

    const canSave = [title, content, userId].every(Boolean) && requestStatus === 'idle';

    const onSavePostClicked = () => {
        if (canSave) {
            const updatedPost = { id: post.id, title, content, userId, reactions: post.reactions } as any
            try {
                setRequestStatus('pending');
                dispatch(updatePost(updatedPost) as any).unwrap();

                setTitle('')
                setContent('')
                setUserId('')
                navigate(`/post/${post.id}`);

            } catch (err) {
                console.error('Failed to save the post', err);
            } finally {
                setRequestStatus('idle')
            }
        }
    }

    const userOptions = users.map(user => (
        <option
            key={user.id}
            value={user.id}
        >
            {user.name}
        </option>
    ))

    const onDeletePostClicked = () => {
        try {
            setRequestStatus('pending');
            dispatch(deletePost({ id: post.id }) as any).unwrap();

            setTitle('')
            setContent('')
            setUserId('')
            navigate('/')
        } catch (err) {
            console.error('Failed to delete post', err)
        } finally {
            setRequestStatus('idle');
        }
    }


    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor='postTitle'>Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label htmlFor='postAuthor'>Author:</label>
                <select
                    id='postAuthor'
                    defaultValue={userId}
                    onChange={onAuthorChanged}
                >
                    <option value=''></option>
                    {userOptions}
                </select>
                <label htmlFor='postContent'>Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >
                    Save Post
                </button>
                <button
                    type="button"
                    onClick={onDeletePostClicked}
                >
                    Delete Post
                </button>
            </form>
        </section>
    )
}

export default EditPostForm
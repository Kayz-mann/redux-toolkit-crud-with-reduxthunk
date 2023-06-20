import React from 'react'
import { useSelector } from 'react-redux'
import { User, selectAllUsers } from '../users/userSlice'
import { Post } from './postSlice';

interface PostAuthorProps {
    post?: Post;
}

const PostAuthor: React.FC<PostAuthorProps> = ({ post }) => {
    const users = useSelector(selectAllUsers);
    const author: User | undefined = users.find((user: User) => user.id === post?.userId);
    return (
        <span>
            by {author ? author.name : 'Unknown author'}
        </span>
    )
}

export default PostAuthor
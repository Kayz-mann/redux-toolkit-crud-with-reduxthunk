import styles from './index.module.css';
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButton from './ReactionButton';
import { Link } from 'react-router-dom';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectPostById } from './postSlice';

interface PostExcerptProps {
    postId: any; // Adjust the type to match your post object type
}

const PostExcerpt: FC<PostExcerptProps> = ({ postId }) => {
const post: any = useSelector((state: any) => selectPostById(state, postId))
    return (
        <article className={styles.content}>
            <h2>{post.title}</h2>
            <p>{post.body.substring(0, 75)}...</p>
            <p>
                <Link to={`post/${post.id}`}>View Post</Link>
                <PostAuthor post={post} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButton post={post} />
        </article>
    );
};

export default React.memo(PostExcerpt);

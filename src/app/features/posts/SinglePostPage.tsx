import { useSelector } from 'react-redux'
import { RootState, selectPostById } from './postSlice'
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButton from './ReactionButton';
import { Link, useParams } from 'react-router-dom';


const SinglePostPage = ({ }) => {
    const { postId } = useParams();
    //check back on postId as number from slice
    const post = useSelector((state: RootState) => selectPostById(state, Number(postId)))

    console.log('show post', post);

    if (!post) {
        return (
            <section>
                <h2>Post Not Found</h2>
            </section>
        )
    }

    return (
        <article>
            <h2>{post.title}</h2>
            <h2>{post.content}</h2>
            <p className='postCredit'>
                <PostAuthor post={post} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButton post={post} />
            <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
        </article>
    )
}

export default SinglePostPage
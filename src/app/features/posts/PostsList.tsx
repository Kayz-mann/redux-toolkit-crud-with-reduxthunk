import { useDispatch, useSelector } from "react-redux";
import { DynamicPostProp,fetchPosts, getPostsError, getPostsStatus, selectPostsIds } from "./postSlice";

import { useEffect } from "react";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import PostExcerpt from "./PostExcerpt";


const PostsList = () => {
  const dispatch = useDispatch<ThunkDispatch<DynamicPostProp, void, AnyAction>>();
  // const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector((state: PositionErrorCallback) => getPostsStatus(state));
  const error = useSelector(getPostsError);
  const orderedPostIds = useSelector(selectPostsIds);

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postsStatus, dispatch])

  // //sort most recent post by date
  // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

  // const renderedPosts = orderedPosts.map((post) => (
  //   <PostExcerpt key={post.id} />
  // ));

  let content;
  if (postsStatus === 'loading') {
    content = <p>Loading...</p>;
  } else if (postsStatus === 'succeeded') {
    // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPostIds.map((postId: any) => (
      <PostExcerpt key={postId} postId={postId} />
    ));

  } else if (postsStatus === 'failed') {
    content = <p>{error}</p>
  }

  return (
    <section>
      {content}
    </section>
  )
}

export default PostsList
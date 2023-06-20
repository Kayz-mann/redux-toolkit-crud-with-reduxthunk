import React from 'react'
import { useDispatch } from 'react-redux'
import { reactionAdded } from './postSlice';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';

const reactionEmoji = {
    thumbsUp: '👍',
    wow: '😯',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕️'
}

interface PostProps {
    post: any
}

const ReactionButton: React.FC<PostProps> = ({ post }) => {
    const dispatch: Dispatch<AnyAction> = useDispatch();

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
            <button
                key={name}
                type="button"
                className="reactionButton"
                onClick={() =>
                    dispatch(reactionAdded({ postId: post.id, reaction: name }))}
            >
                {emoji} {post.reactions[name]}
            </button>
        )
    })
    return (
        <div>{reactionButtons}</div>
    )
}

export default ReactionButton
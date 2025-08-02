import React from 'react';
import { PostProvider } from '../../contexts/PostContext';
import { PostsMainView } from '../../components/dashboard/posts';

const Posts = () => {
  return (
      <PostsMainView />
  );
};

export default Posts;
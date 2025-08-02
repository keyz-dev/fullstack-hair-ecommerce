import React, { useState } from 'react';
import { PostProvider } from '../../contexts/PostContext';
import { PostsMainView, CreatePostPage } from '../../components/dashboard/posts';

const Posts = () => {
  const [view, setView] = useState('main');
  
  return (
    <PostProvider>
      <section>
        {view === 'main' ? (
          <PostsMainView setView={setView} />
        ) : (
          <CreatePostPage setView={setView} />
        )}
      </section>
    </PostProvider>
  );
};

export default Posts;
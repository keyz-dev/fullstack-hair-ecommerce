import React, { useState } from 'react';
import { PostsMainView, CreatePostPage } from '../../components/dashboard/posts';

const Posts = () => {
  const [view, setView] = useState('main');
  
  return (
    <section>
      {view === 'main' ? (
        <PostsMainView setView={setView} />
      ) : (
        <CreatePostPage setView={setView} />
      )}
    </section>
  );
};

export default Posts;
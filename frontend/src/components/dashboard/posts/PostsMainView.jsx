import React, { useState, useEffect } from "react";
import { PostStatSection, PostsListView, EditPostModal, ViewPostModal } from ".";
import { Button, DeleteModal, FadeInContainer } from "../../ui";
import { usePost } from "../../../hooks";

const PostsMainView = ({ setView }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { deletePost, loading, fetchStats, fetchInitialPosts, posts, stats } = usePost();

  // Fetch posts and stats on component mount
  useEffect(() => {
    fetchInitialPosts();
    fetchStats();
  }, []); // Only run once on mount

  const handleEdit = (post) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleView = (post) => {
    setSelectedPost(post);
    setViewModalOpen(true);
  };

  const handleDelete = (post) => {
    setSelectedPost(post);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const result = await deletePost(selectedPost._id);
    if (result) {
      setDeleteModalOpen(false);
      setSelectedPost(null);
    }
  };

  console.log(posts)

  return (
    <section>
      <FadeInContainer delay={200} duration={600}>
        <PostStatSection stats={stats} loading={loading} />
      </FadeInContainer>
      
      <FadeInContainer delay={400} duration={600}>
        <div className="flex justify-end items-center mb-4">
          <Button 
            onClickHandler={() => setView('create')} 
            additionalClasses="primarybtn"
          >
            Add Post
          </Button>
        </div>
      </FadeInContainer>
      
      <FadeInContainer delay={600} duration={600}>
        <PostsListView onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
      </FadeInContainer>
      
      <EditPostModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedPost(null); }}
        initialData={selectedPost}
      />

      <ViewPostModal
        isOpen={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setSelectedPost(null); }}
        post={selectedPost}
      />
      
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedPost(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        message={`Are you sure you want to delete "${selectedPost?.title}"? This action cannot be undone.`}
        loading={loading}
      />
    </section>
  );
};

export default PostsMainView; 
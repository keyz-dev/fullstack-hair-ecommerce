import React, { useState, useEffect } from "react";
import { PostStatSection, PostsListView, EditPostModal, ViewPostModal } from ".";
import { Button, DeleteModal } from "../../ui";
import { usePost } from "../../../hooks";

const PostsMainView = ({ setView }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { deletePost, loading, fetchStats, fetchPosts, posts, featuredPosts } = usePost();

  // Fetch posts and stats on component mount
  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, []); // Empty dependency array since we only want to run this once on mount

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

  return (
    <section>
      <PostStatSection posts={posts} featuredPosts={featuredPosts} />
      <div className="flex justify-end items-center mb-4">
        <Button 
          onClickHandler={() => setView('create')} 
          additionalClasses="primarybtn"
        >
          Add Post
        </Button>
      </div>
      
      <PostsListView onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
      
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
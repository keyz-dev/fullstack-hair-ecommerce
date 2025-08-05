import React, { useEffect } from "react";
import { useCategory } from "../../hooks";
import { CategoriesListView, AddCategoryModal, UpdateCategoryModal, CategoryStatSection } from "../../components/dashboard/categories"
import { Button, AdvancedFilters, DeleteModal, LoadingSpinner, EmptyState, FadeInContainer } from "../../components/ui";

const CategoriesMainView = () => {
  const {
    categories,
    loading,
    error,
    filters,
    pagination,
    filteredCategories,
    stats,
    actions,
    fetchCategories,
    deleteCategory
  } = useCategory();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // No need to refetch when filters change since filtering is client-side

  // Handle category edit
  const handleCategoryEdit = () => {
    setEditModalOpen(true);
  };

  // Handle category delete
  const handleCategoryDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    setDeleteLoading(true);
    const success = await deleteCategory(categoryToDelete._id);
    setDeleteLoading(false);
    
    if (success) {
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    actions.setFilter(filterType, value);
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    actions.setSearch(searchTerm);
  };

  // Handle searching state change
  const handleSearchingChange = (searching) => {
    setIsSearching(searching);
  };

  // Refresh categories
  const handleRefresh = () => {
    actions.refreshCategories();
    fetchCategories(pagination.page);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Failed to Load Categories"
          description={error}
          action={
            <Button onClick={handleRefresh} variant="primary">
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="lg:px-3">
      {/* Category Statistics */}
      <FadeInContainer delay={200} duration={600}>
        <CategoryStatSection stats={stats} loading={loading} />
      </FadeInContainer>

      {/* Add Category Button */}
      <FadeInContainer delay={400} duration={600}>
        <div className="flex justify-end items-center my-3">
          <Button
            onClickHandler={() => setIsModalOpen(true)}
            additionalClasses="primarybtn"
          >
            Add Category
          </Button>
        </div>
      </FadeInContainer>

      {/* Advanced Search and Filters */}
      <FadeInContainer delay={600} duration={600}>
        <AdvancedFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClearAll={actions.clearAllFilters}
          onSearchingChange={handleSearchingChange}
          filterConfigs={[
            {
              key: 'status',
              label: 'Status',
              defaultValue: 'all',
              colorClass: 'bg-green-100 text-green-800',
              options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'archived', label: 'Archived' },
              ]
            },
            {
              key: 'sortBy',
              label: 'Sort By',
              defaultValue: 'name',
              colorClass: 'bg-purple-100 text-purple-800',
              options: [
                { value: 'name', label: 'Name' },
                { value: 'createdAt', label: 'Date Created' },
                { value: 'updatedAt', label: 'Last Updated' },
              ]
            }
          ]}
          searchPlaceholder="Search categories by name or description..."
          loading={loading}
        />
      </FadeInContainer>

      {/* Categories List */}
      <FadeInContainer delay={800} duration={600}>
        <div className="mt-6">
          <CategoriesListView
            categories={filteredCategories}
            loading={loading || isSearching}
            onEdit={handleCategoryEdit}
            onDelete={handleCategoryDelete}
          />
        </div>
      </FadeInContainer>

             {/* Pagination */}
       <FadeInContainer delay={1000} duration={600}>
         {pagination.total > pagination.limit && (
           <div className="flex justify-center mt-6">
             <div className="flex items-center space-x-2">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => fetchCategories(pagination.page - 1)}
                 disabled={pagination.page === 1}
               >
                 Previous
               </Button>
               <span className="text-sm text-gray-600">
                 Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
               </span>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => fetchCategories(pagination.page + 1)}
                 disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
               >
                 Next
               </Button>
             </div>
           </div>
         )}
       </FadeInContainer>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <UpdateCategoryModal
        isOpen={editModalOpen}
        onClose={() => { 
          setEditModalOpen(false); 
          fetchCategories(pagination.page);
        }}
      />
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { 
          setDeleteModalOpen(false); 
          setCategoryToDelete(null); 
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default CategoriesMainView;

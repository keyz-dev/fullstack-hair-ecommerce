import { useState, useEffect } from "react";
import { useCategory } from "../../hooks";
import { CategoriesListView, AddCategoryModal, UpdateCategoryModal, DeleteCategoryModal } from "../../components/dashboard/categories"
import { Button, SearchBar, FilterDropdown } from "../../components/ui";

const CategoriesMainView = () => {
  const { fetchCategories, categories, loading, deleteCategory } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const searchParams = { ...filters, search: searchTerm };
    fetchCategories(searchParams);
  }, [searchTerm, filters, fetchCategories]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    await deleteCategory(selectedCategory._id);
    setDeleteLoading(false);
    setDeleteModalOpen(false);
    setSelectedCategory(null);
    fetchCategories();
  };

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "Upcoming", label: "Upcoming" },
    { value: "Active", label: "Active" },
    { value: "Completed", label: "Completed" }, 
  ];



  return (
    <section>
      <div className="flex justify-end items-center mb-4">
        <Button
          onClickHandler={() => setIsModalOpen(true)}
          additionalClasses="bg-accent text-white"
        >
          Add Category
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="w-full lg:w-1/3">
          <SearchBar
            placeholder="Search category..."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown
            options={categoryOptions}
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          />
          <FilterDropdown
            options={categoryOptions}
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          />
        </div>
      </div>

      <CategoriesListView
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <UpdateCategoryModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedCategory(null); fetchCategories(); }}
        initialData={selectedCategory}
      />
      <DeleteCategoryModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedCategory(null); }}
        onConfirm={handleDeleteConfirm}
        categoryName={selectedCategory?.name}
        loading={deleteLoading}
      />
    </section>
  );
};

export default CategoriesMainView;

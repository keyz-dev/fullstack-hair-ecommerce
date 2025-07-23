import React from "react";
import { useCategory } from "../../hooks";

const Categories = () => {
  const { categories, loading, error } = useCategory();

  if (loading) return <div className="text-center py-8">Loading categories...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-24 h-24 object-cover rounded-full mb-3"
            />
            <span className="font-semibold text-lg">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
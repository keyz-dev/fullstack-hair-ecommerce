import React from "react";
import { useCategory } from "../../hooks";

const Categories = () => {
  const { categories, loading, error } = useCategory();

  if (loading) return <div className="text-center py-8">Loading categories...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <section className="container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center justify-center lg:flex lg:items-center lg:justify-center">
      {categories.map((category, index) => (
        <div key={index} className="flex flex-col gap-4 justify-center items-center">
          <div className="size-[140px] sm:size-[200px] p-2 border-4 border-accent">
            <div className="h-full w-full border-4 border-accent grid place-items-center">
              <img 
                src={category.image} 
                alt={category.name} 
                className="size-20 sm:size-36 object-contain"
              />
            </div>
          </div>
          <p className="text-base font-semibold">
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </p>
        </div>
      ))}
    </section>
  );
};

export default Categories;

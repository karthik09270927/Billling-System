import { createContext, PropsWithChildren, useContext, useState } from "react";

const CategoryContext = createContext<any>(null);

export const CategoryProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Category name
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // Category ID
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [isSubCategoriesLoading, setIsSubCategoriesLoading] = useState<boolean>(false);

  console.log("Selected Category Name:", selectedCategory);
  console.log("Selected Category ID:", selectedCategoryId);
  console.log("Subcategories:", subCategories);

  return (
    <CategoryContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectedCategoryId,
        setSelectedCategoryId,
        subCategories,
        setSubCategories,
        isSubCategoriesLoading,
        setIsSubCategoriesLoading,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);

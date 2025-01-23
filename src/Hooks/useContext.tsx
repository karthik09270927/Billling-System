import React, { createContext, useState, useContext } from "react";


interface CategoryContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}



const CategoryContext = createContext<CategoryContextType>({
  selectedCategory: "All Menu",
  setSelectedCategory: () => {},
});


export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Menu");

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};


export const useCategory = () => useContext(CategoryContext);

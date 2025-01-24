import { createContext, PropsWithChildren, useContext, useState } from "react";

const CategoryContext = createContext<any>(null);

export const CategoryProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  return (
      <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory, subCategories, setSubCategories }}>
          {children}
      </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);

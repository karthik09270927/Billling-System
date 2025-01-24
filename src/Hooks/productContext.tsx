import React, { createContext, useContext, useState } from 'react';

interface SelectedItemsContextProps {
  selectedItems: any[];
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const SelectedItemsContext = createContext<SelectedItemsContextProps | undefined>(undefined);

export const SelectedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  return (
    <SelectedItemsContext.Provider value={{ selectedItems, setSelectedItems }}>
      {children}
    </SelectedItemsContext.Provider>
  );
};

export const useSelectedItems = () => {
  const context = useContext(SelectedItemsContext);
  if (!context) {
    throw new Error('useSelectedItems must be used within a SelectedItemsProvider');
  }
  return context;
};

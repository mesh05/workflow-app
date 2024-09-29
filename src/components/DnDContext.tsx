import { createContext, useContext, useState } from "react";

const DnDContext = createContext([null, (_) => {}]);

export const DnDProvider = ({ children }: { children: React.ReactNode }) => {
  const [type, setType] = useState(null);

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
};

export function useDnD() {
  return useContext(DnDContext);
}

export default DnDContext;

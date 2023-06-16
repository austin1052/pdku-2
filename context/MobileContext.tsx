import { useState, useEffect, createContext } from "react";

export const MobileContext = createContext<boolean | undefined>(undefined);

export function MobileContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(true);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    width && width > 768 ? setIsMobile(false) : setIsMobile(true);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  return (
    <MobileContext.Provider value={isMobile}>{children}</MobileContext.Provider>
  );
}

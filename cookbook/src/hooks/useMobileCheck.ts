import { useEffect, useState } from "react";

const useMobileCheck = (): boolean => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  const isMobile = screenWidth <= 768;
  return isMobile;
};

export default useMobileCheck;

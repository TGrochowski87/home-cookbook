import { Outlet } from "react-router-dom";

const MainPageLayout = () => {
  return (
    <div>
      <h1>Page Selector</h1>
      <Outlet />
    </div>
  );
};

export default MainPageLayout;

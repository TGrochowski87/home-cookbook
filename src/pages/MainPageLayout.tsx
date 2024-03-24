import { Outlet } from "react-router-dom";
import PageSwitch from "./PageSwitch";
import "./styles.less";

const MainPageLayout = () => {
  return (
    <div className="main-page-layout centered-column-layout">
      <PageSwitch />
      <Outlet />
    </div>
  );
};

export default MainPageLayout;

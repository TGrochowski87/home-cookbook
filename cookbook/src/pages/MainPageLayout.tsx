import { Outlet } from "react-router-dom";
import PageSwitch from "./PageSwitch";
import "./styles.less";

const MainPageLayout = () => {
  return (
    <div className="page main-page">
      <PageSwitch />
      <Outlet />
    </div>
  );
};

export default MainPageLayout;

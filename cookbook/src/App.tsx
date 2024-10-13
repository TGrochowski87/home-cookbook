import { Outlet } from "react-router-dom";
import "./App.less";

// TODO: Tests

function App() {
  return (
    <div className="app">
      <Outlet />
    </div>
  );
}

export default App;


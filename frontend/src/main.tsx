import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import { AlertStackContextProvider } from "components/alert/AlertStack";
import router from "./router";
import { Provider } from "react-redux";
import store from "storage/redux/store";

localStorage.clear();
sessionStorage.clear();

// TODO: Tests

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Tooltip.Provider>
        <AlertStackContextProvider>
          <RouterProvider router={router} />
        </AlertStackContextProvider>
      </Tooltip.Provider>
    </Provider>
  </React.StrictMode>
);

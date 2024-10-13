import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import { AlertStackContextProvider } from "components/alert/AlertStack";
import router from "./router";

// TODO: Tests

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Tooltip.Provider>
      <AlertStackContextProvider>
        <RouterProvider router={router} />
      </AlertStackContextProvider>
    </Tooltip.Provider>
  </React.StrictMode>
);

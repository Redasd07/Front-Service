import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "@/routes";

export function ClientLayout() {
  return (
    <div className="min-h-screen w-full">
      <Routes>
        {routes
          .filter((route) => route.layout === "client")
          .flatMap((route) =>
            route.pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))
          )}
      </Routes>
    </div>
  );
}

export default ClientLayout;

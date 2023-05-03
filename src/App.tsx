import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
//components
import Loading from "./components/Loading";
// page
const TodoPage = lazy(() => import("./pages/TodoPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <main className="App">
          <Routes>
            <Route path="/" element={<TodoPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </Suspense>
    </BrowserRouter>
  );
}

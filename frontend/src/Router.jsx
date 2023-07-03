import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;

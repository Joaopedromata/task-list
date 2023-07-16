import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import CreateUser from "./pages/CreateUser";
import Boards from "./pages/Boards";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="boards/:id/tasks" element={<Tasks />} />
        <Route path="create-user" element={<CreateUser />} />
        <Route path="boards" element={<Boards />} />
        <Route path="*" element={<Navigate to="boards" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;

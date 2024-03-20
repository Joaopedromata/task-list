import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import CreateUser from "./pages/CreateUser";
import Boards from "./pages/Boards";
import Habits from "./pages/Habits";
import CreateHabit from "./pages/CreateHabit";
import HabitDay from "./pages/HabitDay";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="boards/:id/tasks" element={<Tasks />} />
        <Route path="create-user" element={<CreateUser />} />
        <Route path="boards" element={<Boards />} />
        <Route path="habits" element={<Habits />} />
        <Route path="create-habit" element={<CreateHabit />} />
        <Route path="habits/:dayId" element={<HabitDay />} />
        <Route path="*" element={<Navigate to="boards" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;

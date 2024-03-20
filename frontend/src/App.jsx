import "./App.css";
import Router from "./Router";
import { ToastContainer } from "react-toastify";
import "./services/dayjs";

function App() {
  return (
    <>
      <ToastContainer theme="dark" />
      <Router />
    </>
  );
}

export default App;

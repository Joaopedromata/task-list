import { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Boards() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    axios
      .get(import.meta.env.VITE_API_URL + "/boards", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setBoards(response.data);
      })
      .catch((error) => console.log(error));
  }, [token]);

  return (
    <>
      <div class="header">
        <div class="title">Boards</div>
        <div class="logout">Logout</div>
      </div>
      <div class="container">
        <ul class="board-list">
          {boards.map((board) => (
            <li key={board.id}>
              <div class="board-info">
                <span>{board.name}</span>
                <div class="board-users">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Boards;

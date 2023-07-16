import { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Boards() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [boards, setBoards] = useState([]);
  const [inputValue, setInputValue] = useState("");

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

  function handleSubmit(e) {
    e.preventDefault();

    if (inputValue.trim() === "") {
      return;
    }

    axios
      .post(
        import.meta.env.VITE_API_URL + "/boards",
        { name: inputValue },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
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
        return;
      })
      .catch((error) => {
        console.log(error);
      });

    setInputValue("");
  }

  return (
    <>
      <div className="header">
        <div className="title">Boards</div>
        <div className="logout">Logout</div>
      </div>
      <div className="container">
        <form className="form" onSubmit={(event) => handleSubmit(event)}>
          <input
            placeholder="Novo Quadro"
            onChange={(event) => setInputValue(event.target.value)}
            value={inputValue}
          />
          <button>Novo Quadro</button>
        </form>
        <ul className="board-list">
          {boards.map((board) => (
            <li
              key={board.id}
              onClick={() => navigate(`/boards/${board.id}/tasks`)}
            >
              <div className="board-info">
                <span>{board.name}</span>
                <div className="board-users">
                  {board.users.map((user) => (
                    <span key={user.id}></span>
                  ))}
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

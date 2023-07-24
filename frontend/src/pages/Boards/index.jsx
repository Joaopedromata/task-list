import { Fragment, useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import plus from "../../assets/plus.svg";
import minus from "../../assets/minus.svg";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { useAuth } from "../../hooks/useAuth";

function Boards() {
  const navigate = useNavigate();
  const token = useAuth();

  const [newUserInputValue, setNewUserInputValue] = useState("");
  const [boards, setBoards] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editInputValue, setEditInputValue] = useState({
    isOpen: false,
    id: "",
    value: "",
  });
  const [userManager, setUserManager] = useState({
    isOpen: false,
    id: "",
  });

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

  function getInitialCharacterFromName(name) {
    const words = name.trim().split(/\s+/);

    if (words.length >= 2) {
      const firstNameFirstCharacter = words[0].charAt(0);
      const secondNameFirstCharacter = words[1].charAt(0);

      return (firstNameFirstCharacter + secondNameFirstCharacter).toUpperCase();
    } else {
      const firstNameFirstCharacter = words[0].charAt(0).toUpperCase();
      return firstNameFirstCharacter;
    }
  }

  function handleEdit(id) {
    axios
      .patch(
        import.meta.env.VITE_API_URL + "/boards/" + id,
        { name: editInputValue.value },
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
            setEditInputValue({
              id: "",
              isOpen: false,
              value: "",
            });
          })
          .catch((error) => console.log(error));
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleAddUser(e, id) {
    e.preventDefault();

    axios
      .post(
        import.meta.env.VITE_API_URL + "/boards/" + id + "/user",
        { email: newUserInputValue },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        setUserManager({
          id: "",
          isOpen: false,
        });

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
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteBoard(id) {
    axios
      .delete(import.meta.env.VITE_API_URL + "/boards/" + id, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
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
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <Header title="Quadros" />
      <div className="container">
        <form className="form" onSubmit={(event) => handleSubmit(event)}>
          <Input
            placeholder="Novo Quadro"
            onChange={(event) => setInputValue(event.target.value)}
            value={inputValue}
          />
          <Button>Novo Quadro</Button>
        </form>
        <ul className="board-list">
          {boards.map((board) => (
            <Fragment key={board.id}>
              <li>
                <div className="board-info">
                  {editInputValue.isOpen && editInputValue.id === board.id ? (
                    <input
                      className="board-info__input"
                      value={editInputValue.value}
                      autoFocus
                      onChange={(e) =>
                        setEditInputValue({
                          ...editInputValue,
                          value: e.target.value,
                        })
                      }
                      onBlur={() => handleEdit(board.id)}
                    />
                  ) : (
                    <span onClick={() => navigate(`/boards/${board.id}/tasks`)}>
                      {board.name}
                    </span>
                  )}
                  <div className="board-users">
                    {board.users.map((user) => (
                      <a key={user.id} title={user.name}>
                        {getInitialCharacterFromName(user.name)}
                      </a>
                    ))}
                    <a
                      onClick={() =>
                        setUserManager({
                          isOpen: !userManager.isOpen,
                          id: board.id,
                        })
                      }
                    >
                      <img
                        src={
                          userManager.isOpen && board.id === userManager.id
                            ? minus
                            : plus
                        }
                      />
                    </a>
                  </div>
                  <div className="board-info__buttons">
                    <Button
                      variant={
                        editInputValue.isOpen && editInputValue.id === board.id
                          ? ""
                          : "secondary"
                      }
                      onClick={() =>
                        setEditInputValue({
                          id: board.id,
                          isOpen: !editInputValue.isOpen,
                          value: board.name,
                        })
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      variant="error"
                      onClick={() => deleteBoard(board.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </li>
              {userManager.isOpen && userManager.id === board.id && (
                <li>
                  <form
                    className="form board"
                    onSubmit={(e) => handleAddUser(e, board.id)}
                  >
                    <Input
                      placeholder="Digite o email do convidado"
                      type="email"
                      onChange={(e) => setNewUserInputValue(e.target.value)}
                    />
                    <Button>Adicionar</Button>
                  </form>
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Boards;

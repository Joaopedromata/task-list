import { Fragment, useEffect, useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import plus from "../../assets/plus.svg";
import minus from "../../assets/minus.svg";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Header from "../../components/Header";
import trash from "../../assets/trash.svg";
import edit from "../../assets/edit.svg";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import AutocompleteInput from "../../components/AutoCompleteInput";
import { toast } from "react-toastify";

function Boards() {
  const toastLoading = () => toast.loading("Carregando...");
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

    toastLoading();
    api
      .get("/boards")
      .then((response) => {
        toast.dismiss();
        setBoards(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  function handleSubmit(e) {
    e.preventDefault();

    if (inputValue.trim() === "") {
      return;
    }

    toastLoading();
    api
      .post("/boards", { name: inputValue })
      .then(() => {
        api
          .get("/boards", {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            toast.dismiss();
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
    api
      .patch("/boards/" + id, { name: editInputValue.value })
      .then(() => {
        api
          .get("/boards")
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

    api
      .post(
        "/boards/" + id + "/users/" + newUserInputValue,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setUserManager({
          id: "",
          isOpen: false,
        });

        api
          .get("/boards")
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
    toastLoading();
    api
      .delete("/boards/" + id)
      .then(() => {
        api
          .get("/boards", {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            toast.dismiss();
            setBoards(response.data);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }

  async function getAutocompleteOptions(searchTerm) {
    return await api
      .get("/users", {
        params: {
          email: searchTerm,
        },
      })
      .then((response) => {
        console.log(
          response.data.map((user) => ({
            value: user.id,
            item: user.email,
          }))
        );

        return response.data.map((user) => ({
          value: user.id,
          item: user.email,
        }));
      })
      .catch((error) => console.log(error));
  }

  const getPorcentage = (total, part) => {
    return (part / total) * 100 || 0;
  };

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
        <li className="board-list">
          {boards.map((board) => (
            <Fragment key={board.id}>
              <div className="goal-card">
                <div className="goal-card__header">
                  {editInputValue.isOpen && editInputValue.id === board.id ? (
                    <input
                      className="goal-card__title--input"
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
                    <h6
                      className="goal-card__title"
                      onClick={() => navigate(`/boards/${board.id}/tasks`)}
                    >
                      {board.name}
                    </h6>
                  )}
                  <div className="goal-card__header___icons">
                    <div>
                      <img
                        src={edit}
                        onClick={() =>
                          setEditInputValue({
                            id: board.id,
                            isOpen: !editInputValue.isOpen,
                            value: board.name,
                          })
                        }
                      />
                    </div>
                    <div>
                      <img src={trash} onClick={() => deleteBoard(board.id)} />
                    </div>
                  </div>
                </div>
                <div className="goal-card__users">
                  {board.users.map((user) => (
                    <a
                      key={user.id}
                      title={user.name}
                      className="goal-card__name-acronym"
                    >
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
                <div className="goal-card__progress-bar___wrapper">
                  <div className="goal-card__progress-bar___title____wrapper">
                    <p className="goal-card__progress-bar___title">Progresso</p>
                    <span className="goal-card__progress-bar___progress">
                      <small>
                        {getPorcentage(
                          board.totalTasks,
                          board.completedTasks
                        ).toFixed(0)}
                        %
                      </small>
                      {board.completedTasks}/{board.totalTasks}
                    </span>
                  </div>
                  <div className="goal-card__progress-bar__background">
                    <div
                      className="goal-card__progress-bar"
                      style={{
                        width: `${getPorcentage(
                          board.totalTasks,
                          board.completedTasks
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              {userManager.isOpen && userManager.id === board.id && (
                <div className="goal-card__new-user">
                  <form
                    className="form board"
                    onSubmit={(e) => handleAddUser(e, board.id)}
                  >
                    <AutocompleteInput
                      placeholder="Novo usuário"
                      onChange={(_, id) => setNewUserInputValue(id)}
                      getAutocompleteOptions={getAutocompleteOptions}
                    />
                    <Button>Adicionar</Button>
                  </form>
                </div>
              )}
            </Fragment>
          ))}
        </li>
      </div>
    </>
  );
}

export default Boards;

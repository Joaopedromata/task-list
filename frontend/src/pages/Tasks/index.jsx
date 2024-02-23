import "./styles.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import api from "../../services/api";
import Header from "../../components/Header";
import moreVertical from "../../assets/more-vertical.svg";
import chevronDown from "../../assets/chevron-down.svg";
import chevronUp from "../../assets/chevron-up.svg";
import check from "../../assets/check.svg";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [board, setBoard] = useState({
    uuid: "",
    name: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const { id } = useParams();
  const [boards, setBoards] = useState({
    isOpen: false,
    taskId: "",
    items: [],
  });
  const [floatingMenu, setFloatingMenu] = useState({
    isOpen: false,
    id: "",
  });
  const navigate = useNavigate();

  const [token, setToken] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (filter === "all") {
      api
        .get("/boards/" + id + "/tasks")
        .then((response) => {
          setTasks(response.data.tasks);
          setBoard({ uuid: response.data.uuid, name: response.data.name });
        })
        .catch((error) => console.log(error));
      return;
    }
    if (filter === "pending") {
      api
        .get("/boards/" + id + "/tasks/pending")
        .then(
          (response) => {
            setTasks(response.data.tasks);
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .catch((error) => console.log(error));
      return;
    }

    if (filter === "completed") {
      api
        .get("/boards/" + id + "/tasks/completed")
        .then((response) => {
          setTasks(response.data.tasks);
        })
        .catch((error) => console.log(error));
      return;
    }
  }, [filter, token]);

  function addTask(event) {
    event.preventDefault();

    if (inputValue.trim() === "") {
      return;
    }

    api
      .post("/tasks", { name: inputValue, board_id: id })
      .then(() => {
        api
          .get("/boards/" + id + "/tasks")
          .then((response) => {
            setTasks(response.data.tasks);
          })
          .catch((error) => console.log(error));
        return;
      })
      .catch((error) => {
        console.log(error);
      });

    setInputValue("");
  }

  function handleChange(event) {
    setInputValue(event.target.value);
  }

  function deleteTask(id) {
    api
      .delete("/tasks/" + id)
      .then(() => {
        const filteredTasks = tasks.filter((task) => task.uuid !== id);
        setTasks(filteredTasks);
      })
      .catch((error) => console.log(error));
  }

  function completeTask(taskId) {
    api
      .patch("/tasks/" + taskId + "/completed", {})
      .then(() => {
        api
          .get("/boards/" + id + "/tasks")
          .then((response) => {
            setTasks(response.data.tasks);
            setFloatingMenu({
              id: "",
              isOpen: false,
            });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }

  function handleBoards(taskId, boardId) {
    if (boards.isOpen) {
      return setBoards({
        items: [],
        isOpen: false,
        taskId: "",
      });
    }

    api
      .get("/boards")
      .then((response) => {
        const filterBoards = response.data.filter(
          (board) => board.id !== boardId
        );

        setBoards({
          items: filterBoards,
          isOpen: true,
          taskId,
        });
      })
      .catch((error) => console.log(error));
  }

  function joinTaskBoard(taskId, boardId) {
    api
      .post(
        `/boards/${boardId}/tasks/${taskId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setFloatingMenu({
          id: "",
          isOpen: false,
        });
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <Header title={board.name} backTo="/boards" />
      <div className="container">
        <form className="form" onSubmit={(event) => addTask(event)}>
          <Input
            placeholder="Nova Tarefa"
            onChange={(event) => handleChange(event)}
            value={inputValue}
          />
          <Button>Nova Tarefa</Button>
        </form>

        <div className="filters">
          <Button
            variant={filter !== "all" ? "secondary" : ""}
            onClick={() => setFilter("all")}
          >
            Todas
          </Button>
          <Button
            variant={filter !== "pending" ? "secondary" : ""}
            onClick={() => setFilter("pending")}
          >
            Pendentes
          </Button>
          <Button
            variant={filter !== "completed" ? "secondary" : ""}
            onClick={() => setFilter("completed")}
          >
            Completas
          </Button>
        </div>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-list__item">
              <label className="container-checkbox">
                <div className="checkbox-label">{task.name}</div>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => completeTask(task.id)}
                />
                <span className="checkmark">
                  <img src={check} className="checkmark__icon" />
                </span>
              </label>
              <img
                className="task-list__item___more"
                src={moreVertical}
                onClick={() =>
                  setFloatingMenu({
                    id: task.id,
                    isOpen: true,
                  })
                }
              />
              {floatingMenu.isOpen && floatingMenu.id === task.id && (
                <ul className="task-list__floating-menu">
                  <li
                    className="task-list__floating-menu___item"
                    onClick={() => handleBoards(task.id, id)}
                  >
                    <span>Vincular à</span>
                    {boards.isOpen ? (
                      <img src={chevronUp} />
                    ) : (
                      <img src={chevronDown} />
                    )}
                  </li>
                  {boards.isOpen &&
                    boards.taskId === task.id &&
                    boards.items.map((board) => (
                      <li
                        key={board.id}
                        className="task-list__floating-menu___item boards"
                        onClick={() => joinTaskBoard(task.id, board.id)}
                      >
                        <span>{board.name}</span>
                      </li>
                    ))}
                  <li
                    className="task-list__floating-menu___item"
                    onClick={() => deleteTask(task.uuid)}
                  >
                    <span>Excluir tarefa</span>
                  </li>
                  <li
                    className="task-list__floating-menu___item"
                    onClick={() =>
                      setFloatingMenu({
                        id: "",
                        isOpen: false,
                      })
                    }
                  >
                    <span>Fechar</span>
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Tasks;

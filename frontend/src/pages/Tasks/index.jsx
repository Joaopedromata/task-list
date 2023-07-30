import "./styles.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import api from "../../services/api";
import Header from "../../components/Header";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const { id } = useParams();
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
          setTasks(response.data);
        })
        .catch((error) => console.log(error));
      return;
    }
    if (filter === "pending") {
      api
        .get("/boards/" + id + "/tasks/pending")
        .then(
          (response) => {
            setTasks(response.data);
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
          setTasks(response.data);
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
            setTasks(response.data);
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
        const filteredTasks = tasks.filter((task) => task.id !== id);
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
            setTasks(response.data);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <Header title="Tarefas" />
      <div className="container">
        <Button onClick={() => navigate("/boards")}>Voltar</Button>
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
            <li key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => completeTask(task.id)}
              />
              <span>{task.name}</span>
              <Button variant="error" onClick={() => deleteTask(task.id)}>
                Deletar
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Tasks;

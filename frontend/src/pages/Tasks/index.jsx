import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
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
      axios
        .get(import.meta.env.VITE_API_URL + "/boards/" + id + "/tasks", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          setTasks(response.data);
        })
        .catch((error) => console.log(error));
      return;
    }
    if (filter === "pending") {
      axios
        .get(
          import.meta.env.VITE_API_URL + "/boards/" + id + "/tasks/pending",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
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
      axios
        .get(
          import.meta.env.VITE_API_URL + "/boards/" + id + "/tasks/completed",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
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

    axios
      .post(
        import.meta.env.VITE_API_URL + "/tasks",
        { name: inputValue, board_id: id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        axios
          .get(import.meta.env.VITE_API_URL + "/boards/" + id + "/tasks", {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
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
    axios
      .delete(import.meta.env.VITE_API_URL + "/tasks/" + id, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        const filteredTasks = tasks.filter((task) => task.id !== id);
        setTasks(filteredTasks);
      })
      .catch((error) => console.log(error));
  }

  function completeTask(taskId) {
    axios
      .patch(
        import.meta.env.VITE_API_URL + "/tasks/" + taskId + "/completed",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        axios
          .get(import.meta.env.VITE_API_URL + "/boards/" + id + "/tasks", {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
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

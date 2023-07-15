import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
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
        .get(import.meta.env.VITE_API_URL + "/tasks", {
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
        .get(import.meta.env.VITE_API_URL + "/tasks/pending", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
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
        .get(import.meta.env.VITE_API_URL + "/tasks/completed", {
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
  }, [filter, token]);

  function addTask(event) {
    event.preventDefault();

    if (inputValue.trim() === "") {
      return;
    }

    axios
      .post(
        import.meta.env.VITE_API_URL + "/tasks",
        { name: inputValue },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        axios
          .get(import.meta.env.VITE_API_URL + "/tasks", {
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

  function completeTask(id) {
    axios
      .patch(
        import.meta.env.VITE_API_URL + "/tasks/" + id + "/completed",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        axios
          .get(import.meta.env.VITE_API_URL + "/tasks", {
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

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <>
      <header className="header">
        <h1 className="title">Lista de Tarefas</h1>
        <h3 className="logout" onClick={handleLogout}>
          logout
        </h3>
      </header>
      <div className="container">
        <form className="form" onSubmit={(event) => addTask(event)}>
          <input
            placeholder="Nova Tarefa"
            onChange={(event) => handleChange(event)}
            value={inputValue}
          />
          <button>Nova Tarefa</button>
        </form>

        <div className="filters">
          <button
            className={filter === "all" ? "selected" : ""}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>
          <button
            className={filter === "pending" ? "selected" : ""}
            onClick={() => setFilter("pending")}
          >
            Pendentes
          </button>
          <button
            className={filter === "completed" ? "selected" : ""}
            onClick={() => setFilter("completed")}
          >
            Completas
          </button>
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
              <button onClick={() => deleteTask(task.id)}>Deletar</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Tasks;

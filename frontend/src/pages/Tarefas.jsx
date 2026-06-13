import { useState, useEffect } from "react";
import axios from "axios";
import "../style/Tarefas.css";

export default function Tarefas() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  useEffect(() => {
    axios.get("/api/tasks", authHeader()).then((r) => setTasks(r.data));
  }, []);

  const toggleTask = async (id, done) => {
    const { data } = await axios.patch(
      `/api/tasks/${id}`,
      { done: !done },
      authHeader()
    );
    setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`/api/tasks/${id}`, authHeader());
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const { data } = await axios.post(
      "/api/tasks",
      { text: newTaskText },
      authHeader()
    );
    setTasks((prev) => [...prev, data]);
    setNewTaskText("");
  };

  const pending = tasks.filter((t) => !t.done).length;

  return (
    <div className="tarefas-page">
      <header className="tarefas-header">
        <div>
          <h1>Minhas Tarefas</h1>
          <p>{pending} pendente{pending !== 1 ? "s" : ""}</p>
        </div>
      </header>

      <form onSubmit={handleAddTask} className="tarefas-add-form">
        <input
          type="text"
          placeholder="Adicionar nova tarefa..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>

      <div className="tarefas-list">
        {tasks.length === 0 && (
          <p className="tarefas-empty">Nenhuma tarefa ainda. Adicione uma acima!</p>
        )}

        {tasks.filter((t) => !t.done).map((task) => (
          <div className="tarefa-item" key={task._id}>
            <button
              className="tarefa-checkbox"
              onClick={() => toggleTask(task._id, task.done)}
              aria-label="Marcar como concluída"
            />
            <span className="tarefa-text">{task.text}</span>
            <button
              className="tarefa-delete"
              onClick={() => deleteTask(task._id)}
              aria-label="Remover tarefa"
            >
              ✕
            </button>
          </div>
        ))}

        {tasks.some((t) => t.done) && (
          <>
            <p className="tarefas-section-label">Concluídas</p>
            {tasks.filter((t) => t.done).map((task) => (
              <div className="tarefa-item done" key={task._id}>
                <button
                  className="tarefa-checkbox checked"
                  onClick={() => toggleTask(task._id, task.done)}
                  aria-label="Desmarcar tarefa"
                />
                <span className="tarefa-text">{task.text}</span>
                <button
                  className="tarefa-delete"
                  onClick={() => deleteTask(task._id)}
                  aria-label="Remover tarefa"
                >
                  ✕
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
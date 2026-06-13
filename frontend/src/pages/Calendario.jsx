import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../style/Calendario.css";

export default function Calendario() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [compromissos, setCompromissos] = useState({});
  const [modal, setModal] = useState(null); // { dateKey, label }
  const [inputValue, setInputValue] = useState("");

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  useEffect(() => {
    axios.get("/api/events", authHeader()).then(({ data }) => {
      const map = {};
      data.forEach((e) => { map[e.date] = { _id: e._id, title: e.title }; });
      setCompromissos(map);
    });
  }, []);

  const handleDayClick = (value) => {
    const dateKey = value.toISOString().split("T")[0];
    const label = value.toLocaleDateString("pt-BR", {
      weekday: "long", day: "numeric", month: "long",
    });
    setInputValue(compromissos[dateKey]?.title || "");
    setModal({ dateKey, label });
  };

  const handleSave = async () => {
    if (!inputValue.trim()) return;
    const { data } = await axios.post(
      "/api/events",
      { date: modal.dateKey, title: inputValue.trim() },
      authHeader()
    );
    setCompromissos((prev) => ({
      ...prev,
      [modal.dateKey]: { _id: data._id, title: data.title },
    }));
    setModal(null);
  };

  const handleDelete = async () => {
    const evento = compromissos[modal.dateKey];
    if (!evento) return;
    await axios.delete(`/api/events/${evento._id}`, authHeader());
    setCompromissos((prev) => {
      const next = { ...prev };
      delete next[modal.dateKey];
      return next;
    });
    setModal(null);
  };

  const renderTileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dateKey = date.toISOString().split("T")[0];
    const evento = compromissos[dateKey];
    return evento
      ? <div className="react-cal-event">{evento.title}</div>
      : null;
  };

  return (
    <div className="calendario-page-container">
      <header className="calendario-header">
        <h1>Calendário Acadêmico</h1>
        <p>Clique em qualquer dia para adicionar um evento.</p>
      </header>

      <div className="apple-calendar-wrapper">
        <Calendar
          onChange={setDataSelecionada}
          value={dataSelecionada}
          onClickDay={handleDayClick}
          tileContent={renderTileContent}
          locale="pt-BR"
        />
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal.label}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>

            <label className="modal-label">Título do evento</label>
            <input
              className="modal-input"
              type="text"
              placeholder="Ex: Prova de Cálculo, Entrega de TCC..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />

            <div className="modal-actions">
              {compromissos[modal.dateKey] && (
                <button className="btn-delete" onClick={handleDelete}>
                  Remover
                </button>
              )}
              <button className="btn-cancel" onClick={() => setModal(null)}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSave}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
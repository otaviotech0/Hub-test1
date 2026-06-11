import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../style/Calendario.css";

export default function Calendario() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [compromissos, setCompromissos] = useState({});

  const handleDayClick = (value) => {
    const dataChave = value.toISOString().split("T")[0];
    const nomeCompromisso = prompt(
      `Adicionar evento para o dia ${value.getDate()}/${value.getMonth() + 1}:`
    );

    if (nomeCompromisso && nomeCompromisso.trim() !== "") {
      setCompromissos((prev) => ({
        ...prev,
        [dataChave]: nomeCompromisso,
      }));
    }
  };

  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const dataChave = date.toISOString().split("T")[0];
      const eventoDoDia = compromissos[dataChave];
      return eventoDoDia ? (
        <div className="react-cal-event">{eventoDoDia}</div>
      ) : null;
    }
  };

  return (
    <div className="calendario-page-container">
      <header className="calendario-header">
        <h1>Calendário Acadêmico</h1>
        <p>
          Selecione qualquer dia para agendar suas provas ou trabalhos de
          faculdade.
        </p>
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
    </div>
  );
}

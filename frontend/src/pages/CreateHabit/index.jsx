import DefaultPage from "../../components/DefaultPage";
import Input from "../../components/Input";
import "./styles.css";
import Checkbox from "../../components/Checkbox";
import Button from "../../components/Button";
import { useState } from "react";
import api from "../../services/api";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const CreateHabit = () => {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState([]);

  const handleCreateHabit = async (event) => {
    event.preventDefault();

    if (!title || weekDays.length === 0) {
      return;
    }

    await api.post("habits", {
      title,
      week_days: weekDays,
    });

    setTitle("");
    setWeekDays([]);

    alert("Hábito criado com sucesso");
  };

  const handleToggleWeekDay = (weekDay) => {
    if (weekDays.includes(weekDay)) {
      const weekDaysWithRemoveOne = weekDays.filter((day) => day !== weekDay);
      setWeekDays(weekDaysWithRemoveOne);
    } else {
      const weekDaysWithAddedOne = [...weekDays, weekDay];
      setWeekDays(weekDaysWithAddedOne);
    }
  };

  return (
    <DefaultPage title="Novo Hábito">
      <form className="create-habit-container" onSubmit={handleCreateHabit}>
        <div className="create-habit-label">Qual seu comprometimento?</div>
        <Input
          value={title}
          placeholder="ex.: Exercícios, dormir bem, etc..."
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="create-habit-label">Qual a recorrência?</div>
        <div className="create-habit-week-days">
          {availableWeekDays.map((weekDay, index) => (
            <Checkbox
              key={index}
              label={weekDay}
              checked={weekDays?.includes(index)}
              onChange={() => handleToggleWeekDay(index)}
            />
          ))}
        </div>
        <Button type="submit">Confirmar</Button>
      </form>
    </DefaultPage>
  );
};

export default CreateHabit;

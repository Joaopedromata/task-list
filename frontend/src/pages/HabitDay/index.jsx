import "./styles.css";
import DefaultPage from "../../components/DefaultPage";
import Checkbox from "../../components/Checkbox";

const HabitDay = () => {
  const getPorcentage = (total, part) => {
    return (part / total) * 100 || 0;
  };

  return (
    <DefaultPage title="Hábito" backTo="/habits">
      <div className="habit-day-container">
        <h6 className="habit-day-week-day">segunda-feira</h6>
        <h2 className="habit-day-day">01/01/2024</h2>
        <div className="habit-day__progress-bar__background">
          <div
            className="habit-day__progress-bar"
            style={{
              width: `${getPorcentage(100, 70)}%`,
            }}
          ></div>
        </div>
        <div className="habit-day__items">
          <Checkbox label="Beber 2L de água" />
          <Checkbox label="Beber 2L de água" />
          <Checkbox label="Beber 2L de água" />
          <Checkbox label="Beber 2L de água" />
          <Checkbox label="Beber 2L de água" />
          <Checkbox label="Beber 2L de água" />
        </div>
      </div>
    </DefaultPage>
  );
};

export default HabitDay;

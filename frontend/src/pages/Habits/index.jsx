import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import DefaultPage from "../../components/DefaultPage";
import "./styles.css";

const Habits = () => {
  const navigate = useNavigate();
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <DefaultPage title="Hábitos">
      <div className="habits-container">
        <div className="habits-header">
          <Button onClick={() => navigate("/create-habit")}>Novo Hábito</Button>
        </div>
        <div className="habits-days-wrapper">
          <div className="habits-week-days">
            {weekDays.map((weekDay, index) => (
              <div key={`${weekDay}-${index}`} className="habits-week-day">
                {weekDay}
              </div>
            ))}
          </div>
          <div className="habits-days">
            {Array.from({ length: 80 }).map((_, index) => (
              <div className="habits-day" key={index}></div>
            ))}
            {Array.from({ length: 20 }).map((_, index) => (
              <div className="habits-day off" key={index}></div>
            ))}
          </div>
        </div>
      </div>
    </DefaultPage>
  );
};

export default Habits;

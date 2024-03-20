import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import DefaultPage from "../../components/DefaultPage";
import "./styles.css";
import { generateDatesFromYearBegging } from "../../utils/datetime";
import api from "../../services/api";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const Habits = () => {
  const [summary, setSummary] = useState([]);
  const navigate = useNavigate();
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  const minimumSummaryDatesSize = 18 * 7;
  const summaryDates = generateDatesFromYearBegging();
  const amountOfDaysToFill =
    minimumSummaryDatesSize -
    summaryDates.length -
    dayjs(summaryDates[0]).add(3, "hours").day();

  useEffect(() => {
    api
      .get("summary")
      .then((response) => setSummary(response.data))
      .catch((error) => console.log({ error }));
  }, []);

  const getHabitColor = (amount, completed) => {
    const completedPercentage =
      amount > 0 ? Math.round((completed / amount) * 100) : 0;

    if (completedPercentage === 0) {
      return {
        background: "rgb(24 24 27)",
        borderColor: "rgb(39 39 42)",
      };
    } else if (completedPercentage > 0 && completedPercentage < 20) {
      return {
        background: "rgb(76 29 149)",
        borderColor: "rgb(109 40 217)",
      };
    } else if (completedPercentage >= 20 && completedPercentage < 40) {
      return {
        background: "rgb(91 33 182)",
        borderColor: "rgb(124 58 237)",
      };
    } else if (completedPercentage >= 40 && completedPercentage < 60) {
      return {
        background: "rgb(109 40 217)",
        borderColor: "rgb(139 92 246)",
      };
    } else if (completedPercentage >= 60 && completedPercentage < 80) {
      return {
        background: "rgb(124 58 237)",
        borderColor: "rgb(139 92 246)",
      };
    } else if (completedPercentage >= 80) {
      return {
        background: "rgb(139 92 246)",
        borderColor: "rgb(167 139 250)",
      };
    }
  };

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
            {dayjs(summaryDates[0]).add(3, "hours").day() !== 0 &&
              Array.from({
                length: dayjs(summaryDates[0]).add(3, "hours").day(),
              }).map((_, index) => (
                <div className="habits-day off" key={index}></div>
              ))}
            {summaryDates.map((date, index) => {
              const dayInSummary = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });

              const colors = getHabitColor(
                dayInSummary?.amount,
                dayInSummary?.completed
              );

              return (
                <button
                  className="habits-day"
                  style={{
                    borderColor: colors.borderColor,
                    background: colors.background,
                  }}
                  onClick={() => navigate(`/habits/${dayInSummary?.uuid}`)}
                  key={date.toString()}
                ></button>
              );
            })}
            {Array.from({ length: amountOfDaysToFill }).map((_, index) => (
              <div className="habits-day off" key={index}></div>
            ))}
          </div>
        </div>
      </div>
    </DefaultPage>
  );
};

export default Habits;

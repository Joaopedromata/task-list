import "./styles.css";
import DefaultPage from "../../components/DefaultPage";
import Checkbox from "../../components/Checkbox";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const HabitDay = () => {
  const { dayId } = useParams();
  const [habitsInfo, setHabitsInfo] = useState();

  const getPorcentage = (total, part) => {
    return (part / total) * 100 || 0;
  };

  useEffect(() => {
    if (dayId) {
      api
        .get(`day/${dayId}`)
        .then((response) => setHabitsInfo(response.data))
        .catch((error) => console.log({ error }));
    }
  }, [dayId]);

  const dayOfWeek = habitsInfo?.date
    ? dayjs(habitsInfo.date).add(3, "hours").format("dddd")
    : "";
  const dayMonthYear = habitsInfo?.date
    ? dayjs(habitsInfo.date).add(3, "hours").format("DD/MM/YYYY")
    : "";

  const toggleHabit = (habitId, dayId) => {
    const isHabitAlreadyCompleted =
      habitsInfo?.completed_habits?.includes(habitId);

    api
      .patch(`habits/${habitId}/day/${dayId}/toggle`, {})
      .then(() => {
        let completedHabits = [];

        if (isHabitAlreadyCompleted) {
          completedHabits = habitsInfo?.completed_habits.filter(
            (id) => id !== habitId
          );

          setHabitsInfo({
            ...habitsInfo,
            completed_habits: completedHabits,
          });
        } else {
          completedHabits = [...habitsInfo?.completed_habits, habitId];
        }

        setHabitsInfo({
          ...habitsInfo,
          completed_habits: completedHabits,
        });
      })
      .catch((error) => console.log({ error }));
  };

  return (
    <DefaultPage title="Hábito" backTo="/habits">
      <div className="habit-day-container">
        <h6 className="habit-day-week-day">{dayOfWeek}</h6>
        <h2 className="habit-day-day">{dayMonthYear}</h2>
        <div className="habit-day__progress-bar__background">
          <div
            className="habit-day__progress-bar"
            style={{
              width: `${getPorcentage(
                habitsInfo?.possible_habits?.length,
                habitsInfo?.completed_habits?.length
              )}%`,
            }}
          ></div>
        </div>
        <div className="habit-day__items">
          {habitsInfo?.possible_habits.map((habit) => (
            <Checkbox
              label={habit.title}
              key={habit.uuid}
              checked={habitsInfo?.completed_habits.find(
                (completed_habit) => completed_habit === habit.id
              )}
              onChange={() => toggleHabit(habit.id, habitsInfo.day_id)}
            />
          ))}
        </div>
      </div>
    </DefaultPage>
  );
};

export default HabitDay;

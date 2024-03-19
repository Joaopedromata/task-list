import check from "../../assets/check.svg";
import "./styles.css";

const Checkbox = (props) => {
  return (
    <div className="checkbox-container">
      <div className="checkbox-label">{props.label}</div>
      <label className="container-checkbox">
        <input
          type="checkbox"
          checked={props.checked}
          onChange={props.onChange}
        />
        <span className="checkmark">
          <img src={check} className="checkmark__icon" />
        </span>
      </label>
    </div>
  );
};

export default Checkbox;

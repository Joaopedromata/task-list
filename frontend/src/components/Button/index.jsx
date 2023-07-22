import "./styles.css";

function Button(props) {
  function getClassName(variant) {
    switch (variant) {
      case "secondary":
        return "button-secondary";
      case "error":
        return "button-error";
      default:
        return "";
    }
  }

  return (
    <button {...props} className={`button ${getClassName(props.variant)}`}>
      {props.children}
    </button>
  );
}

export default Button;

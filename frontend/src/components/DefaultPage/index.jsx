import "./styles.css";
import Header from "../Header";
import SideBar from "../SideBar";

const DefaultPage = ({ children, title, backTo }) => {
  return (
    <div className="page-container">
      <SideBar />
      <div className="page-wrapper">
        <Header title={title} backTo={backTo} />
        {children}
      </div>
    </div>
  );
};

export default DefaultPage;

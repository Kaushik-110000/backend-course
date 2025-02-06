import { useDispatch, useSelector } from "react-redux";
import { toggleStatus } from "../../store/toggleSlice.js";

function ToggleSlider({ ...at }) {
  const dispatch = useDispatch();
  const stat = useSelector((state) => state.toggle.status);

  const handleClick = () => {
    dispatch(toggleStatus());
    // console.log("Toggled State:", stat);
  };

  return (
    <div className={`cursor-pointer h-2 w-4`} {...at} onClick={handleClick}>
      <img src="/sideBar.svg" alt="Sidebar Toggle" />
    </div>
  );
}

export default ToggleSlider;

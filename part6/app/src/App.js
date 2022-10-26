import NewNote from "./components/NewNote";
import Notes from "./components/Note";
import VisibilityFilter from "./components/VisibilityFilter";
const App = () => {
  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  );
};
export default App;

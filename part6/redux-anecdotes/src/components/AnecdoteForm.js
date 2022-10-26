import { useDispatch } from "react-redux";
import { createVote } from "../reducers/anecdoteReducer";

const AnecdoteForm = (prop) => {
  const dispatch = useDispatch();
  const addVote = (event) => {
    event.preventDefault();
    const content = event.target.vote.value;
    event.target.vote.value = "";
    dispatch(createVote(content));
  };
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addVote}>
        <div>
          <input name="vote" />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};
export default AnecdoteForm;

import axios from 'axios';
import Talk from './components/Talk';
const Result = (props) => {
  return (
    <div>
      <h1>{props.winner.talk.title}</h1>
      <h2>is leading by {props.winner.votes} votes</h2>
    </div>
  );
};

Result.getInitialProps = async () => {
  const resp =  await axios.get('http://localhost:3000/api/winner');
  const winner = resp.data;

  return {
    winner,
  };
};

export default Result;

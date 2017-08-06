import axios from 'axios';
import Layout from './components/Layout';
const Result = (props) => {
  return (
    <Layout title="Winner">
      <div className="card winner-card">
        <h1>{props.winner.talk.title}</h1>
        <h2>is leading by {props.winner.votes} votes!</h2>
        <img src="../static/tada.png" alt=""/>
        <h3>
          Congratualtions to {props.winner.talk.authorName} !
        </h3>
      </div>
    </Layout>
  );
};

Result.getInitialProps = async () => {
  const resp =  await axios.get('http://localhost:3001/api/winner');
  const winner = resp.data;

  return {
    winner,
  };
};

export default Result;

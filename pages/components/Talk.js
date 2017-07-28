import React from 'react';
import PropTypes from 'prop-types';


export default function Talk(props) {
  const castVote = () => {
    props.castVote(props.talk.title)
  }
  const buttonText = props.voted ? 'You voted!' : 'Vote';
  return (
    <div className="talk-card">
      <h3>{props.talk.title}</h3>
      <p>{props.talk.description}</p>
      <a href={props.talk.slideLink}>Slide</a>
      <a href={props.talk.authorProfile}>By {props.talk.authorName}</a>
      <button onClick={castVote} disabled={props.voted}>
        {buttonText}
         {props.voted ? <a href="/winner">See who is winning!</a> : ''}
      </button>
    </div>
  );
}

Talk.propTypes = {
  talk: PropTypes.shape({
    title: String.isRequired,
    description: PropTypes.string,
    slideLink: PropTypes.string,
    authorName: PropTypes.string,
    authorProfile: PropTypes.string,
    _id: PropTypes.string,
    humera: PropTypes.number
  })
};

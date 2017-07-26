import React, { Component } from 'react';
import axios from 'axios';
import Talk from './components/Talk';

class Index extends Component {
	state = {};
	componentDidMount = () => {
		this.setState({
			voted: localStorage.getItem('voted') || false ,
		});
	}
	castVote = (talkTitle) => {
		axios.post('/api/vote', {
			data: {
				title: talkTitle,
			}
		})
		.then(resp => {
			this.setState({
				voted: true,
			});
			localStorage.setItem('voted', true);
		})
		.catch((err) => {
			console.log(err);
		});

	}

  render = () => {
		const talks = this.props.talks.map(talk => {
			return <Talk key={talk._id} talk={talk} castVote={this.castVote} voted={this.state.voted} />
		});
    return (
			<div>
				<h1>Vote for your favorite talk.</h1>
				<h2>you can only vote once. Make it count.</h2>
				{talks}
			</div>
    );
  };
}

Index.getInitialProps = async () => {
	const resp = await axios.get('http://localhost:3000/api/talks');
	const talks = resp.data;
	return {
		talks,
	};
}
export default Index;

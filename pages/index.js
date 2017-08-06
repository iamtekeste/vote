import React, { Component } from 'react';
import axios from 'axios';
import Talk from './components/Talk';
import Layout from './components/Layout';

class Index extends Component {
	state = {
		voted: true,
	};
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
			<Layout title="Welcome to HackNight">
				<div className="tagline">
					<h1>Vote for your favorite talk.</h1>
					<h2>you can only vote once. Make it count.</h2>
				</div>
				<div className="talks">
					{talks}
				</div>
			</Layout>
    );
  };
}

Index.getInitialProps = async () => {
	const resp = await axios.get('http://localhost:3001/api/talks');
	const talks = resp.data;
	return {
		talks,
	};
}
export default Index;

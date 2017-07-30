import React, { Component } from 'react';
import axios from 'axios';

export default class Form extends Component {
  state = {
    data: {
      title: '',
      description: '',
      slideLink: '',
      authorName: '',
      authorProfile: '',
    },
    isSaved: false,
  };
  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    let data = {...this.state.data};
    data[name] = value;
    this.setState({
      data: data,
    });
  };
  saveTalk = (event) => {
    event.preventDefault();
    axios.post('/add', this.state.data)
          .then(res => {
            this.setState({
              data: {
                title: '',
                description: '',
                slideLink: '',
                authorName: '',
                authorProfile: '',
              },
              isSaved: true
            });
          })
          .catch(err => {
            console.log(`oops ${err.message}`);
          });
  };
  render = () => {
    return (
      <div className="add-talk">
        <h1>Add a talk.</h1>
        {this.state.isSaved ?
        <p>Successfully saved the talk. </p> : ''}
        <form>
          <input name="title" placeholder="Talk title" type="text" value={this.state.data.title} onChange={this.handleChange} />
          <textarea name="description" placeholder="Talk description" value={this.state.data.description} onChange={this.handleChange} />
          <input name="slideLink" placeholder="Link to slide" type="text" value={this.state.data.slideLink} onChange={this.handleChange} />
          <input name="authorName" placeholder="Author name" type="text" value={this.state.data.authorName} onChange={this.handleChange} />
          <input name="authorProfile" placeholder="Link to author Github/Twitter profile" type="text" value={this.state.authorProfile} onChange={this.handleChange} />
          <input type="submit" value="Save" onClick={this.saveTalk} />
        </form>

        <style jsx>{`
          textarea, input {
            display: block;
            margin-bottom: 30px;
          }
        `}</style>
      </div>
    );
  }
}

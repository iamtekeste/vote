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
    errors: {}
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
              isSaved: true,
              errors: {}
            });
          })
          .catch(err => {
            this.setState({
              isSaved: false,
              errors: err.response.data.errors
            });
          });
  };
  render = () => {
    const errors = Object.keys(this.state.errors).map(field => {
      return <p key={field} className="error">{field} is required.</p>;
    });
    console.log(errors);
    return (
      <div className="add-talk">
        <h1>Add a talk.</h1>
        {errors}
        {this.state.isSaved ?
        <p className="success">Successfully saved the talk. </p> : ''}
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

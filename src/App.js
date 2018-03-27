import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from  './components/FileUpload';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      user: null
    };
    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged( user => {
      this.setState({user});
    });
  }

  handleAuth(){
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then( result => console.log(`${result.user.email} ha iniciado session`))
      .catch( error => console.log(`Error ${error.code}: ${error.message}`));
  }
// componentes  que se renderizan cuando el usuario esta logeado.
  renderLoginButton(){
    if( this.state.user){
      return (
        <div>
          <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p> Hola {this.state.user.displayName}!</p>
          <button onClick={this.handleLogout}>Salir </button>
          <FileUpload/>
        </div>
      );
    }else{
      return (
        <button onClick={this.handleAuth}>Login con Google</button>
      );
    }
  }

  handleLogout(){
    firebase.auth().signOut()
      .then( result => console.log(`${result.user.email} ha salido`))
      .catch( error => console.log(`Error ${error.code}: ${error.message}`));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Pseudogram</h2>
        </div>
        <div className="App-intro">
          { this.renderLoginButton() }
     
        </div>
      </div>
    );
  }
}

export default App;﻿

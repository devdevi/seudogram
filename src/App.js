import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './components/FileUpload';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      pictures: [],
    };
    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
        // usamos el metodos contac que nos devuelve un   array nuevo basado en el anterior
      })
    })
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado session`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }
  // componentes  que se renderizan cuando el usuario esta logeado.
  renderLoginButton() {
    if (this.state.user) {
      return (
        <div>
          <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p> Hola {this.state.user.displayName}!</p>
          <button onClick={this.handleLogout}>Salir </button>
          <FileUpload onUpload={this.handleUpload} />
          {this.state.pictures.map(picture => (
            <div>
              <img width="120" src={picture.image} alt="" />
              <br />
              <img width="10" src={picture.photoURL} alt={picture.displayName} />
              <br />
              <span>{picture.displayName}</span>
            </div>
          )).reverse()
          }
        </div>
      );
    } else {
      return (
        <button onClick={this.handleAuth}>Login con Google</button>
      );
    }
  }

  handleLogout() {
    firebase.auth().signOut()
      .then(result => console.log(`${result.user.email} ha salido`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }
  handleUpload(event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
    const task = storageRef.put(file);
    task.on('state_changed', snapshot => {
      let percentage =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //  no da el porcentaje  de fichero que se ah subido,
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.log(error.message)
    }, () => {
      // // modificamos el estado,
      // this.setState({
      //     uploadValue: 100,
      //     picture: task.snapshot.downloadURL
      //     // ESTO NOS DA LA URL FINAL
      // });
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      };
      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Pseudogram</h2>
        </div>
        <div className="App-intro">
          {this.renderLoginButton()}

        </div>
      </div>
    );
  }
}

export default App;﻿

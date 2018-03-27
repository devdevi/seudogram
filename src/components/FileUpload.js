import React, { Component } from 'react';
import firebase from 'firebase';

class FileUpload extends Component {
    constructor() {
        super();
        this.state = {
            uploadValue: 0,
            picture: null
        };
        this.handleUpload = this.handleUpload.bind(this);
    }
    // esta funcion recibe un evento que se dispara al subir una imagen
    // obtenemos el fichero  con la constante file
    // usamos el storage de firebase
    // la constante task sube el fichero a firebase.
    //  task tiene un evento on  con el state de firebase,
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
            // modificamos el estado,
            this.setState({
                uploadValue: 100,
                picture: task.snapshot.downloadURL
                // ESTO NOS DA LA URL FINAL
            });
        });
    }
    render() {
        return (
            <div>
              <progress value={this.state.uploadValue} max='100'>
                {this.state.uploadValue} %
              </progress>
              <br/>
              <input type="file" onChange={this.handleUpload} />
              <br/>
              <img width="320" src={this.state.picture} alt=""/>
            </div>
          )
    }

}
export default FileUpload;

import React, { useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {

  const baseUrl = "https://192.168.1.74:44334/api/marcas";
  const [data, setData] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false); 
  const [marcaSeleccionada, setMarcaSeleccionada] = useState({
    marcA_CLAVE: '',
    marcA_NOMBRE: ''
  });

  const handleChange = e => {
    const {name, value} = e.target;
    setMarcaSeleccionada({
      ...marcaSeleccionada,
      [name]: value
    });
    console.log(marcaSeleccionada) ;
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const peticionGet = async() => {
    await axios.get(baseUrl).then(response => {
      setData(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  const peticionPost = async() => {
    delete marcaSeleccionada.marcA_CLAVE;
    await axios.post(baseUrl, marcaSeleccionada).then(response => {
      setData(data.concat(response.data));
    }).catch(error => {
      console.log(error);
    });
    abrirCerrarModalInsertar();
    peticionGet();
  }

  const peticionPut = async() => {
    await axios.put(baseUrl + "/" + marcaSeleccionada.marcA_CLAVE, marcaSeleccionada).then(response => {
      var respuesta = response.data;
      var dataAuxiliar = data;
      dataAuxiliar.map(marca => {
        if(marca.marcA_CLAVE === marcaSeleccionada.marcA_CLAVE){
          marca.marcA_NOMBRE = respuesta.marcA_NOMBRE;
        }
      });
    }).catch(error => {
      console.log(error);
    });
    abrirCerrarModalEditar();
    peticionGet();
  }

  const seleccionarMarca = (marca, caso) => {
    setMarcaSeleccionada(marca);
    (caso === "Editar")&&
    abrirCerrarModalEditar();
  }

  useEffect(() => {
    peticionGet();
  },[]);

  return (
    <div className="App">
      <br/><br/>
      <button className="btn btn-success" onClick={() => abrirCerrarModalInsertar()}>Insertar Marca</button>
      <br/><br/>
      <table className="table table-bordered">
        <thead>
          <tr>
            <td>ID</td>
            <td>Nombre</td>
            <td>Acciones</td>
          </tr>
        </thead>
        <tbody>
          {data.map(marca => (
            <tr key={marca.marcA_CLAVE}>
              <td>{marca.marcA_CLAVE}</td>
              <td>{marca.marcA_NOMBRE}</td>
              <td>
                <button className="btn btn-primary" onClick={() => seleccionarMarca(marca, "Editar")}>Editar</button>{" "}
                <button className="btn btn-danger">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Marca</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" className="form-control" name="marcA_NOMBRE" onChange={handleChange}></input>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPost()}>Insertar</button>{" "}
          <button className="btn btn-danger" onClick={() => abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Marca</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID:</label>
            <input type="text" className="form-control" name="marcA_CLAVE" value={marcaSeleccionada && marcaSeleccionada.marcA_CLAVE} readOnly></input>
            <br/>
            <label>Nombre:</label>
            <input type="text" className="form-control" name="marcA_NOMBRE" value={marcaSeleccionada && marcaSeleccionada.marcA_NOMBRE} onChange={handleChange}></input>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={() => peticionPut()}>Editar</button>{" "}
          <button className="btn btn-danger" onClick={() => abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;

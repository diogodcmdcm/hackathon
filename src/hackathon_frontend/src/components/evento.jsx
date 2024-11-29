import { useState, useEffect } from 'react';
import { hackathon_backend } from 'declarations/hackathon_backend';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Form, Stack, Modal, Navbar, Nav, Card, Container } from 'react-bootstrap';

function evento() {

  useEffect ( async () => {
    consultarEventos();
  }, []);

  const [idEvento, setIdEvento] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [dataInscricao, setDataInscricao] = useState(new Date());
  const [dataSubmissao, setDataSubmissao] = useState(new Date());
  const [dataPitch, setDataPitch] = useState(new Date());
  const [dataResultado, setDataResultado] = useState(new Date());

  const [eventos, setEventos] = useState([]);

  // Constantes utilizadas para controle do Modal utilizado para preenchimento do formulário de cadastro/alteração
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Constante utilizada para controle de validação do formulário preenchido no Modal de cadastro/alteração
  const [validated, setValidated] = useState(false);

  const salvarEvento = async (event) => {
    
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {      
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {      
      setValidated(true);
      
      if(idEvento!=null && idEvento!= ''){
          await hackathon_backend.alterar_evento(parseInt(idEvento),descricao,dataInscricao,dataSubmissao,dataPitch,dataResultado).then(() => {
            setShow(false);
            limparCampos();
            consultarEventos();
            alert("Evento alterado com sucesso!");
          });
      } else {
          await hackathon_backend.add_evento(descricao,dataInscricao,dataSubmissao,dataPitch,dataResultado).then(() => {
            setShow(false);
            limparCampos();
            consultarEventos();
            alert("Evento registrado com sucesso!");
          });
      }
    }    
  }

  async function excluirEvento(id){
    await hackathon_backend.excluir_evento(parseInt(id) ).then(() => {      
      consultarEventos();
      alert("Evento excluido com sucesso!");
    });    
  }

  function visualizarEquipe(id){
    window.location.href = "/equipeLink/"+id;
  }

  function limparCampos(){
    setIdEvento(null);
    setDescricao('');
    setDataInscricao(new Date());
    setDataSubmissao(new Date());
    setDataPitch(new Date());
    setDataResultado(new Date());
  }             

  function editarEvento(id, desc, dtInsc, dtSub, dtPitch, dtRes){    
    setIdEvento(id);    
    setDescricao(desc);    
    setDataInscricao(dtInsc);    
    setDataSubmissao(dtSub);    
    setDataPitch(dtPitch);    
    setDataResultado(dtRes);    
    setShow(true);    
  }

  async function consultarEventos(){
    await hackathon_backend.get_eventos().then((resultado) => {
      setEventos(resultado);
    });
  }

  return (
    <main>
       <Navbar bg="primary" data-bs-theme="dark">
        <Container fluid>          
          <Nav className="me-auto">
            <Nav.Link onClick={handleShow} >Adicionar Evento</Nav.Link>            
          </Nav>
        </Container>
      </Navbar>

      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Ação</th>
              <th>Descrição</th>
              <th>Data de Inscrição</th>
              <th>Data de Submissão do Projeto</th>
              <th>Data do Pitch</th>
              <th>Data do Resultado</th>
            </tr>
          </thead>
          <tbody>
            { eventos.map( (linha) =>  
              <tr>
                <td>
                  <Stack direction="horizontal" gap={0}>   
                    <Button onClick={ () => { editarEvento(linha.id, linha.descricao, linha.data_inscricao, linha.data_submissao_projeto, linha.data_pitch, linha.data_resultado ) } }  variant="primary" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil" >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                          <path d="M13.5 6.5l4 4" />
                        </svg>
                    </Button>&nbsp;&nbsp;
                    <Button onClick={ () => { excluirEvento(linha.id) } }  variant="primary" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    </Button>&nbsp;&nbsp;                      
                    <Button onClick={ () => { visualizarEquipe(linha.id)  }} variant="primary" >Equipe</Button>
                  </Stack>
                  </td>
                <td>{linha.descricao}</td>
                <td>{new Intl.DateTimeFormat('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric', }).format(new Date(linha.data_inscricao)) } </td>
                <td>{new Intl.DateTimeFormat('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric', }).format(new Date(linha.data_submissao_projeto)) } </td>
                <td>{new Intl.DateTimeFormat('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric', }).format(new Date(linha.data_pitch)) } </td>
                <td>{new Intl.DateTimeFormat('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric', }).format(new Date(linha.data_resultado)) } </td>                
              </tr>          
            )} 
          </tbody>
        </Table>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Form noValidate validated={validated} onSubmit={salvarEvento}>
          <Modal.Header closeButton>
            <Modal.Title>Cadastro de Evento</Modal.Title>
          </Modal.Header>
          <Modal.Body>          
            <Form.Group className="mb-3 w-100" controlId="controlInput1">
              <Form.Label>Descrição</Form.Label>
              <Form.Control value={descricao} required onChange={ (e) => { setDescricao(e.target.value) } } type="text" placeholder="" autoFocus />
              <Form.Control.Feedback type="invalid">
                Por Favor, informe uma descrição para o evento (este campo é obrigatório).
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 w-100" controlId="controlInput2" >
              <Form.Label>Data de Inscrição</Form.Label>
              <Form.Control value={dataInscricao} required onChange={ (e) => { setDataInscricao(e.target.value) } } type="date" rows={3} />
              <Form.Control.Feedback type="invalid">
                Por Favor, informe uma data de inscrição para o evento (este campo é obrigatório).
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 w-100" controlId="controlInput3" >
              <Form.Label>Data da Submissão do Projeto</Form.Label>
              <Form.Control value={dataSubmissao} required onChange={ (e) => { setDataSubmissao(e.target.value) } } type="date" rows={3} />
              <Form.Control.Feedback type="invalid">
                Por Favor, informe uma data de submissão do projeto para o evento (este campo é obrigatório).
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 w-100" controlId="controlInput4" >
              <Form.Label>Data do Pitch</Form.Label>
              <Form.Control value={dataPitch} required onChange={ (e) => { setDataPitch(e.target.value) } } type="date" rows={3} />
              <Form.Control.Feedback type="invalid">
                Por Favor, informe uma data de pitch para o evento (este campo é obrigatório).
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 w-100" controlId="controlInput5" >
              <Form.Label>Data do Resultado</Form.Label>
              <Form.Control value={dataResultado} required onChange={ (e) => { setDataResultado(e.target.value) } } type="date" rows={3} />
              <Form.Control.Feedback type="invalid">
                Por Favor, informe uma data de resultado para o evento (este campo é obrigatório).
              </Form.Control.Feedback>
            </Form.Group>            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type='submit' >
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </main>
  );
}

export default evento;

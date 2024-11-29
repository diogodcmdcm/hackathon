import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { hackathon_backend } from 'declarations/hackathon_backend';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Modal, ListGroup, Navbar, Nav, Card, Container } from 'react-bootstrap';

function equipe() {

  const {idEvento} = useParams();

  useEffect ( async () => {
    consultarEquipe();
  }, []);

  //Constante utilizada para controle de validação do formulário preenchido no Modal de cadastro/alteração
  const [validated, setValidated] = useState(false);

  const [idEquipe, setIdEquipe] = useState(null);
  const [nome, setNome] = useState('');
  const [descricaoProjeto, setDescricaoProjeto] = useState('');
  const [nomeParticipante1, setNomeParticipante1] = useState('');
  const [nomeParticipante2, setNomeParticipante2] = useState('');
  const [nomeParticipante3, setNomeParticipante3] = useState('');
  const [nomeParticipante4, setNomeParticipante4] = useState('');

  const [equipes, setEquipes] = useState([]);

  // Constantes utilizadas para controle do Modal utilizado para preenchimento do formulário de cadastro/alteração
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const salvarEquipe = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {      
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {      
      setValidated(true);
      
      if(idEquipe!=null && idEquipe!= ''){
        await hackathon_backend.alterar_equipe( parseInt(idEvento), 
                                                parseInt(idEquipe), 
                                                nome, 
                                                descricaoProjeto, 
                                                nomeParticipante1,
                                                nomeParticipante2,
                                                nomeParticipante3,
                                                nomeParticipante4 ).then(() => {
            setShow(false);
            limparCampos();
            consultarEquipe();
            alert("Equipe alterada com sucesso!");
          });        
      } else {
          await hackathon_backend.add_equipe(parseInt(idEvento), 
                                            nome, 
                                            descricaoProjeto, 
                                            nomeParticipante1,
                                            nomeParticipante2,
                                            nomeParticipante3,
                                            nomeParticipante4 ).then(() => {
            setShow(false);
            limparCampos();
            consultarEquipe();
            alert("Equipe registrada com sucesso!");
          });        
      }
    }
    
  }

  function editarEquipe(idEq, nom, proj, nPart1, nPart2, nPart3, nPart4){
    setIdEquipe(idEq);
    setNome(nom);
    setDescricaoProjeto(proj);
    setNomeParticipante1(nPart1);
    setNomeParticipante2(nPart2);
    setNomeParticipante3(nPart3);
    setNomeParticipante4(nPart4);  
    setShow(true);    
  }

  async function excluirEquipe(id){
    await hackathon_backend.excluir_equipe(parseInt(id) ).then(() => {      
      consultarEquipe();
      alert("Equipe excluida com sucesso!");
    });    
  }

  function limparCampos(){
    setIdEquipe(null);
    setNome('');
    setDescricaoProjeto('');
    setNomeParticipante1('');
    setNomeParticipante2('');
    setNomeParticipante3('');
    setNomeParticipante4('');
  }

  async function consultarEquipe(){
    await hackathon_backend.get_equipes(parseInt(idEvento)).then((resultado) => {
      setEquipes(resultado);
    });
  }

  return (
    <main>
       <Navbar bg="primary" data-bs-theme="dark">
        <Container fluid>          
          <Nav className="me-auto">
            <Nav.Link href="/" >Home</Nav.Link>            
            <Nav.Link onClick={handleShow} >Adicionar Equipe</Nav.Link>            
          </Nav>
        </Container>
      </Navbar>

      <div>        
        { equipes.map( (linha) =>  
          <Card style={{ width: '100%' }}>
            <Card.Body>   
              <Card.Title>Equipe: {linha.nome}   |   Projeto: {linha.descricao_projeto} </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Participantes:</Card.Subtitle>
              <Card.Text>
                <ListGroup as="ol" numbered>
                  <ListGroup.Item as="li">{linha.nome_participante1}</ListGroup.Item>
                  <ListGroup.Item as="li">{linha.nome_participante2}</ListGroup.Item>
                  <ListGroup.Item as="li">{linha.nome_participante3}</ListGroup.Item>
                  <ListGroup.Item as="li">{linha.nome_participante4}</ListGroup.Item>
                </ListGroup>
              </Card.Text>
              <Card.Link onClick={ () => { editarEquipe(linha.id, linha.nome, linha.descricao_projeto, linha.nome_participante1, linha.nome_participante2, linha.nome_participante3, linha.nome_participante4) }}   >Editar</Card.Link>              
              <Card.Link onClick={ () => { excluirEquipe(linha.id) }} >Excluir</Card.Link>
            </Card.Body>
          </Card>
        )}        
      </div>

      <Modal show={show} onHide={handleClose}>
        <Form noValidate validated={validated} onSubmit={salvarEquipe}>
          <Modal.Header closeButton>
            <Modal.Title>Cadastro de Equipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>            
            <Form.Group className="mb-3 w-100" controlId="controlInput1">
              <Form.Label>Nome da Equipe*</Form.Label>
              <Form.Control value={nome} onChange={ (e) => { setNome(e.target.value) } } required type="text" placeholder="" autoFocus />
              <Form.Control.Feedback type="invalid">
                Por Favor, informe um nome para a equipe (este campo é obrigatório).
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 w-100" controlId="controlInput2" >
              <Form.Label>Projeto</Form.Label>
              <Form.Control value={descricaoProjeto} onChange={ (e) => { setDescricaoProjeto(e.target.value) } } type="text" rows={3} />
            </Form.Group>
            <Form.Group className="mb-3 w-100" controlId="controlInput3" >
              <Form.Label>Nome do Participante 1*</Form.Label>
              <Form.Control value={nomeParticipante1} required onChange={ (e) => { setNomeParticipante1(e.target.value) } } type="text" rows={3} />
              <Form.Control.Feedback type="invalid">
                Por Favor, informe pelo menos um participante (é obrigatório a equipe possuir pelo menos um participante).
              </Form.Control.Feedback>            
            </Form.Group>            
            <Form.Group className="mb-3 w-100" controlId="controlInput4" >
              <Form.Label>Nome do Participante 2</Form.Label>
              <Form.Control value={nomeParticipante2} onChange={ (e) => { setNomeParticipante2(e.target.value) } } type="text" rows={3} />
            </Form.Group>
            <Form.Group className="mb-3 w-100" controlId="controlInput5" >
              <Form.Label>Nome do Participante 3</Form.Label>
              <Form.Control value={nomeParticipante3} onChange={ (e) => { setNomeParticipante3(e.target.value) } } type="text" rows={3} />
            </Form.Group>
            <Form.Group className="mb-3 w-100" controlId="controlInput5" >
              <Form.Label>Nome do Participante 4</Form.Label>
              <Form.Control value={nomeParticipante4} onChange={ (e) => { setNomeParticipante4(e.target.value) } } type="text" rows={3} />
            </Form.Group>            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" >
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </main>
  );
}

export default equipe;

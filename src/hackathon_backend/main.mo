import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";


actor Hackathon {
  
//Estrutura que será utilizada para organizar os eventos
type Evento = {
  id : Nat;
  descricao: Text;
  data_inscricao: Text;
  data_submissao_projeto: Text;
  data_pitch: Text;
  data_resultado: Text;  
};

//Estrutura que será utilizada para organizar as equipes
type Equipe = {
  id: Nat;
  id_evento: Nat;
  nome: Text;
  descricao_projeto: Text;
  nome_participante1: Text;
  nome_participante2: Text;
  nome_participante3: Text;
  nome_participante4: Text;
};

//Esta variavel será utilizada para gerar um controlador único de identificação de eventos
var id_evento : Nat = 0;
// Esta estrutura será utilizada para armazenar os eventos
var eventos : Buffer.Buffer<Evento> = Buffer.Buffer<Evento>(10);

//Esta variavel será utilizada para gerar um controlador único de identificação de equipes
var id_equipe : Nat = 0;
// Esta estrutura será utilizada para armazenar as equipes
var equipes : Buffer.Buffer<Equipe> = Buffer.Buffer<Equipe>(10);

/* ############### EVENTOS ################# */

//Esta função irá adicionar itens no Buffer eventos.
public func add_evento(desc: Text, dt_inscricao: Text, dt_submissao: Text, dt_pitch: Text, dt_resultado: Text) : async () {

  id_evento += 1;

  let ev : Evento = { id = id_evento;
                      descricao = desc;
                      data_inscricao = dt_inscricao;
                      data_submissao_projeto = dt_submissao;
                      data_pitch = dt_pitch;
                      data_resultado = dt_resultado;  
                    };

  eventos.add(ev);

};

//Esta função irá remover itens do Buffer eventos e todas as equipes de um evento removido.
public func excluir_evento(id_excluir: Nat) : async () {

  func localiza_excluir(i: Nat, x: Evento) : Bool {
    return x.id != id_excluir;
  };

  eventos.filterEntries(localiza_excluir);

  func localiza_excluir_evento(i: Nat, x: Equipe) : Bool {
    return x.id_evento != id_excluir;
  };

  equipes.filterEntries(localiza_excluir_evento);

};

//Esta função irá alterar itens no Buffer eventos.
public func alterar_evento(id_ev: Nat, 
                           desc: Text, 
                           dt_inscricao: Text, 
                           dt_submissao: Text, 
                           dt_pitch: Text, 
                           dt_resultado: Text) : async () {

  let ev : Evento = { id = id_ev;
                      descricao = desc;
                      data_inscricao = dt_inscricao;
                      data_submissao_projeto = dt_submissao;
                      data_pitch = dt_pitch;
                      data_resultado = dt_resultado;  
                    };

    func localiza_index (x: Evento, y: Evento) : Bool {
      return x.id == y.id;
    };

    let index : ?Nat = Buffer.indexOf(ev, eventos, localiza_index);

    switch(index){
      case(null) {
        // não executar ação
      };
      case(?i){
        eventos.put(i,ev);
      }
    };

  };

  //Esta função irá retornar todos os eventos incluidos.
  public func get_eventos() : async [Evento] {
    return Buffer.toArray(eventos);
  };  

  /* ############## EQUIPES ################ */

  //Esta função irá adicionar itens no Buffer equipes.
  public func add_equipe(id_ev: Nat, 
                         nome: Text,
                         desc_proj: Text, 
                         n_participante1: Text, 
                         n_participante2: Text, 
                         n_participante3: Text,
                         n_participante4: Text) : async () {

      id_equipe += 1;

      let eq : Equipe = { id = id_equipe;
                          id_evento = id_ev;
                          nome = nome;
                          descricao_projeto = desc_proj;
                          nome_participante1 = n_participante1;
                          nome_participante2 = n_participante2;
                          nome_participante3 = n_participante3;
                          nome_participante4 = n_participante4;
                        };

      equipes.add(eq);
  };

  //Esta função irá remover itens do Buffer equipes.
  public func excluir_equipe(id_excluir: Nat) : async () {

    func localiza_excluir(i: Nat, x: Equipe) : Bool {
      return x.id != id_excluir;
    };

    equipes.filterEntries(localiza_excluir);
  };

  //Esta função irá alterar itens do Buffer equipes.
  public func alterar_equipe(id_ev: Nat,
                             id_eq: Nat, 
                             nome: Text,
                             desc_proj: Text, 
                             n_participante1: Text, 
                             n_participante2: Text, 
                             n_participante3: Text,
                             n_participante4: Text) : async () {

    let eq : Equipe = { id = id_eq;
                        id_evento = id_ev;
                        nome = nome;
                        descricao_projeto = desc_proj;
                        nome_participante1 = n_participante1;
                        nome_participante2 = n_participante2;
                        nome_participante3 = n_participante3;
                        nome_participante4 = n_participante4;
                      };

    func localiza_index (x: Equipe, y: Equipe) : Bool {
      return x.id == y.id;
    };

    let index : ?Nat = Buffer.indexOf(eq, equipes, localiza_index);

    switch(index){
      case(null) {
        // não executar ação
      };
      case(?i){
        equipes.put(i,eq);
      }
    };

  };

  //Esta função irá retornar todas as equipes adicionadas em um evento.
  public func get_equipes(id_event: Nat) : async [Equipe] {

    var arrayEquipes = Buffer.toArray<Equipe>(equipes);

    return Array.filter<Equipe>(arrayEquipes, func(x: Equipe) { x.id_evento == id_event }  );

  };

};

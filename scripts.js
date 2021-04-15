let nome = "";

function entrarNaSala(){
    let input = document.querySelector(".nome");
    let nomeDoUsuario = input.value;
    nome = nomeDoUsuario;

    const dados = {name: nomeDoUsuario};
    const requisicao = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", dados);
    
    entrando();

    requisicao.then(tratarSucessoEntrarNaSala);
    requisicao.catch(tratarErrorEntraNaSala);
}

function entrando() {
    let carregando = document.querySelector(".tela-de-entrada");
    carregando.innerHTML = `
    <div class="tela-de-entrada">
        <img src="bate-papo UOL.jpg" alt="">
        <img src="MnyxU.gif" alt="">
        <p>Entrando...</p>
    </div>
    `
}

function tratarSucessoEntrarNaSala() {

    let entrar = document.querySelector(".tela-de-entrada");
    entrar.classList.add("escondido");

    buscarMensagem();

    setInterval(buscarMensagem,3000);
    setInterval(usuarioTaOn, 5000);
}

function tratarErrorEntraNaSala() {
    alert("Este nome já está em uso, digite o nome novamente");

    let carregando = document.querySelector(".tela-de-entrada");
        carregando.innerHTML = `
        <div class="tela-de-entrada">
            <img src="bate-papo UOL.jpg" alt="">
            <input type="text" class="nome" name="" placeholder="Digite seu nome">
            <input class="entrar" onclick="entrarNaSala()" type="button" value="Entrar">
        </div>
        `       
}

function usuarioTaOn() {
    const dados = {name: nome};
    const requisicao = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", dados);
}

function buscarMensagem() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");
    promessa.then(processarResposta);
}

function processarResposta(resposta) {
    let mensagens = document.querySelector(".mensagens_enviadas")
    let mesangensNaTela = "";

    for(let i = 0; i < resposta.data.length; i++){
        if (resposta.data[i].type == "status"){
        mesangensNaTela += `
            <li class="${resposta.data[i].type}">
                <p>(${resposta.data[i].time})</p>
                <p><strong>${resposta.data[i].from}</strong> ${resposta.data[i].text}</p>
            </li>
            `
        }

        else if (resposta.data[i].type == "private_message") {
            if((nome === resposta.data[i].to) || (nome === resposta.data[i].from) || (resposta.data[i].to === "Todos")){
            mesangensNaTela += `
            <li class="${resposta.data[i].type}">
                <p>(${resposta.data[i].time})</p>
                <p><strong>${resposta.data[i].from}</strong> reservadamente para <strong>${resposta.data[i].to}</strong>: ${resposta.data[i].text}</p>
            </li>
            `
            }
        } 
        
        else {
            mesangensNaTela += `
            <li class="${resposta.data[i].type}">
                <p>(${resposta.data[i].time})</p>
                <p><strong>${resposta.data[i].from}</strong> para <strong>${resposta.data[i].to}</strong>: ${resposta.data[i].text}</p>
            </li>
            `
        }
    }

    mensagens.innerHTML = mesangensNaTela;
}

let modoMensagem;
let destinoMensagem;

function enviarMensagem() {
    let input = document.querySelector(".escreverMensagem");
    let mensagemDigitada = input.value;

    let dados = {};

        if(modoMensagem == "reservadamente"){
            if(destinoMensagem == null){
                dados = {
                    from: nome,
                    to: "Todos",
                    text: mensagemDigitada,
                    type: "private_message" // ou "private_message" para o bônus
                };
            }

            else{
            dados = {
                from: nome,
                to: destinoMensagem,
                text: mensagemDigitada,
                type: "private_message" // ou "private_message" para o bônus
                };
            } 
        }

        else if(modoMensagem == "público"){
            if(destinoMensagem == null){
                dados = {
                    from: nome,
                    to: "Todos",
                    text: mensagemDigitada,
                    type: "message" // ou "private_message" para o bônus
                    };
            }

            else{
                dados = {
                    from: nome,
                    to: destinoMensagem,
                    text: mensagemDigitada,
                    type: "message" // ou "private_message" para o bônus
                    };
            }
        }

        else if(modoMensagem == null && destinoMensagem != null){
            dados = {
                from: nome,
                to: destinoMensagem,
                text: mensagemDigitada,
                type: "message" // ou "private_message" para o bônus
                };  
        }

        else{
           dados = {
                from: nome,
                to: "Todos",
                text: mensagemDigitada,
                type: "message" // ou "private_message" para o bônus
                }; 
        }
               
    const requisicao = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", dados);
 
    requisicao.then(tratarSucessoEnviarMensagem);
    requisicao.catch(tratarErroEnviarMensagem);
}

document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
    
        let enviarMensagemEnter = document.querySelector(".enviar");
        enviarMensagemEnter.click();

    }
  });

function tratarSucessoEnviarMensagem() {
    buscarMensagem();
}

function tratarErroEnviarMensagem() {
    window.location.reload();
}

function abrirSidebar(elemento){
    let sidebar = document.querySelector(".sidebar");
    sidebar.classList.remove("escondido");

    buscarPessoasNoChat();

    setInterval(buscarPessoasNoChat,10000);
}

function fecharSidebar(elemento) {
    let fundoEscuro = document.querySelector(".sidebar");
    fundoEscuro.classList.add("escondido");
}

function buscarPessoasNoChat() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");
    promessa.then(pessoasNoChat);
}

function pessoasNoChat(resposta) {
    let contatosAtivos = document.querySelector(".contatos");
    contatos = "";

    for(let i = 0; i < resposta.data.length; i++){
        contatos += `
            <li onclick="mensagemPara(this)">
                <ion-icon name="person-circle"></ion-icon>
                <p>${resposta.data[i].name}</p>
                <ion-icon class="certinho escondido" name="checkmark"></ion-icon>
            </li>
        `
   

   contatosAtivos.innerHTML = `
        <li onclick="mensagemPara(this)">
           <ion-icon name="people"></ion-icon>
           <p>Todos</p>
           <ion-icon class="certinho aparecendoContato" name="checkmark"></ion-icon>
        </li>
    ` + contatos;
}
}


function mensagemPara(elemento) {
    let certinhoExcluido = document.querySelector(".aparecendoContato")
    certinhoExcluido.classList.add("escondido");
    certinhoExcluido.classList.remove("aparecendoContato");

    let adicionarCertinho = elemento.querySelector(".escondido")
    adicionarCertinho.classList.remove("escondido");
    adicionarCertinho.classList.add("aparecendoContato");

    let nomeDaPessoa = elemento.querySelector("p").innerHTML;
    destinoMensagem = nomeDaPessoa;

    let mensagemParaAlguem = document.querySelector(".texto_da_mensagem .destino")
    mensagemParaAlguem.innerHTML =`Enviando para ${nomeDaPessoa}`  
}

function tipoDeMensagem(elemento) {
    let certinhoExcluido = document.querySelector(".aparecendoTipoDeMensagem")
    certinhoExcluido.classList.add("escondido");
    certinhoExcluido.classList.remove("aparecendoTipoDeMensagem");

    let adicionarCertinho = elemento.querySelector(".escondido")
    adicionarCertinho.classList.remove("escondido");
    adicionarCertinho.classList.add("aparecendoTipoDeMensagem");

    let mensagemDoTipo = elemento.querySelector("p").innerHTML.toLowerCase();
    modoMensagem = mensagemDoTipo;
    
    let mensagemParaAlguemModo = document.querySelector(".texto_da_mensagem .modo")
    mensagemParaAlguemModo.innerHTML = `(${mensagemDoTipo})`
}
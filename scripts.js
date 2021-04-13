function entrarNaSala(){
    let input = document.querySelector(".nome");
    let nome = input.value;

    if(nome != null){
        let entrar = document.querySelector(".tela-de-entrada");
        entrar.classList.add("escondido");
    }
}

function abrirSidebar(elemento){
    let sidebar = document.querySelector(".sidebar");
    sidebar.classList.remove("escondido");
}
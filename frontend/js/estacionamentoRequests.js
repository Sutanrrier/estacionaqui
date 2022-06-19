//Headers para a Fetch API
const myHeaders = new Headers();
myHeaders.append("Content-type", "application/json; charset=UTF-8");

let paginaAtual = 1;
let paginaFinal = paginaAtual + 1;

const linhasPorPagina = 5; //Define quantas linhas haverá por página de consulta

//Função para passar a próxima página da tabela
function proximaPagina() {
    if (paginaAtual < paginaFinal) {
        let tabela = document.getElementById("tabelaEstacionamento");
        tabela.innerText = "";
        let pagina = document.getElementById("numeroPagina").innerText;
        paginaAtual = parseInt(pagina) + 1;
        paginaFinal = paginaAtual + 1;
        document.getElementById("numeroPagina").innerText = paginaAtual;
        criarTabelaEstacionamento();
    }
}

//Função para voltar a página anterior da tabela
function anteriorPagina() {
    if (paginaAtual > 1) {
        let tabela = document.getElementById("tabelaEstacionamento");
        tabela.innerText = "";
        let pagina = document.getElementById("numeroPagina").innerText;
        paginaAtual = parseInt(pagina) - 1;
        document.getElementById("numeroPagina").innerText = paginaAtual;
        criarTabelaEstacionamento();
    }
}

//Cria o cabeçalho da tabela
function criaCabecalhoTabela() {
    const linha = document.createElement("tr");

    // Criando as colunas da linha
    let colunaId = document.createElement("th");
    let colunaNome = document.createElement("th");
    let colunaOptions = document.createElement("th");

    //Injetando informação nas colunas da linha
    colunaId.innerHTML = "ID";
    colunaNome.innerHTML = "NOME";
    colunaOptions.innerHTML = "OPÇÕES";

    //Colocando as colunas dentro da linha
    linha.appendChild(colunaId);
    linha.appendChild(colunaNome);
    linha.appendChild(colunaOptions);

    return linha;
}

//Cria uma linha para a tabela de consulta
function criaLinhaTabela(objeto) {
    let linha = document.createElement("tr");

    // Criando as colunas da linha
    let colunaId = document.createElement("td");
    let colunaNome = document.createElement("td");

    let colunaOptions = document.createElement("td");

    let optionAtualizar = document.createElement("button");
    let optionVisualizar = document.createElement("button");
    let optionRemover = document.createElement("button");

    //Injetando informação nas colunas da linha
    colunaId.innerHTML = objeto.id;
    colunaNome.innerHTML = objeto.nome;

    //Criando botão de Atualizar carros
    const classesAtualizar = ["fa-solid", "fa-pencil"];
    optionAtualizar.setAttribute("title", "Atualizar carro");
    optionAtualizar.setAttribute("onclick", `opcaoAtualizar(${objeto.id})`);
    classesAtualizar.forEach(cls => optionAtualizar.classList.add(cls));

    //Criando botão de Visualizar carros
    const classesVisualizar = ["fa-solid", "fa-eye"];
    optionVisualizar.setAttribute("title", "Visualizar carro");
    optionVisualizar.setAttribute("onclick", `opcaoVisualizar(${objeto.id})`);
    classesVisualizar.forEach(cls => optionVisualizar.classList.add(cls));

    //Criando botão de Remover carros
    const classesRemover = ["fa-solid", "fa-trash"];
    optionRemover.setAttribute("title", "Remover carro");
    optionRemover.setAttribute("onclick", `opcaoRemover(${objeto.id})`);
    classesRemover.forEach(cls => optionRemover.classList.add(cls));

    colunaOptions.appendChild(optionAtualizar);
    colunaOptions.appendChild(optionVisualizar);
    colunaOptions.appendChild(optionRemover);

    //Colocando as colunas dentro da linha
    linha.appendChild(colunaId);
    linha.appendChild(colunaNome);
    linha.appendChild(colunaOptions);

    return linha;
}

//GET - Retorna um estacionamento dentro do banco a partir de um ID e gera um formulário com o JSON de resposta
function visualizarEstacionamento() {
    const idEstacionamento = sessionStorage.getItem("idEstacionamentoAtual");

    const url = `http://localhost:8080/estacionamentos/${idEstacionamento}`;
    const options = {
        method: "GET",
        mode: "cors",
        cache: "default"
    }

    fetch(url, options)
        .then(response => response.json()
            .then(data => {
                document.getElementById("id").value = data.id;
                document.getElementById("nome").value = data.nome;
                document.getElementById("data").value = data.dataCriacao;
            }))
        .catch(() => alert("Erro! -> Este ID não existe no banco de dados"));
}

//GET - Retorna todos os estacionamentos dentro do banco e gera uma tabela com o JSON de resposta
function criarTabelaEstacionamento() {
    const tabela = document.getElementById("tabelaEstacionamento");

    const url = "http://localhost:8080/estacionamentos"
    const options = {
        method: "GET",
        mode: "cors",
        cache: "default"
    }

    fetch(url, options)
        .then(response => response.json()
            .then(data => {
                const cabecalho = criaCabecalhoTabela();
                tabela.appendChild(cabecalho);

                let maxLinhas = paginaAtual * linhasPorPagina;

                for (let i = (paginaAtual * linhasPorPagina) - linhasPorPagina; i < maxLinhas; i++) {
                    if (data[i] != null) {
                        const linha = criaLinhaTabela(data[i]);
                        tabela.appendChild(linha);
                    }
                    else {
                        paginaFinal = paginaAtual;
                        break;
                    }
                }
            }));
}

//GET - Retorna um estacionamento dentro do banco a partir de um ID e gera uma tabela com o JSON de resposta
function criarTabelaEstacionamentoId() {
    const tabela = document.getElementById("tabelaEstacionamentoId");
    const idEstacionamento = document.getElementById("idPesquisaEstacionamento").value;

    const url = `http://localhost:8080/estacionamentos/${idEstacionamento}`;
    const options = {
        method: "GET",
        mode: "cors",
        cache: "default"
    }

    fetch(url, options)
        .then(response => response.json()
            .then(data => {
                let linha = criaLinhaTabela(data);
                tabela.appendChild(linha)
            }));

}

//POST - Gera um JSON e envia como body da requisição para cadastrar um estacionamento
function salvarEstacionamento() {
    const nome = document.getElementById("nome").value;

    const url = "http://localhost:8080/estacionamentos"
    const body = {
        "nome": nome
    }
    const options = {
        method: "POST",
        body: JSON.stringify(body),
        mode: "cors",
        cache: "default",
        headers: myHeaders
    }

    fetch(url, options)
        .then(() => {
            alert("Estacionamento cadastrado com sucesso!")
            window.location.replace("http://127.0.0.1:5500/frontend/index.html");
        })
        .catch(() => alert("Ocorreu um erro!"));
}

//PUT - Gera um JSON e envia como body da requisição para atualizar um estacionamento por seu Id
function atualizarEstacionamento() {
    const id = sessionStorage.getItem("idEstacionamentoAtual");
    const nome = document.getElementById("nome").value;

    const url = `http://localhost:8080/estacionamentos/${id}`;
    const body = {
        "id": id,
        "nome": nome
    }
    const options = {
        method: "PUT",
        body: JSON.stringify(body),
        mode: "cors",
        cache: "default",
        headers: myHeaders
    }

    fetch(url, options)
        .then(() => {
            alert("Estacionamento atualizado com sucesso!");
            window.location.replace("http://127.0.0.1:5500/frontend/pages/estacionamento/consultaEstacionamentos.html");
        })
        .catch(() => alert("Erro! -> Este ID não existe no banco!"));
}

//DELETE - Apaga um carro dentro do banco apartir de um ID
function apagarEstacionamento() {
    const idEstacionamento = sessionStorage.getItem("idEstacionamentoAtual");

    const url = `http://localhost:8080/estacionamentos/${idEstacionamento}`;
    const options = {
        method: "DELETE",
        mode: "cors",
        cache: "default"
    }

    fetch(url, options)
        .then(() => {
            alert("Estacionamento removido com sucesso!");
            window.location.replace("http://127.0.0.1:5500/frontend/pages/estacionamento/consultaEstacionamentos.html");
        })
        .catch(() => alert("Erro! -> Este ID não existe ou não pode ser removido do banco!"));

}

//Função do botão Editar, redirecionando o usuário para a página de Atualizar Carro
function opcaoAtualizar(id) {
    sessionStorage.setItem("idEstacionamentoAtual", id);
    window.location.assign("http://127.0.0.1:5500/frontend/pages/estacionamento/atualizarEstacionamento.html");
}

//Função do botão Visualizar, redirecionando o usuário para a página de Atualizar Carro
function opcaoVisualizar(id) {
    sessionStorage.setItem("idEstacionamentoAtual", id);
    window.location.assign("http://127.0.0.1:5500/frontend/pages/estacionamento/visualizarEstacionamento.html");
}

//Função do botão Remover, redirecionando o usuário para a página de Atualizar Carro
function opcaoRemover(id) {
    sessionStorage.setItem("idEstacionamentoAtual", id);
    window.location.assign("http://127.0.0.1:5500/frontend/pages/estacionamento/apagarEstacionamento.html");
}

//Headers para a Fetch API
const myHeaders = new Headers();
myHeaders.append("Content-type", "application/json; charset=UTF-8");

let paginaAtual = 1;
let paginaFinal = sessionStorage.getItem("paginaFinalCarro");

const linhasPorPagina = 5; //Define quantas linhas haverá por página de consulta

//Cria o Select dinâmico com as opções de estacionamento disponíveis no banco
function criarSelectCarro() {
    const select = document.getElementById("estacionamento_id");

    const url = "http://localhost:8080/estacionamentos"
    const options = {
        method: "GET",
        mode: "cors",
        cache: "default"
    }

    fetch(url, options)
        .then(response => response.json()
            .then(data => (data.forEach(element => {
                let option = document.createElement("option");
                option.innerHTML = element.nome;
                option.value = element.id;

                select.appendChild(option);
            }))));
}

//Função para passar a próxima página da tabela
function proximaPagina() {
    if (paginaAtual < paginaFinal) {
        let tabela = document.getElementById("tabelaCarros");
        tabela.innerText = "";
        let pagina = document.getElementById("numeroPagina").innerText;
        paginaAtual = parseInt(pagina) + 1;
        document.getElementById("numeroPagina").innerText = paginaAtual;
        criarTabelaCarro();
    }
}

//Função para voltar a página anterior da tabela
function anteriorPagina() {
    if (paginaAtual > 1) {
        let tabela = document.getElementById("tabelaCarros");
        tabela.innerText = "";
        let pagina = document.getElementById("numeroPagina").innerText;
        paginaAtual = parseInt(pagina) - 1;
        document.getElementById("numeroPagina").innerText = paginaAtual;
        criarTabelaCarro();
    }
}

//Cria o cabecalho para a tabela de consulta
function criaCabecalhoTabela() {
    const linha = document.createElement("tr");

    // Criando as colunas da linha
    let colunaId = document.createElement("th");
    let colunaCor = document.createElement("th");
    let colunaPlaca = document.createElement("th");
    let colunaVelocidade = document.createElement("th");
    let colunaEstacionamento = document.createElement("th");
    let colunaOptions = document.createElement("th");

    //Injetando informação nas colunas da linha
    colunaId.innerHTML = "ID";
    colunaCor.innerHTML = "COR";
    colunaPlaca.innerHTML = "PLACA";
    colunaVelocidade.innerHTML = "VELOCIDADE MÁX.";
    colunaEstacionamento.innerHTML = "ESTACIONADO EM";
    colunaOptions.innerHTML = "OPÇÕES";

    //Colocando as colunas dentro da linha
    linha.appendChild(colunaId);
    linha.appendChild(colunaCor);
    linha.appendChild(colunaPlaca);
    linha.appendChild(colunaVelocidade);
    linha.appendChild(colunaEstacionamento);
    linha.appendChild(colunaOptions);

    return linha;
}

//Cria uma linha para a tabela de consulta
function criaLinhaTabela(objeto) {
    const linha = document.createElement("tr");

    // Criando as colunas da linha
    let colunaId = document.createElement("td");
    let colunaCor = document.createElement("td");
    let colunaPlaca = document.createElement("td");
    let colunaVelocidade = document.createElement("td");
    let colunaEstacionamento = document.createElement("td");

    let colunaOptions = document.createElement("td");

    let optionAtualizar = document.createElement("button");
    let optionVisualizar = document.createElement("button");
    let optionRemover = document.createElement("button");

    //Injetando informação do objeto nas colunas da linha
    colunaId.innerHTML = objeto.id;
    colunaCor.innerHTML = objeto.cor;
    colunaPlaca.innerHTML = objeto.placa;
    colunaVelocidade.innerHTML = objeto.velocidademax + " Km/h";
    colunaEstacionamento.innerHTML = objeto.estacionamento.nome;

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
    linha.appendChild(colunaCor);
    linha.appendChild(colunaPlaca);
    linha.appendChild(colunaVelocidade);
    linha.appendChild(colunaEstacionamento);
    linha.appendChild(colunaOptions);

    return linha;
}

//GET - Retorna todos os carros dentro do banco e gera uma tabela com o JSON de resposta
function criarTabelaCarro() {
    const tabela = document.getElementById("tabelaCarros");

    const url = "http://localhost:8080/carros"
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

                sessionStorage.setItem("paginaFinalCarro", Math.ceil(data.length / linhasPorPagina));
                const maxLinhas = paginaAtual * linhasPorPagina;

                for (let i = (paginaAtual * linhasPorPagina) - linhasPorPagina; i < maxLinhas; i++) {
                    if (data[i] != null) {
                        const linha = criaLinhaTabela(data[i]);
                        tabela.appendChild(linha);
                    }
                }
            }));
}

//GET - Retorna um carro dentro do banco a partir de um ID e gera uma tabela com o JSON de resposta
function criarTabelaCarroId() {
    const tabela = document.getElementById("tabelaCarros");
    tabela.innerText = "";

    const idCarro = document.getElementById("idPesquisaCarro").value;

    if (idCarro != "") {
        const url = `http://localhost:8080/carros/${idCarro}`;
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

                    let linha = criaLinhaTabela(data);
                    tabela.appendChild(linha)
                }))
            .catch(() => alert("Erro! -> Este ID não existe no banco de dados!"));
    }
    else {
        alert("Erro! -> ID não foi informado!");
    }
}

//GET - Retorna um carro dentro do banco a partir de um ID e gera um formulário com o JSON de resposta
function visualizarCarro() {
    const idCarro = sessionStorage.getItem("idCarroAtual");

    const url = `http://localhost:8080/carros/${idCarro}`;
    const options = {
        method: "GET",
        mode: "cors",
        cache: "default"
    }

    fetch(url, options)
        .then(response => response.json()
            .then(data => {
                document.getElementById("id").value = data.id;
                document.getElementById("cor").value = data.cor;
                document.getElementById("placa").value = data.placa;
                document.getElementById("velocidademax").value = data.velocidademax;
                document.getElementById("data").value = data.dataCriacao;
                document.getElementById("estacionamento_id").value = data.estacionamento.nome;
            }))
        .catch(() => alert("Erro! -> Este ID não existe no banco de dados"));
}

//POST - Gera um JSON com os campos do formulario e envia como body da requisição para cadastrar um carro
function salvarCarro() {
    const cor = document.getElementById("cor").value;
    const placa = document.getElementById("placa").value;
    const velocidademax = document.getElementById("velocidademax").value;
    const estacionamento_id = document.getElementById("estacionamento_id").value;

    const url = "http://localhost:8080/carros";
    const body = {
        "cor": cor,
        "placa": placa,
        "velocidademax": velocidademax,
        "estacionamento": {
            "id": estacionamento_id
        }
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
            alert("Carro cadastrado com sucesso!")
            window.location.replace("http://127.0.0.1:5500/frontend/index.html");
        })
        .catch(() => alert("Ocorreu um erro inesperado!"));
}

//PUT - Gera um JSON com os campos do formulario e envia como body da requisição para atualizar um carro por seu Id
function atualizarCarro() {
    const id = sessionStorage.getItem("idCarroAtual");
    const cor = document.getElementById("cor").value;
    const placa = document.getElementById("placa").value;
    const velocidademax = document.getElementById("velocidademax").value;
    const estacionamento_id = document.getElementById("estacionamento_id").value;

    const url = `http://localhost:8080/carros/${id}`;
    const body = {
        "id": id,
        "cor": cor,
        "placa": placa,
        "velocidademax": velocidademax,
        "estacionamento": {
            "id": estacionamento_id
        }
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
            alert("Carro atualizado com sucesso!");
            window.location.replace("http://127.0.0.1:5500/frontend/pages/carro/consultaCarros.html");
        })
        .catch(() => alert("Um erro inesperado ocorreu"));
}

//DELETE - Apaga um carro dentro do banco apartir de um ID
function apagarCarro() {
    const idCarro = sessionStorage.getItem("idCarroAtual");

    const url = `http://localhost:8080/carros/${idCarro}`;
    const options = {
        method: "DELETE",
        mode: "cors",
        cache: "default"
    }

    fetch(url, options)
        .then(() => {
            alert("Carro apagado com sucesso!");
            window.location.replace("http://127.0.0.1:5500/frontend/index.html");
        })
        .catch(() => alert("Erro! -> Este ID não existe no banco de dados."));
}

//Função do botão Editar, redirecionando o usuário para a página de Atualizar Carro
function opcaoAtualizar(id) {
    sessionStorage.setItem("idCarroAtual", id);
    window.location.assign("http://127.0.0.1:5500/frontend/pages/carro/atualizarCarro.html");
}

//Função do botão Visualizar, redirecionando o usuário para a página de Atualizar Carro
function opcaoVisualizar(id) {
    sessionStorage.setItem("idCarroAtual", id);
    window.location.assign("http://127.0.0.1:5500/frontend/pages/carro/visualizarCarro.html");
}

//Função do botão Remover, redirecionando o usuário para a página de Atualizar Carro
function opcaoRemover(id) {
    sessionStorage.setItem("idCarroAtual", id);
    window.location.assign("http://127.0.0.1:5500/frontend/pages/carro/apagarCarro.html");
}

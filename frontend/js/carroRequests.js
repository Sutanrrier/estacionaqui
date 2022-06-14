//Headers para a Fetch API
const myHeaders = new Headers();
myHeaders.append("Content-type", "application/json; charset=UTF-8");

let paginaAtual = 1;
let paginaFinal = paginaAtual+1;

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

function proximaPagina() {
    if(paginaAtual < paginaFinal){
        let tabela = document.getElementById("tabelaCarros");
        tabela.innerText = "";
        let pagina = document.getElementById("numeroPagina").innerText;
        paginaAtual = parseInt(pagina) + 1;
        paginaFinal = paginaAtual + 1;
        document.getElementById("numeroPagina").innerText = paginaAtual;
        criarTabelaCarro();
    }
}

function anteriorPagina() {
    if(paginaAtual > 1){
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

    //Injetando informação nas colunas da linha
    colunaId.innerHTML = "ID";
    colunaCor.innerHTML = "COR";
    colunaPlaca.innerHTML = "PLACA";
    colunaVelocidade.innerHTML = "VELOCIDADE MÁX.";
    colunaEstacionamento.innerHTML = "ESTACIONADO EM";

    //Colocando as colunas dentro da linha
    linha.appendChild(colunaId);
    linha.appendChild(colunaCor);
    linha.appendChild(colunaPlaca);
    linha.appendChild(colunaVelocidade);
    linha.appendChild(colunaEstacionamento);

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

    //Injetando informação nas colunas da linha
    colunaId.innerHTML = objeto.id;
    colunaCor.innerHTML = objeto.cor;
    colunaPlaca.innerHTML = objeto.placa;
    colunaVelocidade.innerHTML = objeto.velocidademax + " Km/h";
    colunaEstacionamento.innerHTML = objeto.estacionamento.nome;

    //Colocando as colunas dentro da linha
    linha.appendChild(colunaId);
    linha.appendChild(colunaCor);
    linha.appendChild(colunaPlaca);
    linha.appendChild(colunaVelocidade);
    linha.appendChild(colunaEstacionamento);

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

                let maxLinhas = paginaAtual * linhasPorPagina;

                for (let i = (paginaAtual * linhasPorPagina) - linhasPorPagina; i < maxLinhas; i++) {
                    if(data[i] != null){
                        const linha = criaLinhaTabela(data[i]);
                        tabela.appendChild(linha);
                    } 
                    else{
                        paginaFinal = paginaAtual;
                        break;
                    }
                }
            }));
}

//GET - Retorna um carro dentro do banco a partir de um ID e gera uma tabela com o JSON de resposta
function criarTabelaCarroId() {
    const tabela = document.getElementById("tabelaCarroId");
    const idCarro = document.getElementById("idPesquisaCarro").value;

    //Checa se existe filhos na tabela e caso exista, remove todos os filhos dela.
    const childrensTabela = tabela.childNodes;
    if (childrensTabela.length > 1) {
        tabela.removeChild(childrensTabela[1]);
        tabela.removeChild(childrensTabela[1]);
    }

    const cabecalho = criaCabecalhoTabela();
    tabela.appendChild(cabecalho);

    const url = `http://localhost:8080/carros/${idCarro}`;
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
            }))
        .catch(e => {
            alert("Carro não encontrado no banco de dados!");
            tabela.removeChild(childrensTabela[1]);
        });

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
        .then(response => {
            (response.status == "201") ? alert("Carro cadastrado com sucesso!") : alert("Ocorreu um erro!");
        })
}

//PUT - Gera um JSON com os campos do formulario e envia como body da requisição para atualizar um carro por seu Id
function atualizarCarro() {
    const id = document.getElementById("id").value;
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
        .then(response => {
            (response.status == "201") ? alert("Carro atualizado com sucesso!") : alert("Erro! -> Este ID não existe no banco!");
        })
}

//DELETE - Apaga um carro dentro do banco apartir de um ID
function apagarCarro() {
    const idCarro = document.getElementById("idPesquisaCarro").value;

    const url = `http://localhost:8080/carros/${idCarro}`;
    const options = {
        method: "DELETE",
        mode: "cors",
        cache: "default"
    }

    fetch(url, options)
        .then(response => {
            (response.ok) ? alert("Carro removido com sucesso!") : alert("Erro! -> Este ID não existe no banco!");
        })
}

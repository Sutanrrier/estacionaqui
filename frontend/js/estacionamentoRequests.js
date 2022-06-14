//Headers para a Fetch API
const myHeaders = new Headers();
myHeaders.append("Content-type", "application/json; charset=UTF-8");

let paginaAtual = 1;
let paginaFinal = paginaAtual+1;

const linhasPorPagina = 5; //Define quantas linhas haverá por página de consulta

//Cria o cabeçalho da tabela
function criaCabecalhoTabela() {
    const linha = document.createElement("tr");

    // Criando as colunas da linha
    let colunaId = document.createElement("th");
    let colunaNome = document.createElement("th");

    //Injetando informação nas colunas da linha
    colunaId.innerHTML = "ID";
    colunaNome.innerHTML = "NOME";

    //Colocando as colunas dentro da linha
    linha.appendChild(colunaId);
    linha.appendChild(colunaNome);

    return linha;
}

//Cria uma linha para a tabela de consulta
function criaLinhaTabela(objeto) {
    let linha = document.createElement("tr");

    // Criando as colunas da linha
    let colunaId = document.createElement("td");
    let colunaNome = document.createElement("td");

    //Injetando informação nas colunas da linha
    colunaId.innerHTML = objeto.id;
    colunaNome.innerHTML = objeto.nome;

    //Colocando as colunas dentro da linha
    linha.appendChild(colunaId);
    linha.appendChild(colunaNome);

    return linha;
}

//Função para passar a próxima página da tabela
function proximaPagina() {
    if(paginaAtual < paginaFinal){
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
    if(paginaAtual > 1){
        let tabela = document.getElementById("tabelaEstacionamento");
        tabela.innerText = "";
        let pagina = document.getElementById("numeroPagina").innerText;
        paginaAtual = parseInt(pagina) - 1;
        document.getElementById("numeroPagina").innerText = paginaAtual;
        criarTabelaEstacionamento();
    }
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
        .then(response => {
            (response.status == "201") ? alert("Estacionamento cadastrado com sucesso!") : alert("Ocorreu um erro!");
        })
}

//PUT - Gera um JSON e envia como body da requisição para atualizar um estacionamento por seu Id
function atualizarEstacionamento() {
    const id = document.getElementById("id").value;
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
        .then(response => {
            (response.status == "201") ? alert("Estacionamento atualizado com sucesso!") : alert("Erro! -> Este ID não existe no banco!");
        })
}

//DELETE - Apaga um carro dentro do banco apartir de um ID
function apagarEstacionamento() {
    const idEstacionamento = document.getElementById("idPesquisaEstacionamento").value;

    const url = `http://localhost:8080/estacionamentos/${idEstacionamento}`;
    const options = {
        method: "DELETE",
        mode: "cors",
        cache: "default"
    }

    fetch(url, options)
        .then(response => {
            (response.ok) ? alert("Estacionamento removido com sucesso!") : alert("Erro! -> Este ID não existe ou não pode ser removido do banco!");
        })
}
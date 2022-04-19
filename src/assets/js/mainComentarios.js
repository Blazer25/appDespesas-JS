//Classe Despesa
class Despesa {
    // Params passados ao construtor, que serão atribuidos aos .this
    constructor(ano, mes, dia, tipo, desc, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.desc = desc
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

// Classe BD
// Gravar os itens (despesas) no armazenamento local do browser.
class Bd {
    constructor() {
        // Pegando o ID armazenado no localStorage
        let id = localStorage.getItem('id')

        // Garantindo que se a chave não existir (null), ela será setada com o ID zero
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    // Setando o próximo ID que sera > que 0
    gerProximoId() {
        let proxId = localStorage.getItem('id')
            // Adicionando +1 ao id a cada vez que for retornado/chamado
        return parseInt(proxId) + 1

    }

    // O parâmetro d é o objeto literal que será convertido em json
    gravar(d) {
        let id = this.gerProximoId()
            // Setando item e salvando ele em JSON pelo .stringify, pois o localStorage lê JSONs
            // O setItem somente irá setar um item pela sua chave e irá atualizar essa chave se alguma key a mais for cadastrada, não gerando novos itens, mas sim, mantendo somente um por chave.
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    //método que recupera os registros de local storage
    recuperarRegistros() {
        //Array que irá receber as despesas
        let arrayDespesas = Array()


        let idRecupera = localStorage.getItem('id')

        // recuperando cada ID cadastrado
        /* Os registros irão vim em formato JSON, então é necessário converter estes
        para o formato de objeto literal, para isso usar a função
        JSON.parse(localStorage.getItem(i)) */
        for (let i = 1; i <= idRecupera; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            /*Se um indice do array por excluido, ele irá retonar o valor null quando for lido,
            para isso, definir uma lógica que irá lidar com isso. */
            if (despesa === null) {
                //o continue dentro de uma interação de laço, irá continuar o código, pulando para a próxima interação
                continue
            }
            // Atribuindo o id ao valor de i
            despesa.id = i
                //Adicionando as despesas dentro do Array que irá as armazenar
            arrayDespesas.push(despesa)
        }
        return arrayDespesas
    }

    //Método para pesquisar e filtrar itens
    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarRegistros()

        //FILTROS
        //Filtrando por Ano:
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //Filtrando por Mês:
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //Filtrando por Dia:
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //Filtrando por Tipo:
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //Filtrando por Descrição:
        if (despesa.desc != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.desc == despesa.desc)
        }

        //Filtrando por Valor:
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        //Retorno do método
        return despesasFiltradas
    }

    //Método para remoção de uma linha das colunas
    removerLinhaTabela(id) {
        // console.log(id)
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let desc = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    // Instanciando objeto
    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        desc.value,
        valor.value
    )
    if (despesa.validarDados() == true) {
        bd.gravar(despesa)
            //chamando a modal de sucesso por jquery/bootstrap
        $('#sucessoGravacao').modal('show')

        //Limpando os campos após ação de sucesso
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        desc.value = ''
        valor.value = ''

    } else {
        //chamando a modal de erro por jquery/bootstrap
        $('#erroGravacao').modal('show')
    }
}

// Função que irá carregar as despesas na página de consultas
function carregaDespesas(despesas = Array(), filtro = false) {

    //Verifica o tamanho do array e se ele tem algum filtro
    if (despesas.length == 0 && filtro == false) {
        //Chamando o método que recupera os registros
        despesas = bd.recuperarRegistros()
    }

    //Variável que irá listas as despesas direto no HTML (tbody)
    listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //percorer o array despesas, para listar seus elementos na tabela
    despesas.forEach(function(d) {

        //Criando a linha da tabela (tr)
        let linha = listaDespesas.insertRow()

        //inserir valores / criando as colunas (td) de 0 a 3 (4 colunas)
        //inserir e exibir os valores pelo .innerHTML
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //O tipo vem como número/id de cada tipo de atividade, então fazer uma condicional para puxar suas respectivas strins
        switch (d.tipo) {
            case '1':
                d.tipo = 'Alimentação'
                break
            case '2':
                d.tipo = 'Educação'
                break
            case '3':
                d.tipo = 'Lazer'
                break
            case '4':
                d.tipo = 'Saúde'
                break
            case '5':
                d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo

        linha.insertCell(2).innerHTML = d.desc
        linha.insertCell(3).innerHTML = d.valor


        //Botão de deletar
        let botaoExcluir = document.createElement("button")
        botaoExcluir.className = 'btn btn-danger'
        botaoExcluir.innerHTML = '<i class="fas fa-times"></i>'
        botaoExcluir.id = 'id_despesa_' + d.id

        botaoExcluir.onclick = function() {
            let id = this.id.replace('id_despesa_', '')
            bd.removerLinhaTabela(id)
            window.location.reload()
        }
        linha.insertCell(4).append(botaoExcluir)

    })
}

// FILTROS DA CONSULTA
function pesquisarDespesa() {
    let pesquisarAno = document.getElementById('ano').value
    let pesquisarMes = document.getElementById('mes').value
    let pesquisarDia = document.getElementById('dia').value
    let pesquisarTipo = document.getElementById('tipo').value
    let pesquisarDesc = document.getElementById('descricao').value
    let pesquisarValor = document.getElementById('valor').value

    //Params / valores que serão passados para a classe Despesa
    let despesa = new Despesa(pesquisarAno, pesquisarMes, pesquisarDia, pesquisarTipo, pesquisarDesc, pesquisarValor)

    let despesas = bd.pesquisar(despesa)

    carregaDespesas(despesas, true)
}
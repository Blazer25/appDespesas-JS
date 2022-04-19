class Despesa {
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

class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    gerProximoId() {
        let proxId = localStorage.getItem('id')
        return parseInt(proxId) + 1
    }

    gravar(d) {
        let id = this.gerProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarRegistros() {
        let arrayDespesas = Array()

        let idRecupera = localStorage.getItem('id')

        for (let i = 1; i <= idRecupera; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if (despesa === null) {
                continue
            }
            despesa.id = i
            arrayDespesas.push(despesa)
        }
        return arrayDespesas
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarRegistros()

        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        if (despesa.desc != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.desc == despesa.desc)
        }

        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    removerLinhaTabela(id) {
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
        $('#sucessoGravacao').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        desc.value = ''
        valor.value = ''

    } else {
        $('#erroGravacao').modal('show')
    }
}

function carregaDespesas(despesas = Array(), filtro = false) {

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarRegistros()
    }

    listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d) {

        let linha = listaDespesas.insertRow()
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

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

function pesquisarDespesa() {
    let pesquisarAno = document.getElementById('ano').value
    let pesquisarMes = document.getElementById('mes').value
    let pesquisarDia = document.getElementById('dia').value
    let pesquisarTipo = document.getElementById('tipo').value
    let pesquisarDesc = document.getElementById('descricao').value
    let pesquisarValor = document.getElementById('valor').value

    let despesa = new Despesa(pesquisarAno, pesquisarMes, pesquisarDia, pesquisarTipo, pesquisarDesc, pesquisarValor)

    let despesas = bd.pesquisar(despesa)

    carregaDespesas(despesas, true)
}
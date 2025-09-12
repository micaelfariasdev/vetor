export function formatarDinheiro(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

export function ConvertMes(mes) {
    const meses = {
        '01': 'Janeiro',
        1: 'Janeiro',
        1: 'Janeiro',
        '02': 'Fevereiro',
        2: 'Fevereiro',
        2: 'Fevereiro',
        '03': 'Março',
        3: 'Março',
        3: 'Março',
        '04': 'Abril',
        4: 'Abril',
        4: 'Abril',
        '05': 'Maio',
        5: 'Maio',
        5: 'Maio',
        '06': 'Junho',
        6: 'Junho',
        6: 'Junho',
        '07': 'Julho',
        7: 'Julho',
        7: 'Julho',
        '08': 'Agosto',
        8: 'Agosto',
        8: 'Agosto',
        '09': 'Setembro',
        9: 'Setembro',
        9: 'Setembro',
        10: 'Outubro',
        10: 'Outubro',
        11: 'Novembro',
        11: 'Novembro',
        12: 'Dezembro',
        12: 'Dezembro',
    };

    return meses[mes] || '';
}
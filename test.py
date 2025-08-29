import requests
from time import sleep

{
    'Alex Araújo dos Santos': 'Servente',
    'Alexssandro da Silva': 'Pedreiro',
    'Ananias da Silva': 'Servente',
    'André Eduardo Sales Sousa': 'Servente',
    'Antonio Carlos Marques da Silva': 'Pedreiro',
    'Antonio de Jesus da Silva': 'Servente',
    'Antonio de Oliveira Araújo': 'Soldador',
    'Antonio dos Santos Silva': 'Operador de betoneira',
    'Antonio Fernandes de Araújo': 'Almoxarife',
    'Antonio Ferreira Calaça': 'Operador de betoneira',
    'Antonio Francisco da Conceição Dias': 'Servente',
    'Antonio Francisco Flor': 'Servente',
    'Antonio José Vieira da Silva': 'Servente',
    'Antonio Luís Alves da Costa': 'Pedreiro',
    'Carlos Alberto Vieira da Silva': 'Pedreiro',
    'Cícero Alves de Alcântara': 'Engenheiro',
    'Claudevandro Fernandes de Sousa': 'Pedreiro',
    'Cosmo Francisco Pereira de Sousa': 'Servente',
    'Diano Elber Pereira da Silva': 'Bombeiro hidráulico',
    'Eciomar da Silva Sousa': 'Servente',
    'Edmilson Sabino da Silva': 'Pedreiro',
    'Eduardo de Sousa Ibiapina': 'Eletricista',
    'Ernando da Silva de Almeida': 'Operador de guincho',
    'Evaldo Veloso Batista': 'Gesseiro',
    'Evandro Nunes Pereira': 'Vigia diurno',
    'Fábio de Sousa Silva': 'Pedreiro',
    'Fernando Luiz Lima Brito': 'Pedreiro',
    'Filipe de Sousa Rodrigues': 'Servente',
    'Flávio Ernesto de Carvalho': 'Carpinteiro',
    'Francinaldo Rocha de Oliveira': 'Eletricista',
    'Francisco das Chagas Pereira da Silva': 'Servente',
    'Francisco Ivan Lima da Costa': 'Enc armador',
    'Francisco José dos Ramos Barbosa': 'Eletricista',
    'Francisco Liberalino da Silva': 'Servente',
    'Francisco Paulo Mendes': 'Vigia noturno',
    'Francisco Williamis Carvalho da Conceição': 'Servente',
    'Gedeão Ferreira Rego': 'Gesseiro',
    'Gilvan Ferreira da Silva': 'Gesseiro',
    'Guilherme Guimarães Martins': 'Servente',
    'Hetlus da Cunha Mendes': 'Servente',
    'Ivonilson Mendes da Rocha': 'Servente',
    'Jailson Macedo Costa': 'Pedreiro',
    'Jairo Tadeu Nogueira Freitas': 'Soldador',
    'João Batista de Araújo Neves': 'Servente',
    'João da Cruz da Silva': 'Carpinteiro',
    'João Paulo Carvalho Soares': 'Apontador',
    'João Soares Rodrigues Filho': 'Eletricista',
    'Jonatas de Sousa Gomes': 'Pedreiro',
    'Josair Vieira dos Anjos': 'Servente',
    'José Borges de Sousa': 'Pintor',
    'José Edilson da Silva': 'Pedreiro',
    'José Fernandes dos Santos': 'Encarregado de obras',
    'José Flávio Diniz': 'Soldador',
    'José Francisco Xavier da Silva': 'Servente',
    'José Vitor do Nascimento': 'Servente',
    'Lismar Marcos Amorim': 'Bombeiro hidráulico',
    'Lourival Luna de Lima': 'Servente',
    'Lourivan de Araújo Gracia': 'Servente',
    'Lucídio da Cruz Silva': 'Pedreiro',
    'Luís Alves Cardoso': 'Vigia noturno',
    'Luís Ernani Alves de Oliveira': 'Servente',
    'Manoel Maria Alexandrino': 'Gesseiro',
    'Marcelo Mendes da Rocha': 'EncBombeiro hid',
    'Marco Aurélio Braga Silva': 'Assist. Engenharia',
    'Martiliano Vieira de Oliveira': 'Pedreiro',
    'Micael Riquelme da Silva Farias': 'Auxiliar de Engenheiro',
    'Paulo Gilberto Barbosa de Sousa': 'Pedreiro',
    'Pedro Henrique Borges Viana': 'Servente',
    'Renato Pires da Silva': 'Servente',
    'Richarderson Anderson Gomes da Silva': 'Servente',
    'Roberto Carneiro de Sousa': 'Vigia diurno',
    'Roberto Corrêa Machado Oliveira': 'Pintor',
    'Ronaldo Ferreira de Sales': 'Bombeiro hidráulico',
    'Ruan Augusto Mendes Batista': 'Servente',
    'Samuel Cabral Silva': 'Gesseiro',
    'Tiago dos Santos Sousa': 'Bombeiro hidráulico',
    'Ubiraneles Mendes Leal': 'Gesseiro'
}

url_da_api = 'https://vetor-api.micaelfarias.com/api/ponto/'

for i in range(1, 10):
    try:
        print(f"Tentando excluir recurso com ID {i}...")

        response = requests.delete(f'{url_da_api}{i}/')

        if response.status_code == 204 or response.status_code == 200:
            print(f"Recurso com ID {i} foi excluído com sucesso.")
        else:
            print(
                f"Erro ao excluir o recurso com ID {i}. Status Code: {response.status_code}")
            print(f"Mensagem da API: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"Ocorreu um erro de conexão ao tentar excluir o ID {i}: {e}")

    sleep(0.5)

print("\nProcesso de exclusão concluído.")

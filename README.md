<div id="topo"></div>

📜 Índice
===

* [Sobre o projeto](#about)
* [Pré-requisitos](#install)
* [Configuração](#setup)
* [Execução](#exe)

<br>

## 💻 Sobre o projeto <a name="about"></a>

**League of Legends Ranking** trata-se de um projeto que visa classificar os times de um determinado campeonato de acordo com os dados fornecidos ao final da partida – ouro, torres destruídas, etc. Nesse contexto, há o programa que busca os dados necessários de um site (Scrapper) e a aplicação responsável pela parte algébrica do trabalho. Para mais detalhes teóricos acesse o relatório [clicando aqui](https://github.com/danielShz/Trabalho-Final-ALA/wiki/Relat%C3%B3rio).

## 🔨 Pré-requisitos <a name="install"></a>

Para executar o projeto você precisará ter instaladas as seguintes ferramentas:

### Ferramentas
- [Node.js](https://nodejs.org/en/)
- [Julia](https://julialang.org/)

### Versões das Ferramentas
- Node.js (v16.15.1)
- Julia (1.7.2)

<p align="right"><a href="#top">Voltar ao topo</a></p>

## 🔧 Configuração <a name="setup"></a>
### Depois de instalar as ferramentas anteriores

1. Atualize o arquivo **Scrapper/.env** na variável *CHAMPIONSHIP_PAGE* com o URL de algum campeonato presente no site [Leaguepedia](https://lol.fandom.com/).
   > 💡 Para a obtenção de resultados mais efetivos, busque selecionar a fase regular do campeonato 

   ```.env
   ROOT_PAGE=https://lol.fandom.com
   CHAMPIONSHIP_PAGE=https://lol.fandom.com/wiki/CBLOL/2022_Season/Split_1

   ...
   ```
2. No diretório raiz **Scrapper/** utilizar os comandos a seguir
   - Instalação dos pacotes
      ```bash
      npm i
      ```
   - Busca dos dados do campeonato
      ```bash
      npm run index.js
      ```

<p align="right"><a href="#top">Voltar ao topo</a></p>

## 🚀 Execução <a name="exe"></a>
   A parte algébrica do programa possui 5 arquivos executáveis:

   1. **calculateDataPercent.jl**

      Calcula a quantidade relativa de vezes nas quais o time que obteve vantagem num critério venceu a partida
   2. **calculateSystemError.jl**

      Calcula o erro absoluto e o erro relativo do ranking
   3. **championshipClassify.jl**

      Calcula o time que ficou com determinado lugar no ranking
   4. **roundClassify.jl**

      Calcula o ranking completo dos times de acordo com a quantidade de partidas escolhida

   Para executar os programas, acesse no diretório raiz **System/** e utilize o seguinte comando:
   ```bash
   julia nome_do_arquivo.jl
   ```

<p align="right"><a href="#top">Voltar ao topo</a></p>

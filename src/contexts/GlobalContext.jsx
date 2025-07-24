import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

const STORAGE_KEY = "conversorTekState";

const itensBase = [
  { nome: "Tek Ceilings", cotacao: 100 },
  { nome: "Tek Walls", cotacao: 120 },
  { nome: "Tek Foundations", cotacao: 80 },
  { nome: "Tek Stairs", cotacao: 165 },
  { nome: "Tek Quarter Walls", cotacao: 300 },
  { nome: "Tek Quarter Ceilings", cotacao: 150 },
  { nome: "Tek Triangle Foundations", cotacao: 145 },
  { nome: "Tek Pillars", cotacao: 200 },
  { nome: "Tek Large Walls", cotacao: 50 },
  { nome: "Tek Generators", cotacao: 3 },
  { nome: "Tek Cloning Chamber", cotacao: 1 },
  { nome: "Tek Transmitters", cotacao: 3 },
  { nome: "Tek Troughs", cotacao: 5 },
  { nome: "Small TP", cotacao: 8 },
  { nome: "Medium TP", cotacao: 2 },
  { nome: "Large TP", cotacao: 1 },
  { nome: "Tek Behemoth Gateway Sets", cotacao: 2 },
  { nome: "Tek Dino Gate Sets", cotacao: 50 },
  { nome: "Vacuum Compartments", cotacao: 15 },
  { nome: "Polymer", cotacao: 10000 },
  { nome: "Dust", cotacao: 75000 },
  { nome: "Element", cotacao: 100 },
  { nome: "Metal", cotacao: 35000 },
  { nome: "Shotgun shells", cotacao: 15000 },
];

export const GlobalContextProvider = ({ children }) => {
  const [usuarioLogado, setUsuarioLogado] = useState("Gill Bates");
  const idadeUsuario = "55";

  const [tekValue, setTekValue] = useState(100);
  const [cotacoes, setCotacoes] = useState(itensBase);
  const [pagamentoMontado, setPagamentoMontado] = useState(
    itensBase.map((item) => ({ ...item, quantidade: 0 }))
  );
  const [entrada, setEntrada] = useState(itensBase[0].nome);
  const [saida, setSaida] = useState(itensBase[1].nome);
  const [quantidadeConversao, setQuantidadeConversao] = useState(100);
  const [visiveis, setVisiveis] = useState(
    itensBase.reduce((acc, item) => ({ ...acc, [item.nome]: true }), {})
  );

  useEffect(() => {
    const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (salvo) {
      if (salvo.cotacoes) setCotacoes(salvo.cotacoes);
      if (salvo.visiveis) setVisiveis(salvo.visiveis);
      if (salvo.tekValue) setTekValue(salvo.tekValue);
      if (salvo.pagamentoMontado) setPagamentoMontado(salvo.pagamentoMontado);
      if (salvo.entrada) setEntrada(salvo.entrada);
      if (salvo.saida) setSaida(salvo.saida);
      if (salvo.quantidadeConversao) setQuantidadeConversao(salvo.quantidadeConversao);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        cotacoes,
        visiveis,
        tekValue,
        pagamentoMontado,
        entrada,
        saida,
        quantidadeConversao,
      })
    );
  }, [cotacoes, visiveis, tekValue, pagamentoMontado, entrada, saida, quantidadeConversao]);

  const resetarTudo = () => {
    setCotacoes(itensBase);
    setVisiveis(itensBase.reduce((acc, item) => ({ ...acc, [item.nome]: true }), {}));
    localStorage.removeItem(STORAGE_KEY);
  };

  const toggleVisibilidade = (nome) => {
    setVisiveis((prev) => ({ ...prev, [nome]: !prev[nome] }));
  };

  return (
    <GlobalContext.Provider
      value={{
        usuarioLogado,
        setUsuarioLogado,
        idadeUsuario,
        tekValue,
        setTekValue,
        cotacoes,
        setCotacoes,
        pagamentoMontado,
        setPagamentoMontado,
        entrada,
        setEntrada,
        saida,
        setSaida,
        quantidadeConversao,
        setQuantidadeConversao,
        visiveis,
        setVisiveis,
        toggleVisibilidade,
        resetarTudo,
        itensBase
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};



// import { createContext, useState } from "react";

// export const GlobalContext = createContext()

// export const GlobalContextProvider = ({children}) => {
// // let usuarioLogado = 'Gill Bates'
// const [usuarioLogado, setUsuarioLogado] = useState('Gill Bates')
// let idadeUsuario = '55'

//     return(
//         <GlobalContext.Provider value={{
//             usuarioLogado,
//             setUsuarioLogado,
//             idadeUsuario
//             }}>
//             {children}
//         </GlobalContext.Provider>
//     )
// }

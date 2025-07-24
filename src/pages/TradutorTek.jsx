import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import "./ConversorTek.css";

export default function TradutorTek() {
  const {
    entrada,
    setEntrada,
    saida,
    setSaida,
    quantidadeConversao,
    setQuantidadeConversao,
    cotacoes,
    visiveis,
  } = useContext(GlobalContext);

  const [valorConvertido, setValorConvertido] = useState(0);

  const itensVisiveis = cotacoes.filter((item) => visiveis[item.nome]);

  useEffect(() => {
    const cotacaoEntrada = cotacoes.find((i) => i.nome === entrada)?.cotacao || 1;
    const cotacaoSaida = cotacoes.find((i) => i.nome === saida)?.cotacao || 1;
    const resultado = ((100 / cotacaoEntrada) * quantidadeConversao * cotacaoSaida) / 100;
    setValorConvertido(resultado);
  }, [quantidadeConversao, entrada, saida, cotacoes]);

  const handleConvertidoEdit = (valor) => {
    const cotacaoEntrada = cotacoes.find((i) => i.nome === entrada)?.cotacao || 1;
    const cotacaoSaida = cotacoes.find((i) => i.nome === saida)?.cotacao || 1;
    const inverso = ((100 / cotacaoSaida) * valor * cotacaoEntrada) / 100;
    setQuantidadeConversao(inverso);
    setValorConvertido(valor);
  };

  return (
    <div className="conversor-container">
      <h1>Conversor Direto</h1>

      <section className="ferramenta">
        <h2>💱 Conversor direto entre unidades</h2>
        <div className="conversor-direto">
          <select className="select-unidade" value={entrada} onChange={(e) => setEntrada(e.target.value)}>
            {itensVisiveis.map((item) => (
              <option key={item.nome}>{item.nome}</option>
            ))}
          </select>

          <input
            className="input-number"
            type="number"
            value={quantidadeConversao}
            onChange={(e) => setQuantidadeConversao(parseFloat(e.target.value) || 0)}
          />

          <span style={{ fontSize: "1.5rem", color: "var(--cor-laranja)" }}>⇄</span>

          <input
            className="input-number"
            type="number"
            value={valorConvertido.toFixed(2)}
            onChange={(e) => handleConvertidoEdit(parseFloat(e.target.value) || 0)}
          />

          <select className="select-unidade" value={saida} onChange={(e) => setSaida(e.target.value)}>
            {itensVisiveis.map((item) => (
              <option key={item.nome}>{item.nome}</option>
            ))}
          </select>
        </div>
      </section>
    </div>
  );
}

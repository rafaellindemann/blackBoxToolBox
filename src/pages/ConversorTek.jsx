import { useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import "./ConversorTek.css";
import { FaCog } from "react-icons/fa";

export default function ConversorTek() {
  const {
    tekValue,
    setTekValue,
    cotacoes,
    setCotacoes,
    visiveis,
    toggleVisibilidade,
    resetarTudo,
  } = useContext(GlobalContext);

  const handleCotacaoChange = (index, valor) => {
    const novas = [...cotacoes];
    novas[index].cotacao = parseFloat(valor) || 0;
    setCotacoes(novas);
  };

  const calcularQuantidade = (cotacao) => (cotacao / 100) * tekValue;
  const itensVisiveis = cotacoes.filter((item) => visiveis[item.nome]);

  return (
    <div className="conversor-container">
      <h1>
        Conversor de Tek
        {/* <button className="btn-config" onClick={() => alert("Configuração movida para outro lugar.")}>
          <FaCog />
        </button> */}
      </h1>

      <section className="ferramenta">
        <h2>💲 Quantos itens preciso para pagar X Tek? 💲</h2>
        <label>
          Valor em Tek:
          <input
            className="input-number"
            type="number"
            value={tekValue}
            onChange={(e) => setTekValue(parseFloat(e.target.value) || 0)}
          />
        </label>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Cotação (por 100 Tek)</th>
              <th>Quantidade necessária</th>
            </tr>
          </thead>
          <tbody>
            {itensVisiveis.map((item, i) => {
              const valor = calcularQuantidade(item.cotacao);
              const redondo = Number.isInteger(valor);
              return (
                <tr key={item.nome}>
                  <td>{item.nome}</td>
                  <td>
                    <input
                      className="input-number"
                      type="number"
                      value={item.cotacao}
                      onChange={(e) => handleCotacaoChange(i, e.target.value)}
                    />
                  </td>
                  <td style={{ color: redondo ? "var(--cor-verde)" : "inherit" }}>
                    {valor.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}


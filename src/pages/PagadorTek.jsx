import { useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import "./ConversorTek.css";

export default function PagadorTek() {
  const {
    tekValue,
    setTekValue,
    pagamentoMontado,
    setPagamentoMontado,
    visiveis,
  } = useContext(GlobalContext);

  const calcularValorMontado = (item) => (100 / item.cotacao) * item.quantidade;
  const totalMontado = pagamentoMontado.reduce(
    (acc, item) => acc + (visiveis[item.nome] ? calcularValorMontado(item) : 0),
    0
  );

  return (
    <div className="conversor-container">
      <h1>Monte seu pagamento Tek</h1>

      <section className="ferramenta">
        <h2>🧱📐 Monte um pagamento com os itens que você tem</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label>Valor a pagar:</label>
            <input
              className="input-number"
              type="number"
              value={tekValue}
              onChange={(e) => setTekValue(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div style={{ fontWeight: 'bold', color: totalMontado >= tekValue ? 'var(--cor-verde)' : 'inherit' }}>
            Total montado: {totalMontado.toFixed(2)} Tek
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantidade</th>
              <th>Valor em Tek</th>
            </tr>
          </thead>
          <tbody>
            {pagamentoMontado.filter((item) => visiveis[item.nome]).map((item, i) => (
              <tr key={item.nome}>
                <td>{item.nome}</td>
                <td>
                  <input
                    className="input-number"
                    type="number"
                    value={item.quantidade}
                    onChange={(e) => {
                      const nova = [...pagamentoMontado];
                      nova[i].quantidade = parseFloat(e.target.value) || 0;
                      setPagamentoMontado(nova);
                    }}
                  />
                </td>
                <td>{calcularValorMontado(item).toFixed(2)} Tek</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: '-1rem', fontWeight: 'bold' }}>
          Total montado: {totalMontado.toFixed(2)} Tek
        </p>
      </section>
    </div>
  );
}

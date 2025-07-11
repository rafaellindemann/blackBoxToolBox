import { useState, useEffect } from "react";
import "./ConversorTek.css";

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


export default function ConversorTek() {
  const [tekValue, setTekValue] = useState(100);
  const [cotacoes, setCotacoes] = useState(itensBase);
  const [pagamentoMontado, setPagamentoMontado] = useState(
    itensBase.map((item) => ({ ...item, quantidade: 0 }))
  );
  const [entrada, setEntrada] = useState(itensBase[0].nome);
  const [saida, setSaida] = useState(itensBase[1].nome);
  const [quantidadeConversao, setQuantidadeConversao] = useState(100);
  const [valorConvertido, setValorConvertido] = useState(0);

  useEffect(() => {
    setPagamentoMontado(
      cotacoes.map((item) => {
        const original = pagamentoMontado.find((i) => i.nome === item.nome);
        return { ...item, quantidade: original ? original.quantidade : 0 };
      })
    );
  }, [cotacoes]);

  useEffect(() => {
    const cotacaoEntrada = cotacoes.find((i) => i.nome === entrada)?.cotacao || 1;
    const cotacaoSaida = cotacoes.find((i) => i.nome === saida)?.cotacao || 1;
    const resultado = ((100 / cotacaoEntrada) * quantidadeConversao * cotacaoSaida) / 100;
    setValorConvertido(resultado);
  }, [quantidadeConversao, entrada, saida, cotacoes]);

  const handleCotacaoChange = (index, valor) => {
    const novas = [...cotacoes];
    novas[index].cotacao = parseFloat(valor) || 0;
    setCotacoes(novas);
  };

  const calcularQuantidade = (cotacao) => (cotacao / 100) * tekValue;
  const calcularValorMontado = (item) => (100 / item.cotacao) * item.quantidade;
  const totalMontado = pagamentoMontado.reduce(
    (acc, item) => acc + calcularValorMontado(item),
    0
  );

  const handleConvertidoEdit = (valor) => {
    const cotacaoEntrada = cotacoes.find((i) => i.nome === entrada)?.cotacao || 1;
    const cotacaoSaida = cotacoes.find((i) => i.nome === saida)?.cotacao || 1;
    const inverso = ((100 / cotacaoSaida) * valor * cotacaoEntrada) / 100;
    setQuantidadeConversao(inverso);
    setValorConvertido(valor);
  };

  return (
    <div className="conversor-container">
      <h1>Conversor de Tek</h1>
      <main className="ferramentas-container">

      

      {/* Ferramenta 1 */}
      <section className="ferramenta">
        {/* <h2>1️⃣💲 Quantos itens preciso para pagar X Tek?</h2> */}
        <h2>💲 Quantos itens preciso para pagar X Tek? 💲</h2>
        <label htmlFor="">Valor em Tek: 
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
            {cotacoes.map((item, i) => {
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
                  <td style={{ color: redondo ? 'limegreen' : 'inherit' }}>
                    {valor.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Ferramenta 2 */}
      <section className="ferramenta">
        {/* <h2>2️⃣ Monte um pagamento com os itens que você tem</h2> */}
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
          <div style={{ fontWeight: 'bold', color: totalMontado >= tekValue ? 'limegreen' : 'inherit' }}>
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
            {pagamentoMontado.map((item, i) => (
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

      {/* Ferramenta 3 */}
      <section className="ferramenta">
        {/* <h2>3️⃣ Conversor direto entre unidades</h2> */}
        <h2>💱 Conversor direto entre unidades</h2>
        <div className="conversor-direto">
          <select value={entrada} onChange={(e) => setEntrada(e.target.value)}>
            {cotacoes.map((item) => (
              <option key={item.nome}>{item.nome}</option>
            ))}
          </select>

          <input
            className="input-number"
            type="number"
            value={quantidadeConversao}
            onChange={(e) => setQuantidadeConversao(parseFloat(e.target.value) || 0)}
          />

          <span style={{ fontSize: '1.5rem', color: '#ffa533' }}>⇄</span>

          <input
            className="input-number"
            type="number"
            value={valorConvertido.toFixed(2)}
            onChange={(e) => handleConvertidoEdit(parseFloat(e.target.value) || 0)}
          />

          <select value={saida} onChange={(e) => setSaida(e.target.value)}>
            {cotacoes.map((item) => (
              <option key={item.nome}>{item.nome}</option>
            ))}
          </select>
        </div>
      </section>
      </main>
    </div>
  );
}


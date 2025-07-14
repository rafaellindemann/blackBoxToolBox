import React, { useState, useEffect } from 'react';
import './DinoNameGenerator.css';

const LOCAL_STORAGE_KEY = 'dino_species';

function getSpeciesFromStorage() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

function saveSpeciesToStorage(species) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(species));
}

export default function DinoNameGenerator() {
  const [speciesList, setSpeciesList] = useState(getSpeciesFromStorage());
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [sex, setSex] = useState('m');
  const [imprint, setImprint] = useState(100);
  const [imprinter, setImprinter] = useState('');
  const [suffix, setSuffix] = useState('');
  const [manualSeq, setManualSeq] = useState(null);
  const [generatedName, setGeneratedName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ name: '', code: '', last: 0 });

  useEffect(() => {
    saveSpeciesToStorage(speciesList);
  }, [speciesList]);

  function handleGenerate() {
    if (!selectedSpecies) return;

    const nnn = String(
      manualSeq !== null ? parseInt(manualSeq) : selectedSpecies.last + 1
    ).padStart(3, '0');
    const xxx = String(imprint).padStart(3, '0');
    const name = `${selectedSpecies.code}${nnn}${sex}-${xxx}${imprinter}${suffix ? '-' + suffix : ''}`;
    setGeneratedName(name);

    if (manualSeq === null) {
      const updatedSpecies = speciesList.map(s => {
        if (s.code === selectedSpecies.code) {
          s.last += 1;
        }
        return s;
      });
      setSpeciesList(updatedSpecies);
    }

    navigator.clipboard.writeText(name);
  }

  function handleAddSpecies() {
    if (!modalData.name || !modalData.code) return;
    const newList = [...speciesList, { ...modalData, last: parseInt(modalData.last) || 0 }];
    setSpeciesList(newList);
    setModalData({ name: '', code: '', last: 0 });
    setShowModal(false);
  }

  function copyStorageToClipboard() {
    navigator.clipboard.writeText(JSON.stringify(speciesList, null, 2));
  }

  function handleDeleteSpecies(code) {
    if (window.confirm('Tem certeza que deseja remover esta espécie?')) {
      setSpeciesList(speciesList.filter(s => s.code !== code));
      if (selectedSpecies && selectedSpecies.code === code) {
        setSelectedSpecies(null);
      }
    }
  }

  function handleEditSpecies(species) {
    setModalData(species);
    setShowModal(true);
  }

  return (
    <div className="generator dark-theme">
      <h2>Gerador de Nomes para Dinossauros</h2>
      <div className="columns">
        <div className="column">
          <label>Espécies Cadastradas:</label>
          {speciesList.map(s => (
            <div key={s.code} className="species-item">
              <label>
                <input
                  type="radio"
                  name="species"
                  value={s.code}
                  onChange={() => {
                    setSelectedSpecies(s);
                    setManualSeq(null);
                  }}
                  checked={selectedSpecies?.code === s.code}
                />
                <input
                  type="text"
                  className="input-text"
                  value={s.code}
                  onChange={(e) => {
                    const newList = speciesList.map(sp =>
                      sp.code === s.code ? { ...sp, code: e.target.value } : sp
                    );
                    setSpeciesList(newList);
                  }}
                />
                {s.name}
              </label>
              <span className="icons">
                <button className="edit" onClick={() => handleEditSpecies(s)}>✏️</button>
                <button className="delete" onClick={() => handleDeleteSpecies(s.code)}>❌</button>
              </span>
            </div>
          ))}
        </div>

        <div className="column">
          <label>Sequencial:</label>
          <input
            type="number"
            className="input-number"
            placeholder={selectedSpecies ? String(selectedSpecies.last + 1).padStart(3, '0') : '---'}
            value={manualSeq !== null ? manualSeq : ''}
            onChange={e => setManualSeq(e.target.value)}
          />
        </div>

        <div className="column">
          <label>Sexo:</label>
          <input
            type="text"
            className="input-text"
            value={sex}
            maxLength={1}
            onChange={e => setSex(e.target.value.toLowerCase())}
          />
        </div>

        <div className="column">
          <label>% de Imprint:</label>
          <input type="number" className="input-number" value={imprint} onChange={e => setImprint(e.target.value)} />
        </div>

        <div className="column">
          <label>Imprintador:</label>
          <input type="text" className="input-text" value={imprinter} onChange={e => setImprinter(e.target.value)} />
        </div>

        <div className="column">
          <label>Texto Livre:</label>
          <input type="text" className="input-text" placeholder="opcional" value={suffix} onChange={e => setSuffix(e.target.value)} />
        </div>
      </div>

      <button onClick={handleGenerate}>Gerar Nome</button>
      <button onClick={() => setShowModal(true)}>Cadastrar Espécie</button>
      <button onClick={copyStorageToClipboard}>Copiar LocalStorage</button>

      <div className={`generated-name ${generatedName ? 'show' : ''}`} onClick={() => navigator.clipboard.writeText(generatedName)}>
        {generatedName}
      </div>

      {showModal && (
        <div className="modal animated">
          <div className="modal-content">
            <label>Nome da Espécie:
              <input type="text" className="input-text" value={modalData.name} onChange={e => setModalData({ ...modalData, name: e.target.value })} />
            </label>
            <label>Código (3 letras):
              <input type="text" className="input-text" value={modalData.code} onChange={e => setModalData({ ...modalData, code: e.target.value })} />
            </label>
            <label>Último Número Usado:
              <input type="number" className="input-number" value={modalData.last} onChange={e => setModalData({ ...modalData, last: e.target.value })} />
            </label>
            <button onClick={handleAddSpecies}>Salvar</button>
            <button onClick={() => setShowModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

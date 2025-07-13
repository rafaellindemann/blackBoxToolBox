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
  const [generatedName, setGeneratedName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ name: '', code: '', last: 0 });

  useEffect(() => {
    saveSpeciesToStorage(speciesList);
  }, [speciesList]);

  function handleGenerate() {
    if (!selectedSpecies) return;

    const updatedSpecies = speciesList.map(s => {
      if (s.code === selectedSpecies.code) {
        s.last += 1;
      }
      return s;
    });
    setSpeciesList(updatedSpecies);

    const nnn = String(selectedSpecies.last + 1).padStart(3, '0');
    const xxx = String(imprint).padStart(3, '0');
    const name = `${selectedSpecies.code}${nnn}${sex}-${xxx}${imprinter}${suffix ? '-' + suffix : ''}`;
    setGeneratedName(name);

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

  return (
    <div className="generator dark-theme">
      <div className="columns">
        <div className="column">
          {speciesList.map(s => (
            <label key={s.code}>
              <input
                type="radio"
                name="species"
                value={s.code}
                onChange={() => setSelectedSpecies(s)}
              />
              <input
                type="text"
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
          ))}
        </div>
        <div className="column">
          <span>{selectedSpecies ? String(selectedSpecies.last + 1).padStart(3, '0') : '---'}</span>
        </div>
        <div className="column">
          <label><input type="radio" name="sex" value="m" onChange={() => setSex('m')} checked={sex === 'm'} /> M</label>
          <label><input type="radio" name="sex" value="f" onChange={() => setSex('f')} checked={sex === 'f'} /> F</label>
          <label><input type="radio" name="sex" value="x" onChange={() => setSex('x')} checked={sex === 'x'} /> X</label>
        </div>
        <div className="column">
          <input type="number" value={imprint} onChange={e => setImprint(e.target.value)} />
        </div>
        <div className="column">
          <input type="text" value={imprinter} onChange={e => setImprinter(e.target.value)} />
        </div>
        <div className="column">
          <input type="text" placeholder="Texto livre" value={suffix} onChange={e => setSuffix(e.target.value)} />
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
            <label>Nome: <input type="text" value={modalData.name} onChange={e => setModalData({ ...modalData, name: e.target.value })} /></label>
            <label>Código (3 letras): <input type="text" value={modalData.code} onChange={e => setModalData({ ...modalData, code: e.target.value })} /></label>
            <label>Último Número Usado: <input type="number" value={modalData.last} onChange={e => setModalData({ ...modalData, last: e.target.value })} /></label>
            <button onClick={handleAddSpecies}>Salvar</button>
            <button onClick={() => setShowModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

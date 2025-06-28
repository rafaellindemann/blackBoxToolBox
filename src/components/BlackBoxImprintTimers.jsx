// BlackBoxImprintTimers.jsx
import React, { useState, useEffect } from "react";
import "./BlackBoxImprintTimers.css";

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 5);

const formatTime = (seconds) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const TimerCard = ({ timer, onToggle, onDelete, onEdit }) => {
  useEffect(() => {
    if (timer.timeLeft === 0 && timer.sound) {
      const sound = new Audio("/baby-cry.mp3");
      sound.play();

      let notifyInterval = setInterval(() => {
        document.title =
          document.title === "⏰ Time's up!" ? " " : "⏰ Time's up!";
      }, 800);

      return () => {
        clearInterval(notifyInterval);
        document.title = "Black Box Imprint Timers";
      };
    }
  }, [timer.timeLeft, timer.sound]);

  return (
    <div
      className={`timer-card ${timer.timeLeft === 0 ? "timer-alert" : ""}`}
    >
      <div className="timer-label">{timer.label || "(unnamed)"}</div>
      <div className="timer-time">{formatTime(timer.timeLeft)}</div>
      <div className="timer-controls">
        <button onClick={() => onToggle(timer.id)}>
          {timer.running ? "Pause" : "Resume"}
        </button>
        <button onClick={() => onEdit(timer.id)}>Edit</button>
        <button onClick={() => onDelete(timer.id)} className="delete">
          Delete
        </button>
      </div>
    </div>
  );
};

const BlackBoxImprintTimers = () => {
  const [timers, setTimers] = useState([]);
  const [form, setForm] = useState({ label: "", hours: 0, minutes: 0, seconds: 0 });
  const [editId, setEditId] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("blackBoxTimers"));
    if (Array.isArray(saved) && saved.length > 0) {
      saved.forEach((t) => (t.running = false));
      setTimers(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("blackBoxTimers", JSON.stringify(timers));
  }, [timers]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) =>
          t.running && t.timeLeft > 0 ? { ...t, timeLeft: t.timeLeft - 1 } : t
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = () => {
    const totalSeconds =
      Number(form.hours) * 3600 + Number(form.minutes) * 60 + Number(form.seconds);
    if (totalSeconds === 0) return;

    const newTimer = {
      id: editId || generateId(),
      label: form.label,
      total: totalSeconds,
      timeLeft: totalSeconds,
      running: true,
      sound: soundEnabled,
    };

    setTimers((prev) => {
      let updated = editId
        ? prev.map((t) => (t.id === editId ? newTimer : t))
        : [...prev, newTimer];
      updated.sort((a, b) => a.timeLeft - b.timeLeft);
      return updated;
    });

    setForm({ label: "", hours: 0, minutes: 0, seconds: 0 });
    setEditId(null);
  };

  const handleToggle = (id) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, running: !t.running } : t))
    );
  };

  const handleDelete = (id) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEdit = (id) => {
    const t = timers.find((t) => t.id === id);
    setForm({
      label: t.label,
      hours: Math.floor(t.total / 3600),
      minutes: Math.floor((t.total % 3600) / 60),
      seconds: t.total % 60,
    });
    setEditId(id);
  };

  return (
    <>
      <div className="form-header">
        <h1>Black Box Imprint Timers</h1>
        <div className="form-group">
          <input
            type="text"
            placeholder="Timer name"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          <input
            type="number"
            min="0"
            placeholder="HH"
            value={form.hours}
            onChange={(e) => setForm({ ...form, hours: e.target.value })}
          />
          <input
            type="number"
            min="0"
            placeholder="MM"
            value={form.minutes}
            onChange={(e) => setForm({ ...form, minutes: e.target.value })}
          />
          <input
            type="number"
            min="0"
            placeholder="SS"
            value={form.seconds}
            onChange={(e) => setForm({ ...form, seconds: e.target.value })}
          />
          <button onClick={handleAdd}>{editId ? "Save" : "Add"}</button>
        </div>
        <label className="sound-toggle">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
          />
          🔊
        </label>
      </div>

      <div className="timer-list">
        {timers.map((timer) => (
          <TimerCard
            key={timer.id}
            timer={timer}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </>
  );
};

export default BlackBoxImprintTimers;

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Clock, AlertTriangle, Plus, Trash2, Edit2, 
  Calendar, LayoutGrid, List, Key, LogIn, RefreshCw, Layers, ShieldCheck, Check
} from 'lucide-react';

export default function TaskDashboard() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Revisar relatório de T.I.', category: 'T.I.', priority: 'Alta', status: 'Em Progresso', dueDate: '2026-11-05', checklist: [{ id: 'c1', title: 'Verificar servidores', done: true }] },
    { id: '2', title: 'Manutenção da Engenharia', category: 'Engenharia', priority: 'Média', status: 'Pendente', dueDate: '2026-11-10', checklist: [] },
    { id: '3', title: 'Vistoria Predial', category: 'Manutenção', priority: 'Baixa', status: 'Concluída', dueDate: '2026-11-01', checklist: [] }
  ]);
  const [view, setView] = useState('kanban');
  const [clientId, setClientId] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('T.I.');
  const [newPriority, setNewPriority] = useState('Média');

  const addLocalTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      status: 'Pendente',
      dueDate: new Date().toISOString().split('T')[0],
      checklist: []
    };
    setTasks([...tasks, newTask]);
    setNewTitle('');
  };

  const toggleStatus = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Concluída' ? 'Pendente' : 'Concluída' } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="text-indigo-400" /> Gestão de Tarefas Executiva
          </h1>
          <p className="text-slate-400 text-sm">Painel Integrado | Google Tasks & Agenda</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView(view === 'kanban' ? 'list' : 'kanban')}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm border border-slate-700 transition"
          >
            {view === 'kanban' ? <List size={16} /> : <LayoutGrid size={16} />}
            {view === 'kanban' ? 'Visão Lista' : 'Visão Kanban'}
          </button>

          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition"
          >
            <Key size={16} /> Configurar Google API
          </button>
        </div>
      </header>

      {showConfig && (
        <div className="bg-slate-800 border border-indigo-500/30 p-4 rounded-xl mb-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <ShieldCheck className="text-indigo-400" /> Google API Client ID
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Cole o seu Client ID criado no Google Cloud Console para ativar a sincronização em tempo real.
          </p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="000000000000-xxxx.apps.googleusercontent.com"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button 
              onClick={() => { setIsConnected(true); setShowConfig(false); }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Salvar e Conectar
            </button>
          </div>
        </div>
      )}

      {/* Formulário de Nova Tarefa */}
      <form onSubmit={addLocalTask} className="bg-slate-800 p-4 rounded-xl mb-8 border border-slate-700 flex flex-wrap md:flex-nowrap gap-3 items-center">
        <input 
          type="text" 
          placeholder="Digite a nova tarefa..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 min-w-[200px] bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
        <select 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
        >
          <option value="T.I.">T.I.</option>
          <option value="Engenharia">Engenharia</option>
          <option value="Manutenção">Manutenção</option>
          <option value="Geral">Geral</option>
        </select>
        <select 
          value={newPriority} 
          onChange={(e) => setNewPriority(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
        >
          <option value="Alta">Prioridade Alta</option>
          <option value="Média">Prioridade Média</option>
          <option value="Baixa">Prioridade Baixa</option>
        </select>
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition">
          <Plus size={16} /> Adicionar
        </button>
      </form>

      {/* Quadro Kanban */}
      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Pendente', 'Em Progresso', 'Concluída'].map((colStatus) => (
            <div key={colStatus} className="bg-slate-800/50 border border-slate-800 rounded-xl p-4">
              <h2 className="font-semibold text-slate-300 mb-4 pb-2 border-b border-slate-700 flex justify-between items-center">
                <span>{colStatus}</span>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                  {tasks.filter(t => t.status === colStatus).length}
                </span>
              </h2>
              <div className="space-y-3">
                {tasks.filter(t => t.status === colStatus).map((task) => (
                  <div key={task.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm hover:border-slate-600 transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {task.category}
                      </span>
                      <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-rose-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h4 className="font-medium text-slate-200 mb-2">{task.title}</h4>
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-4 pt-2 border-t border-slate-700/50">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {task.dueDate}</span>
                      <button 
                        onClick={() => toggleStatus(task.id)}
                        className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        {task.status === 'Concluída' ? 'Mover p/ Pendente' : 'Concluir'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Visão Lista */
        <div className="bg-slate-800 rounded-xl border border-slate-700 divide-y divide-slate-700">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-700/40 transition">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleStatus(task.id)}>
                  {task.status === 'Concluída' ? <CheckCircle2 className="text-emerald-400" /> : <Circle className="text-slate-500" />}
                </button>
                <div>
                  <p className={`font-medium ${task.status === 'Concluída' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.title}
                  </p>
                  <span className="text-xs text-slate-400">{task.category} • Prazo: {task.dueDate}</span>
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-rose-400 p-2">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

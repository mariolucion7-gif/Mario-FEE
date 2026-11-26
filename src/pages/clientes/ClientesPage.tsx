import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, Users, RefreshCw, MapPin, Phone, UserPlus, AlertCircle } from 'lucide-react';
import { useExcluirClienteMutation, useListarClientesQuery } from '../../services/api';

function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return 'Não foi possível conectar à API. Confira se o servidor está ativo e se o token de autenticação foi informado.';
}
export function ClientesPage() {
  const [busca, setBusca] = useState('');
  const { data: clientes = [], isLoading, isFetching, isError, error, refetch } = useListarClientesQuery(busca || undefined);
  const [excluirCliente, { isLoading: isDeleting }] = useExcluirClienteMutation();
  const total = clientes.length;
  const initials = (name: string) => name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  async function handleDelete(id: string, nome: string) {
    if (!window.confirm(`Deseja realmente excluir o cliente "${nome}"?`)) return;
    try { await excluirCliente(id).unwrap(); }
    catch (deleteError) { window.alert(getErrorMessage(deleteError)); }
  }
  const rows = useMemo(() => clientes, [clientes]);
  return <>
    <div className="page-heading"><div><div className="eyebrow">CADASTROS <span>›</span> CLIENTES</div><h1>Clientes</h1><p>Gerencie os compradores e seus endereços de entrega.</p></div><Link className="btn btn-primary" to="/clientes/novo"><Plus size={17}/> Novo cliente</Link></div>
    <div className="stats-row"><div className="stat-card"><div className="stat-icon blue"><Users size={19}/></div><div><small>Clientes encontrados</small><strong>{isLoading ? '—' : total}</strong></div><span className="stat-note">Nesta consulta</span></div><div className="stat-card"><div className="stat-icon green"><UserPlus size={19}/></div><div><small>Cadastro</small><strong>Ativo</strong></div><span className="stat-note">Módulo operacional</span></div><div className="stat-card"><div className="stat-icon amber"><MapPin size={19}/></div><div><small>Endereços</small><strong>{isLoading ? '—' : total}</strong></div><span className="stat-note">Registros listados</span></div></div>
    <section className="panel table-panel"><div className="panel-header"><div><h2>Carteira de clientes</h2><p>Consulte, edite ou remova os cadastros.</p></div><button className="icon-button" onClick={() => refetch()} title="Atualizar lista"><RefreshCw size={17}/></button></div>
      <div className="table-toolbar"><div className="search-box"><Search size={17}/><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou telefone..."/><kbd>⌕</kbd></div><span className="result-count">{isFetching ? 'Atualizando...' : `${total} registro(s)`}</span></div>
      {isLoading ? <div className="loading-state"><span className="spinner"/><b>Carregando carteira de clientes...</b><small>Consultando a API do Mr. Construção</small></div> : isError ? <div className="error-state"><AlertCircle size={30}/><h3>Não foi possível carregar os clientes</h3><p>{getErrorMessage(error)}</p><button className="btn btn-outline" onClick={() => refetch()}><RefreshCw size={15}/> Tentar novamente</button></div> : rows.length === 0 ? <div className="empty-state"><div className="empty-icon"><Users size={28}/></div><h3>{busca ? 'Nenhum resultado encontrado' : 'Sua carteira está vazia'}</h3><p>{busca ? 'Tente pesquisar usando outro nome ou telefone.' : 'Cadastre o primeiro cliente para começar a organizar suas entregas.'}</p>{!busca && <Link className="btn btn-primary" to="/clientes/novo"><Plus size={16}/> Cadastrar cliente</Link>}</div> : <div className="table-wrap"><table className="data-table"><thead><tr><th>CLIENTE</th><th>TELEFONE</th><th>LOCALIZAÇÃO</th><th>PONTO DE REFERÊNCIA</th><th className="actions-heading">AÇÕES</th></tr></thead><tbody>{rows.map((cliente) => <tr key={cliente.id}><td><div className="client-cell"><div className="client-avatar">{initials(cliente.nomeCliente)}</div><div><b>{cliente.nomeCliente}</b><small>{cliente.rua}, {cliente.numero}</small></div></div></td><td><span className="phone-cell"><Phone size={14}/>{cliente.telefone}</span></td><td><span className="location-cell">{cliente.bairro}<small>{cliente.cidade}</small></span></td><td><span className="reference-cell">{cliente.pontoReferencia || 'Não informado'}</span></td><td><div className="row-actions"><Link className="action-edit" to={`/clientes/${cliente.id}`} title="Editar cliente"><Pencil size={15}/></Link><button className="action-delete" onClick={() => handleDelete(cliente.id, cliente.nomeCliente)} disabled={isDeleting} title="Excluir cliente"><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div>}
      <div className="table-footer"><span>Dados sincronizados com a API REST</span><span>Atualização automática via RTK Query</span></div>
    </section>
  </>;
}

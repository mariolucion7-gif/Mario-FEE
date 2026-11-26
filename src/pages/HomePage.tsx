import { ArrowUpRight, Boxes, ClipboardList, Package, Users, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useListarClientesQuery, useGetProdutosQuery } from '../services/api';

export function HomePage() {
  const clients = useListarClientesQuery();
  const products = useGetProdutosQuery();
  return <>
    <div className="welcome-banner"><div><span className="welcome-kicker">PAINEL DE CONTROLE</span><h1>Bom trabalho!</h1><p>Tenha uma visão rápida da operação da sua loja.</p></div><div className="welcome-art"><Wrench size={52}/><Boxes size={35}/></div></div>
    <div className="page-heading compact-heading"><div><h2>Resumo da operação</h2><p>Acompanhe os principais módulos do sistema.</p></div></div>
    <div className="stats-row dashboard-stats">
      <div className="stat-card"><div className="stat-icon blue"><Users size={20}/></div><div><small>Clientes cadastrados</small><strong>{clients.isLoading ? '—' : clients.data?.length ?? '—'}</strong></div><span className="stat-note">API de clientes</span></div>
      <div className="stat-card"><div className="stat-icon green"><Package size={20}/></div><div><small>Produtos no catálogo</small><strong>{products.isLoading ? '—' : products.data?.length ?? '—'}</strong></div><span className="stat-note">API de produtos</span></div>
      <div className="stat-card"><div className="stat-icon amber"><ClipboardList size={20}/></div><div><small>Orçamentos</small><strong>+</strong></div><span className="stat-note">Nova proposta</span></div>
    </div>
    <div className="section-heading"><div><h2>Acesso rápido</h2><p>Continue de onde você precisa.</p></div></div>
    <div className="quick-grid">
      <Link to="/clientes" className="quick-card"><div className="quick-icon blue"><Users size={22}/></div><div><b>Gerenciar clientes</b><small>Consultar e manter cadastros</small></div><ArrowUpRight size={18}/></Link>
      <Link to="/clientes/novo" className="quick-card"><div className="quick-icon green"><Users size={22}/></div><div><b>Novo cliente</b><small>Adicionar comprador e endereço</small></div><ArrowUpRight size={18}/></Link>
      <Link to="/produtos" className="quick-card"><div className="quick-icon amber"><Package size={22}/></div><div><b>Ver produtos</b><small>Consultar e atualizar catálogo</small></div><ArrowUpRight size={18}/></Link>
      <Link to="/orcamentos" className="quick-card"><div className="quick-icon blue"><ClipboardList size={22}/></div><div><b>Criar orçamento</b><small>Montar proposta e calcular total</small></div><ArrowUpRight size={18}/></Link>
    </div>
    <div className="info-strip"><span className="info-dot"/><div><b>Integração com RTK Query</b><small>Consultas, cache e atualização automática após operações de cadastro.</small></div></div>
  </>;
}

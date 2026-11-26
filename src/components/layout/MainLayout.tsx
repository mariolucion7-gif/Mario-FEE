import { NavLink, Outlet } from 'react-router-dom';
import { Activity, Boxes, ChartNoAxesCombined, ClipboardList, HardHat, LayoutDashboard, Package, Settings, Users, Wifi, KeyRound } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { label: 'Visão geral', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Clientes', to: '/clientes', icon: Users },
  { label: 'Produtos', to: '/produtos', icon: Package },
  { label: 'Orçamentos', to: '/orcamentos', icon: ClipboardList },
];

export function MainLayout() {
  const [token, setToken] = useState(localStorage.getItem('@MRConstrucao:token') || '');
  const [showToken, setShowToken] = useState(false);
  function saveToken() {
    if (token.trim()) localStorage.setItem('@MRConstrucao:token', token.trim());
    else localStorage.removeItem('@MRConstrucao:token');
    window.location.reload();
  }
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><HardHat size={23}/></div><div><strong>MR. CONSTRUÇÃO</strong><small>GESTÃO COMERCIAL</small></div></div>
      <div className="workspace"><span className="workspace-dot"/> Ambiente comercial <span className="chevron">⌄</span></div>
      <p className="nav-caption">MENU PRINCIPAL</p>
      <nav className="side-nav">{navigation.map(({ label, to, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18}/><span>{label}</span>{label === 'Clientes' && <span className="nav-arrow">›</span>}</NavLink>)}</nav>
      <p className="nav-caption secondary-caption">SISTEMA</p>
      <button className="nav-link nav-button" onClick={() => setShowToken((v) => !v)}><KeyRound size={18}/><span>Autenticação</span></button>
      {showToken && <div className="token-box"><label htmlFor="api-token">Token Bearer da API</label><input id="api-token" type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Cole seu token"/><button onClick={saveToken}>Salvar token</button><small>Armazenado apenas neste navegador.</small></div>}
      <div className="sidebar-bottom"><div className="api-status"><span className="status-pulse"/><div><b>API configurada</b><small>Conexão via RTK Query</small></div></div><div className="user-profile"><div className="avatar">MC</div><div><b>Operador</b><small>Balcão Central</small></div><Settings size={17}/></div></div>
    </aside>
    <div className="main-area"><header className="topbar"><div className="breadcrumb"><span>Mr. Construção</span><b>/</b><strong>Painel comercial</strong></div><div className="topbar-right"><span className="live-indicator"><Wifi size={15}/> Sistema online</span><div className="top-avatar">MC</div></div></header><main className="page-content"><Outlet/></main><footer className="footer"><span>© 2026 Mr. Construção</span><span><Activity size={13}/> Plataforma de gestão comercial</span></footer></div>
  </div>;
}

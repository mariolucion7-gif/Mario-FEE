import { useMemo, useState, type FormEvent } from 'react';
import { AlertCircle, Package, Plus, RefreshCw, Search, Pencil, Trash2, X, Save, Boxes } from 'lucide-react';
import { useAtualizarProdutoMutation, useCriarProdutoMutation, useExcluirProdutoMutation, useGetProdutosQuery } from '../services/api';
import type { Produto, ProdutoDTO } from '../types/produto.types';

const EMPTY: ProdutoDTO = { codigo: '', nomeProduto: '', marca: '', precoVenda: 0, estoqueAtual: 0, unidade: 'UN' };
const money = (value: number) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
function apiMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return 'Não foi possível concluir a operação. Confira a API e tente novamente.';
}

export function ProdutosPage() {
  const { data: produtos = [], isLoading, isError, error, isFetching, refetch } = useGetProdutosQuery();
  const [createProduct, createState] = useCriarProdutoMutation();
  const [updateProduct, updateState] = useAtualizarProdutoMutation();
  const [deleteProduct, deleteState] = useExcluirProdutoMutation();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Produto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [values, setValues] = useState<ProdutoDTO>(EMPTY);
  const [feedback, setFeedback] = useState('');
  const [formError, setFormError] = useState('');
  const filtered = useMemo(() => produtos.filter((item) => `${item.codigo} ${item.nomeProduto} ${item.marca ?? ''}`.toLowerCase().includes(search.toLowerCase())), [produtos, search]);
  const totalStock = produtos.reduce((sum, item) => sum + Number(item.estoqueAtual || 0), 0);
  const lowStock = produtos.filter((item) => Number(item.estoqueAtual) <= 5).length;

  function openCreate() { setEditing(null); setValues(EMPTY); setFormError(''); setFeedback(''); setShowForm(true); }
  function openEdit(product: Produto) { setEditing(product); setValues({ codigo: product.codigo, nomeProduto: product.nomeProduto, marca: product.marca ?? '', precoVenda: Number(product.precoVenda), estoqueAtual: Number(product.estoqueAtual), unidade: product.unidade }); setFormError(''); setFeedback(''); setShowForm(true); }
  async function submit(event: FormEvent) {
    event.preventDefault(); setFormError(''); setFeedback('');
    if (!values.codigo.trim() || !values.nomeProduto.trim() || !values.unidade.trim() || Number(values.precoVenda) < 0 || Number(values.estoqueAtual) < 0) { setFormError('Informe código, nome, unidade e valores válidos.'); return; }
    const payload = { ...values, codigo: values.codigo.trim(), nomeProduto: values.nomeProduto.trim(), marca: values.marca?.trim() ?? '', precoVenda: Number(values.precoVenda), estoqueAtual: Number(values.estoqueAtual), unidade: values.unidade.trim() };
    try {
      if (editing) await updateProduct({ id: editing.id, dados: payload }).unwrap();
      else await createProduct(payload).unwrap();
      setShowForm(false); setFeedback(editing ? 'Produto atualizado com sucesso.' : 'Produto cadastrado com sucesso.');
    } catch (err) { setFormError(apiMessage(err)); }
  }
  async function remove(product: Produto) {
    if (!window.confirm(`Deseja excluir o produto “${product.nomeProduto}”?`)) return;
    setFeedback('');
    try { await deleteProduct(product.id).unwrap(); setFeedback('Produto excluído com sucesso.'); }
    catch (err) { setFeedback(apiMessage(err)); }
  }

  return <>
    <div className="page-heading"><div><div className="eyebrow">CATÁLOGO <span>›</span> ESTOQUE</div><h1>Produtos</h1><p>Gerencie materiais, preços e disponibilidade do estoque.</p></div><button className="btn btn-primary" onClick={openCreate}><Plus size={17}/> Novo produto</button></div>
    <div className="stats-row"><div className="stat-card"><div className="stat-icon blue"><Package size={19}/></div><div><small>Produtos cadastrados</small><strong>{isLoading ? '—' : produtos.length}</strong></div><span className="stat-note">Catálogo geral</span></div><div className="stat-card"><div className="stat-icon green"><Boxes size={19}/></div><div><small>Unidades em estoque</small><strong>{isLoading ? '—' : totalStock}</strong></div><span className="stat-note">Saldo total</span></div><div className="stat-card"><div className="stat-icon amber"><AlertCircle size={19}/></div><div><small>Estoque baixo</small><strong>{isLoading ? '—' : lowStock}</strong></div><span className="stat-note">Até 5 unidades</span></div></div>
    {feedback && <div className="success-strip">{feedback}</div>}
    {showForm && <section className="panel product-editor"><div className="panel-header"><div><h2>{editing ? 'Editar produto' : 'Cadastrar produto'}</h2><p>Preencha os dados do catálogo.</p></div><button className="icon-button" onClick={() => setShowForm(false)} aria-label="Fechar"><X size={17}/></button></div><form className="product-form" onSubmit={submit}>{formError && <div className="form-error">{formError}</div>}<div className="form-grid"><label className="form-field"><span>Código *</span><input value={values.codigo} onChange={(e) => setValues(v => ({ ...v, codigo: e.target.value }))} required placeholder="Ex.: MAT-001"/></label><label className="form-field"><span>Nome do produto *</span><input value={values.nomeProduto} onChange={(e) => setValues(v => ({ ...v, nomeProduto: e.target.value }))} required placeholder="Nome do material"/></label><label className="form-field"><span>Marca</span><input value={values.marca ?? ''} onChange={(e) => setValues(v => ({ ...v, marca: e.target.value }))} placeholder="Fabricante"/></label><label className="form-field"><span>Preço de venda (R$) *</span><input type="number" min="0" step="0.01" value={values.precoVenda} onChange={(e) => setValues(v => ({ ...v, precoVenda: Number(e.target.value) }))} required/></label><label className="form-field"><span>Estoque atual *</span><input type="number" min="0" step="1" value={values.estoqueAtual} onChange={(e) => setValues(v => ({ ...v, estoqueAtual: Number(e.target.value) }))} required/></label><label className="form-field"><span>Unidade *</span><input value={values.unidade} onChange={(e) => setValues(v => ({ ...v, unidade: e.target.value.toUpperCase() }))} required placeholder="UN, KG, M..."/></label></div><div className="form-actions"><button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button><button className="btn btn-primary" type="submit" disabled={createState.isLoading || updateState.isLoading}><Save size={16}/>{createState.isLoading || updateState.isLoading ? 'Salvando...' : editing ? 'Salvar alterações' : 'Cadastrar produto'}</button></div></form></section>}
    <section className="panel table-panel"><div className="panel-header"><div><h2>Catálogo de materiais</h2><p>Consulta e manutenção dos produtos registrados na API.</p></div><button className="icon-button" onClick={() => refetch()} title="Atualizar catálogo"><RefreshCw size={17}/></button></div><div className="table-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por código, produto ou marca..."/></div><span className="result-count">{isFetching ? 'Sincronizando...' : `${filtered.length} produto(s)`}</span></div>
      {isLoading ? <div className="loading-state"><span className="spinner"/><b>Carregando catálogo de produtos...</b></div> : isError ? <div className="error-state"><AlertCircle size={29}/><h3>Não foi possível carregar os produtos</h3><p>{apiMessage(error)}</p><button className="btn btn-outline" onClick={() => refetch()}>Tentar novamente</button></div> : filtered.length === 0 ? <div className="empty-state"><div className="empty-icon"><Package size={28}/></div><h3>{search ? 'Nenhum produto encontrado' : 'Catálogo vazio'}</h3><p>{search ? 'Tente buscar por outro termo.' : 'Cadastre o primeiro produto para iniciar o catálogo.'}</p></div> : <div className="table-wrap"><table className="data-table"><thead><tr><th>CÓDIGO</th><th>PRODUTO</th><th>MARCA</th><th>PREÇO</th><th>ESTOQUE</th><th>UNIDADE</th><th className="actions-heading">AÇÕES</th></tr></thead><tbody>{filtered.map((product) => <tr key={product.id}><td><span className="code-pill">{product.codigo}</span></td><td><b>{product.nomeProduto}</b></td><td>{product.marca || '—'}</td><td><b>{money(product.precoVenda)}</b></td><td><span className={`stock-pill ${Number(product.estoqueAtual) <= 5 ? 'low' : ''}`}>{product.estoqueAtual}</span></td><td>{product.unidade}</td><td><div className="row-actions"><button className="action-edit" onClick={() => openEdit(product)} title="Editar produto"><Pencil size={15}/></button><button className="action-delete" onClick={() => remove(product)} disabled={deleteState.isLoading} title="Excluir produto"><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div>}
      <div className="table-footer"><span>Dados sincronizados com a API REST</span><span>Atualização automática via RTK Query</span></div>
    </section>
  </>;
}

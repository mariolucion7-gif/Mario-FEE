import { useMemo, useState } from 'react';
import { AlertCircle, ClipboardList, Plus, Trash2, Send, Calculator, CheckCircle2 } from 'lucide-react';
import { useCriarOrcamentoMutation, useGetProdutosQuery, useListarClientesQuery } from '../services/api';

interface QuoteItem { produtoId: string; quantidade: number }
const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
function errorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return 'Não foi possível enviar o orçamento. Verifique a API e tente novamente.';
}

export function OrcamentosPage() {
  const { data: products = [], isLoading: loadingProducts, isError: productsError } = useGetProdutosQuery();
  const { data: clients = [], isLoading: loadingClients, isError: clientsError } = useListarClientesQuery();
  const [createQuote, { isLoading: saving }] = useCriarOrcamentoMutation();
  const [clienteId, setClienteId] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const details = useMemo(() => items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.produtoId);
    return { ...item, product, subtotal: (product?.precoVenda ?? 0) * item.quantidade };
  }).filter((item) => item.product), [items, products]);
  const total = details.reduce((sum, item) => sum + item.subtotal, 0);

  function addItem() {
    if (!selectedProduct) return;
    setItems((current) => {
      const existing = current.find((item) => item.produtoId === selectedProduct);
      if (existing) return current.map((item) => item.produtoId === selectedProduct ? { ...item, quantidade: item.quantidade + 1 } : item);
      return [...current, { produtoId: selectedProduct, quantidade: 1 }];
    });
    setSelectedProduct(''); setError(''); setFeedback('');
  }
  function changeQuantity(id: string, quantity: number) {
    setItems((current) => current.map((item) => item.produtoId === id ? { ...item, quantidade: Math.max(1, quantity) } : item));
  }
  async function submit() {
    setError(''); setFeedback('');
    if (!clienteId) { setError('Selecione um cliente para continuar.'); return; }
    if (details.length === 0) { setError('Adicione pelo menos um produto ao orçamento.'); return; }
    try {
      await createQuote({ clienteId, itens: details.map((item) => ({ produtoId: item.produtoId, quantidade: item.quantidade, precoUnitario: Number(item.product?.precoVenda ?? 0) })), valorTotal: total }).unwrap();
      setFeedback('Orçamento enviado com sucesso para a API.'); setItems([]); setClienteId('');
    } catch (err) { setError(errorMessage(err)); }
  }

  return <>
    <div className="page-heading"><div><div className="eyebrow">COMERCIAL <span>›</span> VENDAS</div><h1>Orçamentos</h1><p>Monte propostas comerciais com cálculo automático dos valores.</p></div></div>
    <div className="quote-layout">
      <section className="panel quote-builder"><div className="panel-header"><div><h2>Nova proposta</h2><p>Selecione o comprador e adicione os materiais.</p></div><div className="quote-icon"><ClipboardList size={20}/></div></div>
        {(productsError || clientsError) && <div className="form-error">Não foi possível carregar clientes ou produtos. Verifique a conexão com a API.</div>}
        {error && <div className="form-error">{error}</div>}{feedback && <div className="success-strip"><CheckCircle2 size={16}/>{feedback}</div>}
        <label className="form-field quote-client"><span>Cliente *</span><select value={clienteId} onChange={(e) => setClienteId(e.target.value)} disabled={loadingClients}><option value="">{loadingClients ? 'Carregando clientes...' : 'Selecione um cliente'}</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.nomeCliente} — {client.telefone}</option>)}</select></label>
        <div className="quote-add-row"><label className="form-field"><span>Produto</span><select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} disabled={loadingProducts}><option value="">{loadingProducts ? 'Carregando produtos...' : 'Selecione um material'}</option>{products.map((product) => <option key={product.id} value={product.id}>{product.nomeProduto} — {currency(Number(product.precoVenda))}</option>)}</select></label><button className="btn btn-primary" onClick={addItem} disabled={!selectedProduct}><Plus size={16}/> Adicionar</button></div>
        <div className="quote-items"><div className="quote-items-head"><b>Itens da proposta</b><span>{details.length} item(ns)</span></div>{details.length === 0 ? <div className="quote-empty"><ClipboardList size={25}/><b>Nenhum material adicionado</b><small>Escolha um produto acima para começar.</small></div> : details.map((item) => <div className="quote-item" key={item.produtoId}><div className="quote-product"><b>{item.product?.nomeProduto}</b><small>{currency(Number(item.product?.precoVenda))} / {item.product?.unidade}</small></div><label className="quantity-control"><span>Qtd.</span><input type="number" min="1" step="1" value={item.quantidade} onChange={(e) => changeQuantity(item.produtoId, Number(e.target.value))}/></label><b className="quote-subtotal">{currency(item.subtotal)}</b><button className="action-delete" onClick={() => setItems(current => current.filter((row) => row.produtoId !== item.produtoId))} title="Remover item"><Trash2 size={15}/></button></div>)}</div>
      </section>
      <aside className="panel quote-summary"><div className="summary-top"><div className="summary-icon"><Calculator size={20}/></div><span>RESUMO DA PROPOSTA</span></div><div className="summary-line"><span>Quantidade de itens</span><b>{details.length}</b></div><div className="summary-line"><span>Unidades totais</span><b>{details.reduce((sum, item) => sum + item.quantidade, 0)}</b></div><div className="summary-divider"/><div className="summary-total"><span>Valor total</span><strong>{currency(total)}</strong></div><p>O subtotal de cada material é calculado automaticamente pela quantidade multiplicada pelo preço unitário.</p><button className="btn btn-primary quote-submit" onClick={submit} disabled={saving || !details.length || !clienteId}><Send size={16}/>{saving ? 'Enviando...' : 'Salvar orçamento'}</button><small className="summary-note">Gravação via POST /api/orcamentos</small></aside>
    </div>
  </>;
}

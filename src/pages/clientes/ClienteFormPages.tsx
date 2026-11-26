import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Users } from 'lucide-react';
import { ClientForm } from '../../components/clients/ClientForm';
import { useAtualizarClienteMutation, useCriarClienteMutation, useObterClientePorIdQuery } from '../../services/api';
import type { ClienteDTO } from '../../types/cliente.types';

function messageFromError(error: unknown) {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return 'Ocorreu uma falha ao comunicar com a API. Verifique o servidor e tente novamente.';
}
export function CadastrarClientePage() {
  const navigate = useNavigate(); const [createClient, { isLoading }] = useCriarClienteMutation(); const [error, setError] = useState('');
  async function save(data: ClienteDTO) { setError(''); try { await createClient(data).unwrap(); navigate('/clientes'); } catch (err) { setError(messageFromError(err)); } }
  return <FormPageTitle title="Novo cliente" subtitle="Preencha os dados para cadastrar um comprador." mode="create" error={error}><ClientForm mode="create" onSubmit={save} isLoading={isLoading} onCancel={() => navigate('/clientes')}/></FormPageTitle>;
}
export function EditarClientePage() {
  const { id = '' } = useParams(); const navigate = useNavigate(); const { data: client, isLoading, isError } = useObterClientePorIdQuery(id, { skip: !id }); const [updateClient, { isLoading: isSaving }] = useAtualizarClienteMutation(); const [error, setError] = useState('');
  async function save(data: ClienteDTO) { setError(''); try { await updateClient({ id, dados: data }).unwrap(); navigate('/clientes'); } catch (err) { setError(messageFromError(err)); } }
  if (isLoading) return <div className="panel loading-state"><span className="spinner"/><b>Carregando dados cadastrais...</b></div>;
  if (isError || !client) return <div className="panel error-state"><h3>Cliente não encontrado</h3><p>Não foi possível recuperar os dados deste cadastro.</p><Link className="btn btn-outline" to="/clientes">Voltar para clientes</Link></div>;
  const initialValues: ClienteDTO = { nomeCliente: client.nomeCliente, telefone: client.telefone, rua: client.rua, numero: client.numero, complemento: client.complemento ?? '', bairro: client.bairro, cidade: client.cidade, cep: client.cep, pontoReferencia: client.pontoReferencia ?? '' };
  return <FormPageTitle title="Editar cliente" subtitle={`Atualize os dados de ${client.nomeCliente}.`} mode="edit" error={error}><ClientForm mode="edit" initialValues={initialValues} onSubmit={save} isLoading={isSaving} onCancel={() => navigate('/clientes')}/></FormPageTitle>;
}
function FormPageTitle({ title, subtitle, mode, error, children }: { title: string; subtitle: string; mode: 'create' | 'edit'; error: string; children: ReactNode }) {
  return <><div className="page-heading"><div><div className="eyebrow"><Link to="/clientes">CLIENTES</Link><ChevronRight size={13}/>{mode === 'create' ? 'NOVO CADASTRO' : 'EDIÇÃO'}</div><h1>{title}</h1><p>{subtitle}</p></div><Link to="/clientes" className="back-link"><Users size={16}/> Voltar à lista</Link></div><section className="panel form-panel">{error && <div className="form-error">{error}</div>}{children}</section></>;
}

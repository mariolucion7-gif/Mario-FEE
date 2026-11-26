import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { MapPin, UserRound, Phone, Save, X } from 'lucide-react';
import type { ClienteDTO } from '../../types/cliente.types';

export interface ClientFormProps { mode: 'create' | 'edit'; initialValues?: ClienteDTO; onSubmit: (values: ClienteDTO) => Promise<void>; isLoading?: boolean; onCancel: () => void }
const EMPTY: ClienteDTO = { nomeCliente: '', telefone: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', cep: '', pontoReferencia: '' };

export function ClientForm({ mode, initialValues, onSubmit, isLoading = false, onCancel }: ClientFormProps) {
  const [values, setValues] = useState<ClienteDTO>(initialValues ?? EMPTY);
  const [validationError, setValidationError] = useState('');
  useEffect(() => { if (initialValues) setValues(initialValues); }, [initialValues]);
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setValidationError('');
    const required: (keyof ClienteDTO)[] = ['nomeCliente', 'telefone', 'rua', 'numero', 'bairro', 'cidade', 'cep', 'pontoReferencia'];
    if (required.some((key) => !String(values[key] ?? '').trim())) {
      setValidationError('Preencha todos os campos obrigatórios marcados com * para continuar.'); return;
    }
    await onSubmit(values);
  }
  const field = (name: keyof ClienteDTO, label: string, placeholder: string, required = false, type = 'text') => <label className="form-field" key={name}><span>{label}{required && ' *'}</span><input name={name} type={type} value={values[name] ?? ''} onChange={handleChange} placeholder={placeholder} required={required}/></label>;
  return <form className="client-form" onSubmit={handleSubmit}>
    {validationError && <div className="form-error">{validationError}</div>}
    <section className="form-section"><div className="form-section-title"><span className="section-icon"><UserRound size={17}/></span><div><b>Dados do cliente</b><small>Informações para identificação e contato</small></div></div><div className="form-grid">{field('nomeCliente', 'Nome do cliente', 'Nome completo ou razão social', true)}{field('telefone', 'Telefone / WhatsApp', '(00) 00000-0000', true, 'tel')}</div></section>
    <section className="form-section"><div className="form-section-title"><span className="section-icon"><MapPin size={17}/></span><div><b>Endereço de entrega</b><small>Informe o endereço completo para logística</small></div></div><div className="form-grid">{field('cep', 'CEP', '00000-000', true)}{field('rua', 'Rua / Logradouro', 'Nome da rua ou avenida', true)}{field('numero', 'Número', 'Nº', true)}{field('complemento', 'Complemento', 'Casa, bloco, lote...')}{field('bairro', 'Bairro', 'Nome do bairro', true)}{field('cidade', 'Cidade', 'Cidade de entrega', true)}{field('pontoReferencia', 'Ponto de referência', 'Ex.: em frente ao depósito central', true)}</div><p className="form-hint">O ponto de referência ajuda a equipe a localizar o endereço durante a entrega.</p></section>
    <div className="form-actions"><button type="button" className="btn btn-ghost" onClick={onCancel}><X size={16}/> Cancelar</button><button type="submit" className="btn btn-primary" disabled={isLoading}><Save size={16}/>{isLoading ? 'Salvando...' : mode === 'create' ? 'Cadastrar cliente' : 'Salvar alterações'}</button></div>
  </form>;
}

# Mr. Construção — Gestão Comercial

Front-end de gestão comercial desenvolvido com **React, TypeScript, Vite, React Router DOM e Redux Toolkit Query**. A interface foi organizada em layout administrativo responsivo, com navegação SPA, componentes reutilizáveis e comunicação centralizada com a API REST.

## Requisitos

- Node.js 20 ou superior
- npm
- API Mr. Construção acessível e credenciais Bearer Token fornecidas pelo ambiente/professor

## Como executar

```bash
npm install
cp .env.example .env
npm run dev
```

No Windows, também é possível executar `iniciar-no-windows.bat` após instalar o Node.js. O Vite informa o endereço local, normalmente `http://localhost:5173`.

## Configuração da API

O endereço base padrão segue o roteiro técnico (`http://localhost:3000/api`). Se o backend estiver publicado ou em outra porta, altere `VITE_API_URL` no arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

A API de clientes documentada exige Bearer Token. Abra **Autenticação** no menu lateral, informe o token fornecido pelo professor/ambiente e salve. O token fica no armazenamento local do navegador e é enviado no cabeçalho `Authorization`.

## Módulos

### Visão geral
- Painel com indicadores carregados da API.
- Atalhos para os módulos comerciais.

### Clientes — CRUD integrado
- Listagem e busca por nome ou telefone.
- Cadastro, consulta por ID, edição e exclusão.
- Formulário controlado e reutilizável.
- Dados de contato e endereço: nome, telefone, rua, número, complemento, bairro, cidade, CEP e ponto de referência.
- Validação dos campos obrigatórios conforme o roteiro de planejamento. O roteiro de integração classifica o ponto de referência como opcional no dicionário de dados, mas o roteiro geral do Módulo B o exige; esta implementação segue a exigência do Módulo B.
- Tratamento de loading, erros da API, confirmação de exclusão e invalidação de cache RTK Query.

### Produtos — CRUD integrado
- Consulta do catálogo com código, nome, marca, preço, estoque e unidade.
- Busca textual, cadastro, edição e exclusão.
- Indicadores de quantidade de produtos, saldo de estoque e itens com estoque baixo.
- Invalidação de cache após as mutações.

### Orçamentos — composição de proposta
- Seleção de cliente e produtos.
- Inclusão/remoção de itens e ajuste de quantidade.
- Cálculo automático de subtotal por item e total da proposta.
- Envio via `POST /orcamentos`.

**Contrato de orçamento:** os guias descrevem o endpoint `POST /api/orcamentos` e o cálculo de itens/total, mas não especificam o JSON completo aceito pelo backend. O front-end envia `clienteId`, `itens` (com `produtoId`, `quantidade` e `precoUnitario`) e `valorTotal`. Caso o Swagger do ambiente utilize nomes diferentes, ajuste o tipo e o endpoint `criarOrcamento` em `src/services/api.ts`.

## Organização do código

```text
src/
├── app/                 # Redux Store
├── components/
│   ├── clients/         # Formulário reutilizável de clientes
│   └── layout/          # Shell, cabeçalho e navegação
├── pages/               # Páginas dos módulos
│   └── clientes/        # Listagem, cadastro e edição
├── routes/              # Rotas e caminhos
├── services/            # API centralizada com RTK Query
├── types/               # Contratos TypeScript e DTOs
├── main.tsx
└── styles.css
```

## Endpoints utilizados

- `GET /clientes` e `GET /clientes/:id`
- `POST /clientes`, `PUT /clientes/:id`, `DELETE /clientes/:id`
- `GET /produtos`, `POST /produtos`, `PUT /produtos/:id`, `DELETE /produtos/:id`
- `POST /orcamentos`

As rotas de produtos seguem o padrão REST e o módulo de produtos indicado no roteiro de construção. Confirme os nomes/campos no Swagger do backend da turma caso haja divergência.

## Observações para a entrega

O front-end está preparado para funcionar com a API real; ele não inventa registros nem simula persistência. Para validar operações de ponta a ponta, mantenha o backend ativo, configure `VITE_API_URL` e informe um token válido. Sem servidor ou token, a interface apresenta estados de erro e permite tentar novamente.

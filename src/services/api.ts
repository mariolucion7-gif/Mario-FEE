import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Cliente, ClienteDTO, AtualizarClienteParams } from '../types/cliente.types';
import type { Produto, ProdutoDTO, AtualizarProdutoParams } from '../types/produto.types';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('@MRConstrucao:token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Produtos', 'Clientes', 'Orcamentos', 'Users'],
  endpoints: (builder) => ({
    listarClientes: builder.query<Cliente[], string | void>({
      query: (busca) => busca ? `/clientes?busca=${encodeURIComponent(busca)}` : '/clientes',
      providesTags: (result) => result
        ? [...result.map(({ id }) => ({ type: 'Clientes' as const, id })), { type: 'Clientes', id: 'LIST' }]
        : [{ type: 'Clientes', id: 'LIST' }],
    }),
    obterClientePorId: builder.query<Cliente, string>({
      query: (id) => `/clientes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Clientes', id }],
    }),
    criarCliente: builder.mutation<Cliente, ClienteDTO>({
      query: (body) => ({ url: '/clientes', method: 'POST', body }),
      invalidatesTags: [{ type: 'Clientes', id: 'LIST' }],
    }),
    atualizarCliente: builder.mutation<Cliente, AtualizarClienteParams>({
      query: ({ id, dados }) => ({ url: `/clientes/${id}`, method: 'PUT', body: dados }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Clientes', id }, { type: 'Clientes', id: 'LIST' }],
    }),
    excluirCliente: builder.mutation<{ success?: boolean } | void, string>({
      query: (id) => ({ url: `/clientes/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Clientes', id }, { type: 'Clientes', id: 'LIST' }],
    }),
    getProdutos: builder.query<Produto[], void>({
      query: () => '/produtos',
      providesTags: (result) => result
        ? [...result.map(({ id }) => ({ type: 'Produtos' as const, id })), { type: 'Produtos', id: 'LIST' }]
        : [{ type: 'Produtos', id: 'LIST' }],
    }),
    criarProduto: builder.mutation<Produto, ProdutoDTO>({
      query: (body) => ({ url: '/produtos', method: 'POST', body }),
      invalidatesTags: [{ type: 'Produtos', id: 'LIST' }],
    }),
    atualizarProduto: builder.mutation<Produto, AtualizarProdutoParams>({
      query: ({ id, dados }) => ({ url: `/produtos/${id}`, method: 'PUT', body: dados }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Produtos', id }, { type: 'Produtos', id: 'LIST' }],
    }),
    excluirProduto: builder.mutation<{ success?: boolean } | void, string>({
      query: (id) => ({ url: `/produtos/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Produtos', id }, { type: 'Produtos', id: 'LIST' }],
    }),
    criarOrcamento: builder.mutation<unknown, { clienteId: string; itens: { produtoId: string; quantidade: number; precoUnitario: number }[]; valorTotal: number }>({
      query: (body) => ({ url: '/orcamentos', method: 'POST', body }),
      invalidatesTags: ['Orcamentos'],
    }),
  }),
});

export const {
  useListarClientesQuery, useObterClientePorIdQuery, useCriarClienteMutation,
  useAtualizarClienteMutation, useExcluirClienteMutation, useGetProdutosQuery,
  useCriarProdutoMutation, useAtualizarProdutoMutation, useExcluirProdutoMutation, useCriarOrcamentoMutation,
} = api;

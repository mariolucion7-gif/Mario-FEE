import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { HomePage } from '../pages/HomePage';
import { ProdutosPage } from '../pages/ProdutosPage';
import { OrcamentosPage } from '../pages/OrcamentosPage';
import { ClientesPage } from '../pages/clientes/ClientesPage';
import { CadastrarClientePage, EditarClientePage } from '../pages/clientes/ClienteFormPages';
import { AppRoutes } from './paths';

export const router = createBrowserRouter([{
  path: AppRoutes.HOME,
  element: <MainLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: AppRoutes.CLIENTS_LIST.slice(1), element: <ClientesPage /> },
    { path: AppRoutes.CLIENTS_NEW.slice(1), element: <CadastrarClientePage /> },
    { path: AppRoutes.CLIENTS_EDIT.slice(1), element: <EditarClientePage /> },
    { path: AppRoutes.PRODUCTS_LIST.slice(1), element: <ProdutosPage /> },
    { path: AppRoutes.ORDERS_LIST.slice(1), element: <OrcamentosPage /> },
  ],
}]);

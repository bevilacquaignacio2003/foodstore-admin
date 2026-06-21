import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductosPage } from "./features/productos/ProductosPage";
import { CategoriasPage } from "./features/categorias/CategoriasPage";
import { PedidosPage } from "./features/pedidos/PedidosPage";
import { UsuariosPage } from "./features/usuarios/UsuariosPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
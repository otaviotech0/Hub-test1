import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Foco from "./pages/Foco";
import Calendario from "./pages/Calendario";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";
import NotFound from "./components/NotFound";
import Tarefas from "./pages/Tarefas";

function ProtectedLayout({ user, setUser }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout user={user} setUser={setUser} />;
}

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
        />
        <Route path="/cadastro" element={<Navigate to="/register" replace />} />

        <Route element={<ProtectedLayout user={user} setUser={setUser} />}>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/foco" element={<Foco />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tarefas" element={<Tarefas />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

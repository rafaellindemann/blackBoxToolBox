import { createBrowserRouter } from "react-router-dom"; 
import App from "../App";
import ConversorTek from "../pages/ConversorTek";
import PagadorTek from "../pages/PagadorTek";
import TradutorTek from "../pages/TradutorTek";
import BlackBoxImprintTimers from "../pages/BlackBoxImprintTimers";
import DinoNameGenerator from "../pages/DinoNameGenerator";
import DecayTimers from "../pages/DecayTimers";
import EstoqueDinos from "../pages/EstoqueDinos";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: "/", element: <ConversorTek /> },
      { path: "/pagador", element: <PagadorTek /> },
      { path: "/tradutor", element: <TradutorTek /> },
      { path: "/imprinttimers", element: <BlackBoxImprintTimers /> },
      { path: "/dinonamegenerator", element: <DinoNameGenerator /> },
      { path: "/decaytimers", element: <DecayTimers /> },
      { path: "/estoque", element: <EstoqueDinos /> },
    ],
  },
]);

export default router;



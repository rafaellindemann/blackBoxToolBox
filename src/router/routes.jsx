import { createBrowserRouter } from "react-router-dom"; 
import App from "../App";
import ConversorTek from "../pages/ConversorTek";
import PagadorTek from "../pages/PagadorTek";
import TradutorTek from "../pages/TradutorTek";
import BlackBoxImprintTimers from "../pages/BlackBoxImprintTimers";
import DinoNameGenerator from "../pages/DinoNameGenerator";
import DecayTimers from "../pages/DecayTimers";
import EstoqueDinos from "../pages/EstoqueDinos";
import StatusMix from "../pages/StatusMix";
import Tekgrams from "../pages/Tekgrams";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: "/", element: <StatusMix /> },
      { path: "/tekgrams", element: <Tekgrams /> },
      { path: "/decaytimers", element: <DecayTimers /> },
      { path: "/dinonamegenerator", element: <DinoNameGenerator /> },
      { path: "/conversor", element: <ConversorTek /> },
      { path: "/pagador", element: <PagadorTek /> },
      { path: "/tradutor", element: <TradutorTek /> },
      { path: "/imprinttimers", element: <BlackBoxImprintTimers /> },
      { path: "/estoque", element: <EstoqueDinos /> },
    ],
  },
]);

export default router;



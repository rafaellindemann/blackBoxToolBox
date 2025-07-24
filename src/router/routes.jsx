import { createBrowserRouter } from "react-router-dom"; 
import App from "../App";
import ConversorTek from "../pages/ConversorTek";
import PagadorTek from "../pages/PagadorTek";
import TradutorTek from "../pages/TradutorTek";
import BlackBoxImprintTimers from "../pages/BlackBoxImprintTimers";
import DinoNameGenerator from "../pages/DinoNameGenerator";

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
    ],
  },
]);

export default router;



// import { createBrowserRouter } from "react-router-dom"; 
// import App from "../App";
// import ConversorTek from "../pages/ConversorTek";
// import BlackBoxImprintTimers from "../pages/BlackBoxImprintTimers";
// import DinoNameGenerator from "../pages/DinoNameGenerator";

// const router = createBrowserRouter([
//     {path: '/', element: (<App />),
//         children: [
//             {path: "/", element: <ConversorTek />},
//             {path: "/imprinttimers", element: <BlackBoxImprintTimers />},
//             {path: "/dinonamegenerator", element: <DinoNameGenerator />},
//         ],
//     },

// ])

// export default router;

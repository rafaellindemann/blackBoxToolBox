import { createBrowserRouter } from "react-router-dom"; 
import App from "../App";
import ConversorTek from "../pages/ConversorTek";
import BlackBoxImprintTimers from "../pages/BlackBoxImprintTimers";

const router = createBrowserRouter([
    {path: '/', element: (<App />),
        children: [
            {path: "/", element: <ConversorTek />},
            {path: "/imprinttimers", element: <BlackBoxImprintTimers />},
        ],
    },

])

export default router;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import TextEditor from "./TextEditor";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root URL to a unique document UUID */}
        <Route
          path="/"
          element={<Navigate to={`/documents/${uuidV4()}`} replace />}
        />
        <Route path="/documents/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
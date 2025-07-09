import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SortingAlgorithmPage from './pages/SortingAlgorithmPage';

import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<SortingAlgorithmPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

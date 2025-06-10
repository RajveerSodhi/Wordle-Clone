import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from './routes/App.jsx';
import reportWebVitals from './reportWebVitals';
import RootRedirect from './routes/RootRedirect.jsx';
// import NotFound from './routes/NotFound.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/new" element={<RootRedirect />} />
                <Route path="/" element={<RootRedirect />} />
                <Route path="/:code" element={<App />} />
                {/* <Route path="*" element={<NotFound />} /> */}
                <Route path="*" element={<RootRedirect />} />
            </Routes>
        </Router>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TokenInput from './TokenInput';
import ReportGenerator from './ReportGenerator';
import InitialLoading from './InitialLoading';
import { validateToken } from '../services/apiLabzService';

const PowerUp = () => {
    const [token, setToken] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            const storedToken = localStorage.getItem('apiLabzToken');
            if (storedToken) {
                setToken(storedToken);
                await checkToken(storedToken);
            }
            setLoading(false);
        };

        initializeApp();
    }, []);

    const checkToken = async (tokenToCheck) => {
        const result = await validateToken(tokenToCheck);
        if (result.isValid) {
            setIsTokenValid(true);
            setCredits(result.credits);
        } else {
            setIsTokenValid(false);
            localStorage.removeItem('apiLabzToken');
        }
    };

    const handleTokenSubmit = async (newToken) => {
        setLoading(true);
        const result = await validateToken(newToken);
        if (result.isValid) {
            setToken(newToken);
            setIsTokenValid(true);
            setCredits(result.credits);
            localStorage.setItem('apiLabzToken', newToken);
        } else {
            toast.error(result.errorMessage || 'Invalid token. Please try again.');
        }
        setLoading(false);
    };

    if (loading) {
        return <InitialLoading />;
    }

    return (
        <div className="w-full h-full">
            <ToastContainer />
            {!isTokenValid ? (
                <TokenInput onSubmit={handleTokenSubmit} />
            ) : (
                <ReportGenerator token={token} credits={credits} setCredits={setCredits} />
            )}
        </div>
    );
};

export default PowerUp;
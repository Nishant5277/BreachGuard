import { useState } from 'react';
import { checkPassword, checkBulk } from '../api/passwordApi';

export const usePasswordCheck = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [bulkResult, setBulkResult] = useState(null);
  const [history, setHistory] = useState([]);

  const check = async (password) => {
    if (!password) {
      setResult(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await checkPassword(password);
      setResult(data);
      setHistory(prev => {
        const newHistory = [{ password, data, timestamp: new Date().toISOString() }, ...prev];
        return newHistory.slice(0, 20); // Keep last 20 checks
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processBulk = async (passwords) => {
    if (!passwords || passwords.length === 0) return;
    
    setLoading(true);
    setError(null);
    setBulkResult(null);
    try {
      const data = await checkBulk(passwords);
      setBulkResult(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, result, bulkResult, history, check, processBulk };
};

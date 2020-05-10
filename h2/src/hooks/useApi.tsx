/**
 * Hook that provides easy useage of API in functional components.
 */

import { useState, useEffect } from 'react';
import { debug } from '../utils/debug';

export default function useApi<T>(apiCall: () => Promise<T>, defaultValue: T, deps: Array<any> = []) {
  const [items, setItems] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  debug('useApi() ' + new Date().toLocaleString());

  /**
   * Make an asyncronous apiCall and store the result in items and
   * any potential error in error. Sets loading as true while making the request.
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const newItems = await apiCall();
        setItems(newItems);
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    };

    fetchData();
  }, deps);

  return { items, loading, error };
}
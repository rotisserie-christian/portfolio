import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient.js';

export const useGraphData = () => {
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Check cache first
                const cacheKey = 'graph-embeddings';
                const cached = localStorage.getItem(cacheKey);
                
                if (cached) {
                    try {
                        const cachedData = JSON.parse(cached);
                        setGraphData(cachedData);
                        setLoading(false);
                        return;
                    } catch {
                        console.warn('Invalid cached data, fetching fresh');
                        localStorage.removeItem(cacheKey);
                    }
                }
                
                // Check if Supabase is configured
                if (!supabase) {
                    throw new Error('Supabase client not configured');
                }

                const { data, error } = await supabase
                    .from('graphs')
                    .select('data')
                    .eq('name', 'sounds')
                    .single();

                if (error) {
                    console.error('Error fetching graph data:', error);
                    setError(error.message);
                    return;
                }

                const nodes = Object.entries(data.data.embeddings).map(([id, embedding]) => ({
                    id,
                    group: data.data.groups[id] || 1,
                    embedding
                }));

                const graphData = {
                    nodes,
                    links: []
                };

                // Cache the data
                localStorage.setItem(cacheKey, JSON.stringify(graphData));
                setGraphData(graphData);
            } catch (err) {
                console.error('Error fetching graph data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGraphData();
    }, []);

    return { graphData, loading, error };
};

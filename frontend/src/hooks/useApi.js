import { useCallback, useEffect, useState } from "react";

const useApi = (fn, deps = [], options = {}) => {
  const { auto = true, initialData = null } = options;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err?.response?.data?.message || "Something went wrong");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    deps
  );

  useEffect(() => {
    if (auto) {
      run();
    }
  }, [auto, run]);

  return { data, loading, error, run, setData };
};

export default useApi;

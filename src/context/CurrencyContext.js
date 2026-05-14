"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("USD");
  const [rate, setRate] = useState(1);
  const [ratesLoading, setRatesLoading] = useState(false);

  useEffect(() => {
    const activeUser = localStorage.getItem("expenseTracker_activeUser");
    if (activeUser) {
      const savedCurrency = localStorage.getItem(`expenseTracker_${activeUser}_currency`);
      if (savedCurrency) {
        setCurrency(savedCurrency);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchRate = async () => {
      if (currency === "USD") {
        if (isMounted) {
          setRate(1);
          setRatesLoading(false);
        }
        return;
      }
      
      if (isMounted) setRatesLoading(true);
      try {
        const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${currency}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setRate(data.rates[currency]);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      } finally {
        if (isMounted) setRatesLoading(false);
      }
    };

    fetchRate();

    const activeUser = localStorage.getItem("expenseTracker_activeUser");
    if (activeUser) {
      localStorage.setItem(`expenseTracker_${activeUser}_currency`, currency);
    }

    return () => {
      isMounted = false;
    };
  }, [currency]);

  // Format a USD-base value in the current display currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value);
  };

  // Convert an amount entered in the CURRENT currency back to USD base for storage
  const toUSD = (amount) => {
    const r = rate && rate > 0 ? rate : 1;
    return parseFloat(amount) / r;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rate, ratesLoading, formatCurrency, toUSD }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

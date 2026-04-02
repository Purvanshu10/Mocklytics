"use client";
import { useEffect } from "react";

export default function TestApiConnector() {
  useEffect(() => {
    fetch('https://mocklytics-l170.onrender.com/api/test')
      .then(res => res.json())
      .then(data => {
        // Log removed for cleaner console
      })
      .catch(err => {
        console.error('Error connecting to backend:', err);
      });
  }, []);
  return null;
}

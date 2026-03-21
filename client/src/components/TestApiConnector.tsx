"use client";
import { useEffect } from "react";

export default function TestApiConnector() {
  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then(res => res.json())
      .then(data => {
        console.log('Backend /api/test response:', data);
      })
      .catch(err => {
        console.error('Error connecting to backend:', err);
      });
  }, []);
  return null;
}

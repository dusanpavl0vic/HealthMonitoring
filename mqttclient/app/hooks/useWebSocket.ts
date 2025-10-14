"use client";


import { AthleteData } from '@/interfaces/athleteData';
import { ValidationResult } from '@/interfaces/healthData';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useWebSocket() {
  const [athletesData, setAthletesData] = useState<Map<string, AthleteData>>(new Map());
  const [athletesPredictedActivity, setAthletesPredictedActivity] = useState<Map<string, NatsMessage[]>>(new Map());
  const socketRef = useRef<Socket | null>(null);


  useEffect(() => {
    console.log("Connecting to WebSocket...");
    socketRef.current = io('http://localhost:3002');


    socketRef.current.on('connect', () => {
      console.log("Connected to WebSocket");
    });

    socketRef.current.on('health_predicted_activity', (data: NatsMessage) => {
      console.log("Received health_predicted_activity for:", data.athleteId);

      setAthletesPredictedActivity(prev => {
        const newMap = new Map(prev);
        const existingArray = newMap.get(data.athleteId) || [];
        newMap.set(data.athleteId, [...existingArray, data]); // dodaje novi podatak
        return newMap;
      });

    });

    socketRef.current.on('health_update', (data: ValidationResult) => {
      console.log("Received health_update for:", data.record.athleteId);

      setAthletesData(prev => {
        const newMap = new Map(prev);
        const athleteId = data.record.athleteId;

        if (!newMap.has(athleteId)) {
          //console.log("New athlete card created:", athleteId);
          newMap.set(athleteId, {
            athleteId,
            currentData: data,
            history: [data.record],
            lastUpdate: new Date()
          });
        } else {
          const existing = newMap.get(athleteId)!;
          newMap.set(athleteId, {
            ...existing,
            currentData: data,
            history: [...existing.history, data.record].slice(-50),
            lastUpdate: new Date()
          });
        }

        return newMap;
      });
    });




    socketRef.current.on('error', (error) => {
      console.error("WebSocket error:", error);
    });

    return () => {
      console.log("Cleaning up WebSocket - no data persistence");
      socketRef.current?.disconnect();
    };
  }, []);

  const getAthletesArray = () => {
    return Array.from(athletesData.values());
  };

  const getPRedictionArray = () => {
    return athletesPredictedActivity;
  };



  return {
    athletesData: getAthletesArray(),
    athletesPredictedActivity: getPRedictionArray(),
  };
}
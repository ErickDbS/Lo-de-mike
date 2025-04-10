import { useState, useEffect } from 'react';
import Schedule from "./Schedule";
import supabase from '../../lib/supabase';

interface Horario {
  hora: string;
  materia: string;
  profesor: string;
  tema: string;
}

interface Tarea {
    userid: string;
    user: string,
    password: string,
    active: string
}

export default function Prueba() {
    const horarios: Horario[] = [
        {hora: "17:00 - 18:00", materia: "la de Edgar", profesor: "El Edgar", tema: "el que da Edgar"},
        {hora: "18:00 - 19:00", materia: "la de Mike", profesor: "El Mike", tema: "el que da Mike"},
        {hora: "19:00 - 20:00", materia: "la de Herman", profesor: "El Herman", tema: "el que da Herman"},
        {hora: "20:00 - 21:00", materia: "la de Mirsa", profesor: "El Mirsa", tema: "el que da Mirsa"},
        {hora: "21:00 - 22:00", materia: "la de Rocio", profesor: "La Rocio", tema: "el que da Rocio"},
    ];

    const [tasks, setTasks] = useState<Tarea[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) {
            setError(error.message);
            console.error("Error:", error);
        } else {
            setTasks(data || []);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <>
            {error && <div className="error">{error}</div>}
            
            <Schedule
                grupo="4-03-IS"
                aula="Aula 20"
                horarios={horarios}
                tareas={tasks}
            />
        </>
    );
}
import { Check, X } from 'lucide-react';


interface CheckCardProps {
    nameProfesor: string;
    nameMateria: string;
    Tema:string;
    Hora:string;
}

export default function CheckCard({ nameMateria, nameProfesor, Hora, Tema }: CheckCardProps) {
    
    return (
        <div className="grid place-items-center">
            <div className="text-white text-4xl border border-solid rounded-xl w-225 grid grid-cols-2 items-center p-5 mb-4 bg-gray-900 hover:bg-gray-800 transition">
                <div className="text-xl space-y-2">
                    <p><strong className="text-blue-800">Materia:</strong> {nameMateria}</p>
                    <p><strong className="text-blue-800">Profesor:</strong> {nameProfesor}</p>
                    <p><strong className="text-blue-800">Tema:</strong> {Tema}</p>
                    <p><strong className="text-blue-800">Hora:</strong> {Hora}</p>
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        type="button"
                        className= "px-4 py-2 rounded-xl text-xl transition flex items-center gap-2 text-green-600"
                    >
                        <Check size={20} /> Asistió
                    </button>
                </div>
            </div>
        </div>
    );
}


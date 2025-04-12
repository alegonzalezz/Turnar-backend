import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }

    return res.status(200).json({
        current_patient: {
            patient_name: "María",
            patient_surname: "Pérez",
            consulting_room: "Consultorio 1"
        },
        previous_patients: [
            {
                patient_name: "Lucas",
                patient_surname: "Gómez",
                consulting_room: "Consultorio 2"
            },
            {
                patient_name: "Ana",
                patient_surname: "López",
                consulting_room: "Consultorio 1"
            },
            {
                patient_name: "Julián",
                patient_surname: "Martínez",
                consulting_room: "Consultorio 3"
            }
        ]
    });
}

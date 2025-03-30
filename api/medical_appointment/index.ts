import { VercelRequest, VercelResponse } from '@vercel/node';
import {supabase} from "../../common/supabaseClient";

import Cors from 'cors';
import {runMiddleware} from "../../common/runMiddleware";

const cors = Cors({origin:true})


export default async function handler(req: VercelRequest, res: VercelResponse) {
    await runMiddleware(req, res, cors);
    if (req.method == 'POST') {
        const missingParams: string[] = [];
        const { patient_name, patient_surname, dni, years, medical_coverage, priority, description } = req.body || {};

        if (!patient_name) missingParams.push('MISSING_PATIENT_NAME_PARAM');
        if (!patient_surname) missingParams.push('MISSING_PATIENT_SURNAME_PARAM');
        if (!dni) missingParams.push('MISSING_DNI_PARAM');
        if (!years) missingParams.push('MISSING_YEARS_PARAM');
        if (!medical_coverage) missingParams.push('MISSING_MEDICAL_COVERAGE_PARAM');
        if (!priority) missingParams.push('MISSING_PRIORITY_PARAM');
        if (!description) missingParams.push('MISSING_DESCRIPTION_PARAM');

        if (missingParams.length > 0) {
            return res.status(400).json({ message: 'Missing required fields', missingParams });
        }

        const {data, error} = await supabase.from('MEDICAL_APPOINTMENT')
            .insert({
                patient_name:patient_name,
                patient_surname:patient_surname,
                dni:dni,
                years:years,
                medical_coverage:medical_coverage,
                priority:priority,
                description:description,
            })

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json({ message: 'Appointment created successfully' });
    }else{
        return res.status(405).json({ message: 'Only POST requests are allowed' , method: req.method});
    }


}
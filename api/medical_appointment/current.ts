import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../common/supabaseClient';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  // Obtener los últimos 3 pacientes llamados (ordenados por fecha descendente)
  const { data: previousPatients, error: prevError } = await supabase
    .from('MEDICAL_APPOINTMENT')
    .select('patient_name, patient_surname, consulting_room')
    .not('called_at', 'is', null)
    .order('called_at', { ascending: false })
    .limit(3);

  if (prevError) {
    return res.status(500).json({ error: prevError.message });
  }

  // Obtener el próximo paciente NO llamado
  const { data: currentPatientData, error: currError } = await supabase
    .from('MEDICAL_APPOINTMENT')
    .select('patient_name, patient_surname, consulting_room')
    .is('called_at', null)
    .order('priority', { ascending: true }) // Prioridad más alta primero
    .order('created_at', { ascending: true }) // Luego, el más antiguo
    .limit(1)
    .single();

  if (currError) {
    return res.status(500).json({ error: currError.message });
  }

  return res.status(200).json({
    current_patient: currentPatientData || null,
    previous_patients: previousPatients || [],
  });
}

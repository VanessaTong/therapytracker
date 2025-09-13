export type Patient = {
    id: string
    name: string
    email: string
    phone: string
    dob: string
    lastSession: string
    score: number
    active: boolean
    }
    
    
    export const patients: Patient[] = [
    { id: 'sarah-johnson', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '(555) 123-4567', dob: '1988-03-15', lastSession: '1/10/2024', score: 7, active: true },
    { id: 'michael-chen', name: 'Michael Chen', email: 'michael.chen@email.com', phone: '(555) 234-5678', dob: '1990-07-21', lastSession: '1/8/2024', score: 5, active: true },
    { id: 'emma-davis', name: 'Emma Davis', email: 'emma.davis@email.com', phone: '(555) 345-6789', dob: '1992-11-02', lastSession: '12/20/2023', score: 8, active: false },
    ]
    
    
    export const findPatient = (id: string) => patients.find(p => p.id === id)
    
    
    export const overviewTrend = [
    { date: '2024-01-01', mood: 6.8, anxiety: 5.8, stress: 5.0 },
    { date: '2024-01-08', mood: 6.1, anxiety: 5.1, stress: 4.2 },
    { date: '2024-01-15', mood: 5.0, anxiety: 4.3, stress: 3.2 },
    { date: '2024-01-22', mood: 4.2, anxiety: 3.6, stress: 3.0 },
    { date: '2024-01-29', mood: 5.2, anxiety: 3.9, stress: 3.8 },
    ]
    
    
    export const notesById: Record<string, { date: string; mood: number; tag: 'improving' | 'stable' | 'declining'; text: string; next?: string }[]> = {
    'sarah-johnson': [
    { date: 'Wed, Jan 10, 2024', mood: 7, tag: 'improving', text: 'Patient showed significant improvement in managing anxiety. Discussed coping strategies and homework assignments.', next: '1/17/2024' },
    { date: 'Wed, Jan 3, 2024', mood: 6, tag: 'stable', text: 'Continued work on CBT techniques. Patient reports better sleep patterns.', next: '1/10/2024' },
    ],
    }
    
    
    export const surveyById: Record<string, { title: string; fields: { q: string; a: string }[]; completed: string }[]> = {
    'sarah-johnson': [
    {
    title: 'Anxiety Assessment',
    fields: [
    { q: 'How often do you feel anxious?', a: 'Sometimes' },
    { q: 'Rate your stress level (1-10):', a: '6' },
    { q: 'Do you have trouble sleeping?', a: 'Occasionally' },
    ],
    completed: '1/9/2024',
    },
    {
    title: 'Depression Screening',
    fields: [
    { q: 'How often do you feel sad?', a: 'Rarely' },
    { q: 'Rate your energy level (1-10):', a: '7' },
    { q: 'Do you enjoy activities?', a: 'Most of the time' },
    ],
    completed: '1/5/2024',
    },
    ],
    }
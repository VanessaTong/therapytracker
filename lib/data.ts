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
    { id: 'sarah-johnson', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '(555) 123-4567', dob: '1988-03-15', lastSession: '16/09/2025', score: 7, active: true },
    { id: 'michael-chen', name: 'Michael Chen', email: 'michael.chen@email.com', phone: '(555) 234-5678', dob: '1990-07-21', lastSession: '14/09/2025', score: 5, active: true },
    { id: 'alice-wong', name: 'Alice Wong', email: 'alice.wong@email.com', phone: '(555) 345-6789', dob: '1992-11-02', lastSession: '13/09/2025', score: 8, active: true },
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
    { date: 'Aug 01, 2025', mood: 3, tag: 'improving', text: 'Patient presented with persistent feelings of emptiness, reporting early morning awakenings around 4am and difficulty returning to sleep. She described low appetite, low energy, and loss of interest in painting, which she previously enjoyed. Work performance has declined due to difficulty concentrating. Patient noted withdrawing from social activities with friends, fearing she is a burden. Therapist introduced psychoeducation on depression and explained the CBT model (connection between thoughts, feelings, and behaviors). Patient was encouraged to begin a nightly journaling exercise, focusing on capturing automatic negative thoughts. Patient was engaged but tearful during the discussion, acknowledged difficulty but expressed willingness to try journaling. Homework: Daily journaling of mood and thoughts; establish a consistent bedtime routine.    ', next: '16/09/2025' },
    { date: 'Sep 16, 2025', mood: 7, tag: 'stable', text: 'Patient described feeling slightly more hopeful after journaling consistently for a week. She shared that she reconnected with a close friend, though initially nervous, she reported feeling lighter afterwards. Still experiences difficulty focusing at work but less intense feelings of guilt. Therapist introduced behavioral activation strategies, encouraging patient to schedule pleasant activities even if motivation is low. Patient chose to commit to painting for 30 minutes twice this week. Homework: Continue journaling, implement behavioral activation, and record mood changes associated with activities.', next: '21/09/2025' },
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
    completed: '15/09/2025',
    },
    {
    title: 'Depression Screening',
    fields: [
    { q: 'How often do you feel sad?', a: 'Rarely' },
    { q: 'Rate your energy level (1-10):', a: '7' },
    { q: 'Do you enjoy activities?', a: 'Most of the time' },
    ],
    completed: '31/08/2025',
    },
    ],
    }

    
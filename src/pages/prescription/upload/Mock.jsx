const MOCK_SAMPLES = [
    {
        id: 'sample-1',
        patient: 'Amina Khan',
        drug: 'Amoxicillin 500mg',
        qty: '21 Capsules',
        sig: 'Take 1 capsule three times daily for 7 days',
        docName: 'Dr. Sterling',
        type: 'Antibiotic',
        confidence: '99.2%',
        accuracy: '100%',
        verification: 'High',
        status: 'Verified',
        svg: createMockSvg('Amina Khan', 'Amoxicillin 500mg', '500mg', '21 Capsules', 'Take 1 capsule three times daily for 7 days', 'Dr. Sterling'),
        medications: [
            {
                name: 'Amoxicillin 500mg',
                type: 'Antibiotic • Capsule',
                match: '99%',
                dosage: '1 Capsule',
                frequency: 'Twice Daily',
                duration: '5 Days',
                instructions: 'After Meals',
                icon: 'medication'
            },
            {
                name: 'Paracetamol 650mg',
                type: 'Analgesic • Tablet',
                match: '98%',
                dosage: '1 Tablet',
                frequency: 'As Needed',
                duration: '3 Days',
                instructions: 'Fever > 100°F',
                icon: 'pill'
            }
        ],
        bento: {
            generic: {
                title: 'Generic Alternative Available',
                desc: 'A structurally identical generic for Amoxicillin is available locally.',
                savings: 'Save Rs. 450'
            },
            safety: {
                status: 'passed',
                rules: [
                    'No adverse drug interactions',
                    'Dosages within safe limits',
                    'Clinical checks fully cleared'
                ]
            }
        },
        fhir: {
            resourceType: "MedicationRequest",
            id: "rx-9082",
            status: "active",
            intent: "order",
            medicationCodeableConcept: {
                coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "308182", display: "Amoxicillin 500mg Oral Capsule" }]
            },
            subject: { reference: "Patient/amina-khan", display: "Amina Khan" },
            dosageInstruction: [{
                text: "Take 1 capsule three times daily for 7 days",
                timing: { repeat: { frequency: 3, period: 1, periodUnit: "d" } },
                doseAndRate: [{ doseQuantity: { value: 1, unit: "capsule" } }]
            }],
            dispenseRequest: { quantity: { value: 21, unit: "capsule" } }
        }
    },
    {
        id: 'sample-2',
        patient: 'Imran Malik',
        drug: 'Metformin 1000mg',
        qty: '60 Tablets',
        sig: 'Take 1 tablet twice daily with meals',
        docName: 'Dr. Sarah Smith',
        type: 'Anti-Diabetic',
        confidence: '99.5%',
        accuracy: '100%',
        verification: 'High',
        status: 'Verified',
        svg: createMockSvg('Imran Malik', 'Metformin 1000mg', '1000mg', '60 Tablets', 'Take 1 tablet twice daily with meals', 'Dr. Sarah Smith'),
        medications: [
            {
                name: 'Metformin 1000mg',
                type: 'Anti-Diabetic • Tablet',
                match: '99%',
                dosage: '1 Tablet',
                frequency: 'Twice Daily',
                duration: '60 Days',
                instructions: 'With Meals',
                icon: 'medication'
            },
            {
                name: 'Glipizide 5mg',
                type: 'Anti-Diabetic • Tablet',
                match: '96%',
                dosage: '1 Tablet',
                frequency: 'Once Daily',
                duration: '30 Days',
                instructions: 'Before Breakfast',
                icon: 'pill'
            }
        ],
        bento: {
            generic: {
                title: 'Generic Alternative Available',
                desc: 'A structurally identical generic for Metformin is available locally.',
                savings: 'Save Rs. 180'
            },
            safety: {
                status: 'passed',
                rules: [
                    'No adverse drug interactions',
                    'Dosages within safe limits',
                    'Clinical checks fully cleared'
                ]
            }
        },
        fhir: {
            resourceType: "MedicationRequest",
            id: "rx-9081",
            status: "active",
            intent: "order",
            medicationCodeableConcept: {
                coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "860975", display: "Metformin hydrochloride 1000mg Oral Tablet" }]
            },
            subject: { reference: "Patient/imran-malik", display: "Imran Malik" },
            dosageInstruction: [{
                text: "Take 1 tablet twice daily with meals",
                timing: { repeat: { frequency: 2, period: 1, periodUnit: "d" } },
                doseAndRate: [{ doseQuantity: { value: 1, unit: "tablet" } }]
            }],
            dispenseRequest: { quantity: { value: 60, unit: "tablet" } }
        }
    },
    {
        id: 'sample-3',
        patient: 'Bilal Ahmed',
        drug: 'Ibuprofen 400mg',
        qty: '30 Tablets',
        sig: 'Take 1 tablet every 6 hours as needed for severe pain',
        docName: 'Dr. Sterling',
        type: 'NSAID',
        confidence: '97.5%',
        accuracy: '98%',
        verification: 'Flagged',
        status: 'Flagged (Dosage)',
        svg: createMockSvg('Bilal Ahmed', 'Ibuprofen 400mg', '400mg', '30 Tablets', 'Take 1 tablet every 6 hours as needed for severe pain', 'Dr. Sterling'),
        medications: [
            {
                name: 'Ibuprofen 400mg',
                type: 'NSAID • Tablet',
                match: '98%',
                dosage: '1 Tablet',
                frequency: 'Every 6 Hours',
                duration: '3 Days',
                instructions: 'As Needed for Pain',
                icon: 'medication'
            },
            {
                name: 'Omeprazole 20mg',
                type: 'Proton Pump Inhibitor • Capsule',
                match: '95%',
                dosage: '1 Capsule',
                frequency: 'Once Daily',
                duration: '7 Days',
                instructions: '30m Before Breakfast',
                icon: 'pill'
            }
        ],
        bento: {
            generic: {
                title: 'Generic Alternative Available',
                desc: 'A structurally identical generic for Ibuprofen is available locally.',
                savings: 'Save Rs. 50'
            },
            safety: {
                status: 'flagged',
                rules: [
                    'No adverse drug interactions detected',
                    'Flagged: High daily cumulative dosage',
                    'Verify patient age and renal clearance'
                ]
            }
        },
        fhir: {
            resourceType: "MedicationRequest",
            id: "rx-9079",
            status: "active",
            intent: "order",
            medicationCodeableConcept: {
                coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "197821", display: "Ibuprofen 400mg Oral Tablet" }]
            },
            subject: { reference: "Patient/bilal-ahmed", display: "Bilal Ahmed" },
            dosageInstruction: [{
                text: "Take 1 tablet every 6 hours as needed for pain",
                timing: { repeat: { frequency: 4, period: 1, periodUnit: "d" } },
                doseAndRate: [{ doseQuantity: { value: 1, unit: "tablet" } }]
            }],
            dispenseRequest: { quantity: { value: 30, unit: "tablet" } }
        }
    }
];



{/* TAB 3: SELECT SAMPLE LIST */ }
{
    activeTab === 'sample' && (
        <div className="flex-1 min-h-[300px] flex flex-col gap-4">
            <p className="text-xs text-slate-500 mb-2 text-left font-sans">Select a diagnostic mock script to test the OCR engine pipelines:</p>

            <div className="flex flex-col gap-3">
                {MOCK_SAMPLES.map((sample) => (
                    <div
                        key={sample.id}
                        onClick={() => handleSampleSelect(sample)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${selectedSampleId === sample.id
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-primary shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/40'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sample.patient}</h4>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{sample.type}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sample.status === 'Verified'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                {sample.status}
                            </span>
                        </div>
                        <p className="text-xs font-medium text-slate-705 dark:text-slate-300">{sample.drug}</p>
                        <p className="text-[10px] text-slate-500 mt-1 italic">"{sample.sig}"</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
<button
    onClick={() => setActiveTab('sample')}
    className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'sample'
        ? 'bg-white dark:bg-slate-900 text-primary dark:text-white shadow-sm'
        : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
        }`}
>
    Select Sample
</button>
export type QuizQ = {
  question: string;
  answers: string[]; // max 3
  correctIndex: number;
  explanation: string;
};

export const QUESTIONS: QuizQ[] = [
  {
    question: "Under GDPR, what is 'personal data'?",
    answers: [
      "Only financial records",
      "Any info that can identify a person",
      "Only passwords",
    ],
    correctIndex: 1,
    explanation:
      "Personal data is any information relating to an identified or identifiable person.",
  },
  {
    question: "Which is a valid lawful basis for processing under GDPR?",
    answers: ["Consent", "Because I want to", "No reason needed"],
    correctIndex: 0,
    explanation:
      "GDPR requires a lawful basis such as consent, contract, or legal obligation.",
  },
  {
    question: "What does 'data minimization' mean?",
    answers: [
      "Collect as much data as possible",
      "Collect only what you need",
      "Store data forever",
    ],
    correctIndex: 1,
    explanation: "Only collect personal data that is necessary for the purpose.",
  },
  {
    question: "What right allows users to request their data be deleted?",
    answers: [
      "Right to Access",
      "Right to Be Forgotten",
      "Right to Sell Data",
    ],
    correctIndex: 1,
    explanation:
      "The Right to Be Forgotten allows individuals to request deletion of their personal data.",
  },
  {
    question: "Who is responsible for protecting personal data?",
    answers: [
      "Only the user",
      "Only the government",
      "Organizations that process the data",
    ],
    correctIndex: 2,
    explanation:
      "Organizations that collect or process data are responsible for protecting it.",
  },
  {
    question: "What should happen if a data breach occurs?",
    answers: [
      "Ignore it",
      "Report it to authorities and affected users",
      "Delete the database quietly",
    ],
    correctIndex: 1,
    explanation:
      "GDPR requires timely reporting of data breaches to authorities and users.",
  },
  {
    question: "What is 'consent' under GDPR?",
    answers: [
      "Pre-checked boxes",
      "Silence or inactivity",
      "Clear and explicit agreement",
    ],
    correctIndex: 2,
    explanation:
      "Consent must be freely given, specific, informed, and unambiguous.",
  },
  {
    question: "Can users withdraw consent?",
    answers: [
      "No, once given it is permanent",
      "Yes, at any time",
      "Only after 1 year",
    ],
    correctIndex: 1,
    explanation:
      "Users have the right to withdraw consent at any time.",
  },
  {
    question: "What is a data processor?",
    answers: [
      "A company that uses data for its own purposes",
      "A person who analyzes data for fun",
      "An entity that processes data on behalf of another",
    ],
    correctIndex: 2,
    explanation:
      "A data processor processes personal data on behalf of a data controller.",
  },
  {
    question: "What is a data controller?",
    answers: [
      "The entity that decides how and why data is processed",
      "Anyone with a computer",
      "Only government agencies",
    ],
    correctIndex: 0,
    explanation:
      "The controller determines the purposes and means of processing personal data.",
  },
  {
    question: "What does 'privacy by design' mean?",
    answers: [
      "Add privacy later if needed",
      "Ignore privacy during development",
      "Build privacy into systems from the start",
    ],
    correctIndex: 2,
    explanation:
      "Privacy should be considered from the earliest stages of system design.",
  },
  {
    question: "What does GDPR stand for?",
    answers: [
      "General Data Protection Regulation",
      "Global Data Privacy Rules",
      "Government Data Policy Rule",
    ],
    correctIndex: 0,
    explanation:
      "GDPR stands for General Data Protection Regulation.",
  },
  {
    question: "Which of these is sensitive personal data?",
    answers: [
      "Favorite color",
      "Health information",
      "Browser type",
    ],
    correctIndex: 1,
    explanation:
      "Health data is considered special category (sensitive) personal data.",
  },
  {
    question: "How long should personal data be kept?",
    answers: [
      "Forever",
      "As long as it is needed",
      "At least 10 years",
    ],
    correctIndex: 1,
    explanation:
      "Data should only be kept for as long as necessary for its purpose.",
  },
  {
    question: "What right allows users to see their personal data?",
    answers: [
      "Right to Access",
      "Right to Ignore",
      "Right to Modify the Law",
    ],
    correctIndex: 0,
    explanation:
      "The Right of Access allows users to request a copy of their data.",
  },
  {
    question: "Are companies outside the EU affected by GDPR?",
    answers: [
      "No, only EU companies",
      "Yes, if they process EU residents’ data",
      "Only if they have an EU office",
    ],
    correctIndex: 1,
    explanation:
      "GDPR applies to any organization processing EU residents’ data.",
  },
  {
    question: "What is a lawful reason to collect personal data?",
    answers: [
      "User consent",
      "Curiosity",
      "Future unknown use",
    ],
    correctIndex: 0,
    explanation:
      "A lawful basis such as consent is required to collect personal data.",
  },
  {
    question: "What should a privacy policy do?",
    answers: [
      "Hide information",
      "Explain how data is used",
      "Confuse users",
    ],
    correctIndex: 1,
    explanation:
      "A privacy policy should clearly explain data usage to users.",
  },
  {
    question: "What happens if GDPR rules are broken?",
    answers: [
      "Nothing",
      "Fines and penalties",
      "Only a warning email",
    ],
    correctIndex: 1,
    explanation:
      "Organizations can face significant fines for GDPR violations.",
  },
  {
    question: "Is anonymized data considered personal data?",
    answers: [
      "Yes, always",
      "No, if it cannot identify a person",
      "Only in the EU",
    ],
    correctIndex: 1,
    explanation:
      "Properly anonymized data is not considered personal data under GDPR.",
  },
  {
    question: "What should users be able to do with their data?",
    answers: [
      "Nothing",
      "Control and understand its use",
      "Sell it themselves",
    ],
    correctIndex: 1,
    explanation:
      "GDPR gives users control and transparency over their personal data.",
  },
  {
    question: "What is the purpose of GDPR?",
    answers: [
      "To protect user privacy",
      "To make data public",
      "To slow down companies",
    ],
    correctIndex: 0,
    explanation:
      "GDPR exists to protect individuals’ privacy and personal data.",
  },
  {
    question: "What does 'data accuracy' require?",
    answers: [
      "Data can be incorrect",
      "Data must be kept accurate and up to date",
      "Only names must be accurate",
    ],
    correctIndex: 1,
    explanation:
      "Organizations must keep personal data accurate and up to date.",
  },
  {
    question: "Can users ask who their data is shared with?",
    answers: [
      "No",
      "Yes",
      "Only lawyers can",
    ],
    correctIndex: 1,
    explanation:
      "Users have the right to know who their data is shared with.",
  },
];


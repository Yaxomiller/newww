"""
Legal Document Validator - Integrated with Web Interface
Validates legal documents and identifies flaws
"""

import torch
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments,
)
from datasets import Dataset, DatasetDict
import json
import os
from typing import Dict, List, Tuple
import numpy as np
from dataclasses import dataclass, asdict
import re


@dataclass
class LegalFlaw:
    """Represents a legal flaw in a document"""
    flaw_type: str
    severity: str
    location: str
    description: str
    suggestion: str
    clause_text: str = ""


class LegalDocumentValidator:
    """
    Validates legal documents and identifies flaws
    """

    def __init__(self, use_gpu: bool = True):
        self.device = torch.device('cuda' if use_gpu and torch.cuda.is_available() else 'cpu')
        print(f"🔧 Device: {self.device}")

        print("\n📚 Loading models for legal validation...")
        print("   • Loading document classifier...")
        self.doc_tokenizer = AutoTokenizer.from_pretrained("nlpaueb/legal-bert-base-uncased")
        self.doc_classifier = AutoModelForSequenceClassification.from_pretrained(
            "nlpaueb/legal-bert-base-uncased",
            num_labels=2
        ).to(self.device)

        print("   • Loading clause analyzer...")
        self.clause_tokenizer = AutoTokenizer.from_pretrained("nlpaueb/legal-bert-base-uncased")
        self.clause_classifier = AutoModelForSequenceClassification.from_pretrained(
            "nlpaueb/legal-bert-base-uncased",
            num_labels=len(self._get_flaw_types())
        ).to(self.device)

        print("✓ Models loaded")

        self.legal_requirements = self._define_legal_requirements()

        print("\n🔧 Training on legal flaw detection data...")
        self._train_on_legal_data()
        print("✓ Training complete")

    def _get_flaw_types(self) -> List[str]:
        """Define types of legal flaws to detect"""
        return [
            "NO_FLAW",
            "MISSING_PARTIES",
            "MISSING_DATE",
            "MISSING_SIGNATURES",
            "AMBIGUOUS_TERMS",
            "MISSING_TERMINATION_CLAUSE",
            "MISSING_GOVERNING_LAW",
            "MISSING_DISPUTE_RESOLUTION",
            "UNCLEAR_OBLIGATIONS",
            "MISSING_CONFIDENTIALITY",
            "INVALID_DURATION",
            "MISSING_LIABILITY_LIMIT",
            "INCONSISTENT_DATES",
            "VAGUE_PAYMENT_TERMS",
            "MISSING_INTELLECTUAL_PROPERTY",
            "UNENFORCEABLE_CLAUSE"
        ]

    def _define_legal_requirements(self) -> Dict:
        """Define what makes a legal document valid"""
        return {
            "NDA": {
                "required_clauses": [
                    "parties_identification",
                    "confidential_information_definition",
                    "obligations",
                    "term_duration",
                    "governing_law",
                    "signatures"
                ],
                "optional_clauses": [
                    "dispute_resolution",
                    "remedies",
                    "return_of_materials"
                ],
                "prohibited_terms": [
                    "perpetual confidentiality",
                    "unlimited liability",
                ]
            },
            "EMPLOYMENT_AGREEMENT": {
                "required_clauses": [
                    "parties_identification",
                    "position_duties",
                    "compensation",
                    "term_termination",
                    "governing_law",
                    "signatures"
                ],
                "optional_clauses": [
                    "benefits",
                    "non_compete",
                    "intellectual_property"
                ],
                "prohibited_terms": []
            },
            "FOUNDER_AGREEMENT": {
                "required_clauses": [
                    "parties_identification",
                    "equity_distribution",
                    "vesting_schedule",
                    "intellectual_property",
                    "governing_law",
                    "signatures"
                ],
                "optional_clauses": [
                    "non_compete",
                    "dispute_resolution"
                ],
                "prohibited_terms": []
            },
            "SAFE_AGREEMENT": {
                "required_clauses": [
                    "parties_identification",
                    "investment_amount",
                    "valuation_cap",
                    "conversion_terms",
                    "governing_law",
                    "signatures"
                ],
                "optional_clauses": [],
                "prohibited_terms": []
            },
            "GENERAL": {
                "required_clauses": [
                    "parties_identification",
                    "effective_date",
                    "governing_law",
                    "signatures"
                ],
                "optional_clauses": [],
                "prohibited_terms": []
            }
        }

    def _create_training_data(self) -> DatasetDict:
        """Create synthetic training data"""

        training_samples = [
            {
                "text": """NON-DISCLOSURE AGREEMENT
This Agreement is entered into as of January 15, 2025, by and between TechCorp Inc. and John Smith.

1. CONFIDENTIAL INFORMATION
Confidential Information includes trade secrets, business plans, technology, and customer data.

2. OBLIGATIONS
The Receiving Party shall maintain confidentiality and not disclose to third parties.

3. TERM
This Agreement shall remain in effect for three (3) years from the date of execution.

4. GOVERNING LAW
This Agreement shall be governed by the laws of California.

5. SIGNATURES
Signed by both parties on January 15, 2025.""",
                "label": 0,
                "flaws": []
            },
            {
                "text": """EMPLOYMENT AGREEMENT
This Agreement is made on March 1, 2025, between Global Corp and Sarah Johnson.

1. POSITION
Employee is employed as Senior Engineer.

2. COMPENSATION
Base salary: $120,000 per annum.

3. TERM
At-will employment, 30 days notice required.

4. GOVERNING LAW
Governed by the laws of Singapore.

5. SIGNATURES
Executed by both parties.""",
                "label": 0,
                "flaws": []
            },
            {
                "text": """AGREEMENT
This Agreement is between someone and someone else.
The parties agree to keep information confidential.
This agreement is effective immediately.""",
                "label": 1,
                "flaws": ["MISSING_PARTIES", "MISSING_DATE"]
            },
            {
                "text": """CONTRACT
John will work for ABC Company.
He will be paid some amount.
This agreement starts now and continues forever.""",
                "label": 1,
                "flaws": ["VAGUE_PAYMENT_TERMS", "INVALID_DURATION"]
            }
        ]

        return DatasetDict({
            "train": Dataset.from_list(training_samples)
        })

    def _train_on_legal_data(self):
        """Train the classifier on legal documents"""
        dataset = self._create_training_data()

        def tokenize_function(examples):
            return self.doc_tokenizer(
                examples["text"],
                padding="max_length",
                truncation=True,
                max_length=512
            )

        tokenized_dataset = dataset.map(tokenize_function, batched=True)

        training_args = TrainingArguments(
            output_dir="./legal_validator",
            num_train_epochs=3,
            per_device_train_batch_size=2,
            warmup_steps=5,
            weight_decay=0.01,
            logging_steps=5,
            save_strategy="no",
            report_to="none"
        )

        trainer = Trainer(
            model=self.doc_classifier,
            args=training_args,
            train_dataset=tokenized_dataset["train"],
        )

        trainer.train()

    def validate_document(self, text: str, document_type: str = "GENERAL") -> Dict:
        """
        Main validation function
        """
        print(f"\n📄 Validating {document_type} document...")
        print(f"📏 Length: {len(text)} characters")

        # Overall document classification
        is_valid, confidence = self._classify_document(text)

        # Rule-based validation
        structural_flaws = self._check_structural_requirements(text, document_type)

        # Pattern-based flaw detection
        pattern_flaws = self._detect_pattern_flaws(text)

        # Semantic analysis
        semantic_flaws = self._analyze_semantic_issues(text, document_type)

        # Combine and deduplicate
        all_flaws = structural_flaws + pattern_flaws + semantic_flaws
        unique_flaws = self._deduplicate_flaws(all_flaws)
        unique_flaws.sort(key=lambda x: {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}[x.severity])

        # Calculate compliance
        is_compliant = len([f for f in unique_flaws if f.severity in ["CRITICAL", "HIGH"]]) == 0

        print(f"✓ Validation complete: {len(unique_flaws)} issues found")

        return {
            "is_compliant": is_compliant,
            "is_valid": is_valid,
            "confidence": float(confidence),
            "total_flaws": len(unique_flaws),
            "critical_flaws": len([f for f in unique_flaws if f.severity == "CRITICAL"]),
            "high_flaws": len([f for f in unique_flaws if f.severity == "HIGH"]),
            "medium_flaws": len([f for f in unique_flaws if f.severity == "MEDIUM"]),
            "low_flaws": len([f for f in unique_flaws if f.severity == "LOW"]),
            "flaws": [asdict(f) for f in unique_flaws]
        }

    def _classify_document(self, text: str) -> Tuple[bool, float]:
        """ML classification"""
        inputs = self.doc_tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True
        ).to(self.device)

        with torch.no_grad():
            outputs = self.doc_classifier(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)
            prediction = torch.argmax(probs, dim=1).item()
            confidence = probs[0][prediction].item()

        return (prediction == 0), confidence

    def _check_structural_requirements(self, text: str, doc_type: str) -> List[LegalFlaw]:
        """Check required clauses"""
        flaws = []
        requirements = self.legal_requirements.get(doc_type, self.legal_requirements["GENERAL"])
        text_lower = text.lower()

        clause_checks = {
            "parties_identification": (
                ["party", "parties", "between", "by and between"],
                "Document must clearly identify all parties",
                "Add: 'This Agreement is entered into between [Party A] and [Party B]'"
            ),
            "effective_date": (
                ["date", "dated", "as of", "entered into as of"],
                "Document must have an effective date",
                "Add effective date: 'as of [Date]'"
            ),
            "governing_law": (
                ["governing law", "governed by", "laws of", "jurisdiction"],
                "Document must specify governing law",
                "Add: 'This Agreement shall be governed by the laws of [Jurisdiction]'"
            ),
            "signatures": (
                ["signature", "signed", "executed"],
                "Document must have signature provisions",
                "Add signature section for all parties"
            ),
            "equity_distribution": (
                ["equity", "shares", "ownership", "stock"],
                "Founder agreement must define equity split",
                "Add: 'Equity shall be distributed as follows: [details]'"
            ),
            "vesting_schedule": (
                ["vesting", "vest", "cliff"],
                "Founder agreement must include vesting terms",
                "Add: 'Equity shall vest over [period] with [cliff]'"
            ),
            "intellectual_property": (
                ["intellectual property", "ip", "patents", "copyright"],
                "Document should address IP ownership",
                "Add: 'All intellectual property shall belong to [Party]'"
            ),
            "compensation": (
                ["compensation", "salary", "payment"],
                "Employment agreement must specify compensation",
                "Add: 'Employee shall receive [amount] per [period]'"
            ),
            "investment_amount": (
                ["purchase amount", "investment", "inr", "rs"],
                "SAFE must specify investment amount",
                "Add: 'Purchase Amount: INR [amount]'"
            ),
            "valuation_cap": (
                ["valuation cap", "cap"],
                "SAFE should include valuation cap",
                "Add: 'Valuation Cap: INR [amount]'"
            )
        }

        for clause_name in requirements["required_clauses"]:
            if clause_name in clause_checks:
                keywords, description, suggestion = clause_checks[clause_name]
                if not any(keyword in text_lower for keyword in keywords):
                    flaws.append(LegalFlaw(
                        flaw_type=f"MISSING_{clause_name.upper()}",
                        severity="CRITICAL",
                        location="Document-wide",
                        description=description,
                        suggestion=suggestion
                    ))

        return flaws

    def _detect_pattern_flaws(self, text: str) -> List[LegalFlaw]:
        """Pattern matching for flaws"""
        flaws = []
        text_lower = text.lower()

        patterns = [
            {
                "pattern": r'\b(someone|somebody|party [a-z]|the other party)\b',
                "flaw_type": "AMBIGUOUS_PARTIES",
                "severity": "CRITICAL",
                "description": "Document uses vague party identifiers",
                "suggestion": "Replace with specific party names"
            },
            {
                "pattern": r'\b(some amount|to be determined|tbd|___+)\b',
                "flaw_type": "INCOMPLETE_TERMS",
                "severity": "CRITICAL",
                "description": "Document contains incomplete terms",
                "suggestion": "Fill in all specific terms"
            },
            {
                "pattern": r'\b(forever|perpetual|indefinite)\b',
                "flaw_type": "INVALID_DURATION",
                "severity": "HIGH",
                "description": "Potentially unenforceable perpetual terms",
                "suggestion": "Specify a reasonable fixed term"
            },
            {
                "pattern": r'\b(may|might|possibly)\b',
                "flaw_type": "WEAK_OBLIGATIONS",
                "severity": "MEDIUM",
                "description": "Weak, non-binding language",
                "suggestion": "Use 'shall', 'will', 'must'"
            }
        ]

        for pattern_info in patterns:
            matches = list(re.finditer(pattern_info["pattern"], text_lower, re.IGNORECASE))

            if matches:
                first_match = matches[0]
                start = max(0, first_match.start() - 30)
                end = min(len(text), first_match.end() + 30)
                context = text[start:end]

                flaws.append(LegalFlaw(
                    flaw_type=pattern_info["flaw_type"],
                    severity=pattern_info["severity"],
                    location=f"Line ~{text[:first_match.start()].count(chr(10)) + 1}",
                    description=f"{pattern_info['description']} ({len(matches)} instance(s))",
                    suggestion=pattern_info["suggestion"],
                    clause_text=context.strip()
                ))

        return flaws

    def _analyze_semantic_issues(self, text: str, doc_type: str) -> List[LegalFlaw]:
        """Semantic analysis"""
        flaws = []
        text_lower = text.lower()

        if len(text) < 300:
            flaws.append(LegalFlaw(
                flaw_type="INSUFFICIENT_DETAIL",
                severity="MEDIUM",
                location="Document-wide",
                description="Document is unusually brief",
                suggestion="Ensure all material terms are detailed"
            ))

        if "section 27" in text_lower and "non-compete" in text_lower:
            flaws.append(LegalFlaw(
                flaw_type="SECTION_27_VIOLATION",
                severity="CRITICAL",
                location="Non-compete clause",
                description="Non-compete may violate Section 27 of Indian Contract Act",
                suggestion="Remove post-termination non-compete or limit to employment period only"
            ))

        return flaws

    def _deduplicate_flaws(self, flaws: List[LegalFlaw]) -> List[LegalFlaw]:
        """Remove duplicates"""
        seen = set()
        unique = []

        for flaw in flaws:
            key = (flaw.flaw_type, flaw.location)
            if key not in seen:
                seen.add(key)
                unique.append(flaw)

        return unique

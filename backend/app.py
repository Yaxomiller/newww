"""
Flask Backend for Legal Document Analyzer
Integrates the ML validator with the web frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import tempfile
from legal_validator import LegalDocumentValidator
import traceback

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'txt', 'doc', 'docx', 'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

print("\n" + "="*80)
print("LEGAL DOCUMENT ANALYZER - FLASK BACKEND")
print("="*80)

validator = None

try:
    print("\n🔧 Initializing Legal Document Validator...")
    validator = LegalDocumentValidator(use_gpu=False)
    print("✓ Validator initialized successfully")
except Exception as e:
    print(f"⚠️  Warning: Could not initialize validator: {e}")
    print("   Using fallback mode...")


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def detect_document_type(text):
    """Auto-detect document type from content"""
    text_lower = text.lower()

    if "non-disclosure" in text_lower or "confidential" in text_lower:
        return "NDA"
    elif "employment agreement" in text_lower or "employee" in text_lower:
        return "EMPLOYMENT_AGREEMENT"
    elif "founder" in text_lower and "equity" in text_lower:
        return "FOUNDER_AGREEMENT"
    elif "safe" in text_lower and "investment" in text_lower:
        return "SAFE_AGREEMENT"
    else:
        return "GENERAL"


def read_file_content(file_path):
    """Read content from uploaded file"""
    file_ext = os.path.splitext(file_path)[1].lower()

    try:
        if file_ext == '.txt':
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()

        elif file_ext == '.docx':
            try:
                from docx import Document
                doc = Document(file_path)
                return '\n'.join([para.text for para in doc.paragraphs])
            except ImportError:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    return f.read()

        elif file_ext == '.pdf':
            try:
                import PyPDF2
                with open(file_path, 'rb') as f:
                    pdf_reader = PyPDF2.PdfReader(f)
                    text = ''
                    for page in pdf_reader.pages:
                        text += page.extract_text()
                    return text
            except ImportError:
                return None

        else:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()

    except Exception as e:
        print(f"Error reading file: {e}")
        return None


@app.route('/')
def home():
    return jsonify({
        'service': 'Legal Document Analyzer API',
        'version': '1.0.0',
        'status': 'running',
        'validator_loaded': validator is not None
    })


@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'validator': validator is not None
    })


@app.route('/analyze', methods=['POST'])
def analyze_document():
    """
    Analyze uploaded legal document
    Expects: file upload with optional document_type parameter
    """

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Allowed: txt, doc, docx, pdf'}), 400

    try:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        print(f"\n📁 Processing file: {filename}")

        text = read_file_content(file_path)

        if text is None or len(text.strip()) == 0:
            os.remove(file_path)
            return jsonify({'error': 'Could not read file content'}), 400

        document_type = request.form.get('document_type', detect_document_type(text))

        print(f"📄 Document type: {document_type}")
        print(f"📏 Content length: {len(text)} characters")

        if validator:
            validation_result = validator.validate_document(text, document_type)
        else:
            validation_result = fallback_validation(text, document_type)

        os.remove(file_path)

        response = {
            'success': True,
            'filename': filename,
            'document_type': document_type,
            'validation': validation_result,
            'summary': generate_summary(validation_result),
            'processing_time': 0.0
        }

        print(f"✓ Analysis complete: {validation_result['total_flaws']} flaws found")

        return jsonify(response)

    except Exception as e:
        print(f"❌ Error: {e}")
        print(traceback.format_exc())

        if os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({
            'error': 'Analysis failed',
            'details': str(e)
        }), 500


def fallback_validation(text, document_type):
    """Fallback validation if ML model not loaded"""

    flaws = []
    text_lower = text.lower()

    required_checks = [
        ("party", "MISSING_PARTIES", "Document must identify parties", "CRITICAL"),
        ("date", "MISSING_DATE", "Document must have an effective date", "CRITICAL"),
        ("governing law", "MISSING_GOVERNING_LAW", "Document must specify governing law", "CRITICAL"),
        ("signature", "MISSING_SIGNATURES", "Document must have signatures", "HIGH")
    ]

    for keyword, flaw_type, description, severity in required_checks:
        if keyword not in text_lower:
            flaws.append({
                'flaw_type': flaw_type,
                'severity': severity,
                'location': 'Document-wide',
                'description': description,
                'suggestion': f'Add {keyword} clause',
                'clause_text': ''
            })

    if len(text) < 300:
        flaws.append({
            'flaw_type': 'INSUFFICIENT_DETAIL',
            'severity': 'MEDIUM',
            'location': 'Document-wide',
            'description': 'Document appears too brief',
            'suggestion': 'Add more detailed terms',
            'clause_text': ''
        })

    critical = len([f for f in flaws if f['severity'] == 'CRITICAL'])
    high = len([f for f in flaws if f['severity'] == 'HIGH'])

    return {
        'is_compliant': critical == 0 and high == 0,
        'is_valid': len(flaws) == 0,
        'confidence': 0.75,
        'total_flaws': len(flaws),
        'critical_flaws': critical,
        'high_flaws': high,
        'medium_flaws': len([f for f in flaws if f['severity'] == 'MEDIUM']),
        'low_flaws': len([f for f in flaws if f['severity'] == 'LOW']),
        'flaws': flaws
    }


def generate_summary(validation_result):
    """Generate human-readable summary"""

    if validation_result['is_compliant'] and validation_result['total_flaws'] == 0:
        return "✅ Document is legally compliant with no significant issues found."

    critical = validation_result['critical_flaws']
    high = validation_result['high_flaws']
    total = validation_result['total_flaws']

    if critical > 0:
        return f"❌ CRITICAL: Document has {critical} critical issue(s) that must be addressed. Total: {total} issues found."
    elif high > 0:
        return f"⚠️  WARNING: Document has {high} high-priority issue(s) requiring attention. Total: {total} issues found."
    else:
        return f"⚡ Document has {total} minor issue(s) that should be reviewed."


@app.route('/document-types', methods=['GET'])
def get_document_types():
    """Return supported document types"""
    return jsonify({
        'types': [
            {'value': 'GENERAL', 'label': 'General Contract'},
            {'value': 'NDA', 'label': 'Non-Disclosure Agreement'},
            {'value': 'EMPLOYMENT_AGREEMENT', 'label': 'Employment Agreement'},
            {'value': 'FOUNDER_AGREEMENT', 'label': 'Founder Agreement'},
            {'value': 'SAFE_AGREEMENT', 'label': 'SAFE Agreement'}
        ]
    })


if __name__ == '__main__':
    print("\n" + "="*80)
    print("🚀 Starting Flask server on http://localhost:5000")
    print("="*80)
    print("\nEndpoints:")
    print("  GET  /           - API info")
    print("  GET  /health     - Health check")
    print("  POST /analyze    - Analyze document")
    print("  GET  /document-types - Supported types")
    print("\n" + "="*80 + "\n")

    app.run(debug=True, host='0.0.0.0', port=5000)

import fitz
import spacy

nlp = spacy.load('en_core_web_sm')

def analyze_pdf(file_path):
    try:
        doc = fitz.open(file_path)
        text = ''
        for page in doc:
            text += page.get_text()
        doc.close()

        doc = nlp(text)
        skills = []
        for ent in doc.ents:
            if ent.label_ in ['SKILL', 'NORP', 'PRODUCT', 'ORG']:
                skills.append(ent.text)
        # Additional keyword-based skill extraction
        skill_keywords = ['Python', 'JavaScript', 'React', 'Flask', 'Machine Learning', 'SQL']
        for token in doc:
            if token.text in skill_keywords:
                skills.append(token.text)
        skills = list(set(skills))  # Remove duplicates
        score = min(len(skills) * 0.1, 1.0)

        return {'skills': skills, 'score': score}, score
    except Exception as e:
        return {'error': str(e)}, 0.0
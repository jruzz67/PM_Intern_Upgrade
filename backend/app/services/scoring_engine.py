import numpy as np

def calculate_affirmative_action_score(student_data):
    community_score = {
        'SC': 0.4,
        'ST': 0.4,
        'OBC': 0.3,
        'General': 0.1,
        'Others': 0.2
    }.get(student_data.get('community_category', 'General'), 0.1)
    
    gender_score = {
        'Female': 0.3,
        'Third Gender': 0.3,
        'Male': 0.1
    }.get(student_data.get('gender', 'Male'), 0.1)
    
    urban_rural_score = {
        'Rural': 0.3,
        'Urban': 0.1
    }.get(student_data.get('urban_rural', 'Urban'), 0.1)
    
    # Weighted average
    score = (0.4 * community_score + 0.3 * gender_score + 0.3 * urban_rural_score)
    return round(score, 2)

def calculate_score(student_data, internship_data, student_vector, internship_vector):
    weights = {
        'proficiency': 0.25,
        'structured_skills': 0.2,
        'accolades': 0.225,
        'validation': 0.225,
        'affirmative_action': 0.1
    }

    # Proficiency Score (cosine similarity)
    proficiency_score = np.dot(student_vector, internship_vector) / (
        np.linalg.norm(student_vector) * np.linalg.norm(internship_vector)
    ) if np.linalg.norm(student_vector) * np.linalg.norm(internship_vector) != 0 else 0.0

    # Mock scores (to be updated with LeetCode plugin)
    structured_skills_score = 0.5  # Mock
    accolades_score = 0.5  # Mock
    validation_score = 0.5  # Mock (GitHub/PDF working, LeetCode pending)

    # Affirmative Action
    affirmative_action_score = calculate_affirmative_action_score(student_data)

    # Final Score
    final_score = (
        weights['proficiency'] * proficiency_score +
        weights['structured_skills'] * structured_skills_score +
        weights['accolades'] * accolades_score +
        weights['validation'] * validation_score +
        weights['affirmative_action'] * affirmative_action_score
    )

    return {
        'proficiency': round(proficiency_score, 2),
        'structured_skills': round(structured_skills_score, 2),
        'accolades': round(accolades_score, 2),
        'validation': round(validation_score, 2),
        'affirmative_action': round(affirmative_action_score, 2),
        'final': round(final_score, 2)
    }
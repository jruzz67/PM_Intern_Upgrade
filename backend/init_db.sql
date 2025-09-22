-- Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    preferred_locations TEXT[] NOT NULL,
    resume_data JSONB,
    embedding VECTOR(384)  -- For all-MiniLM-L6-v2 (384 dimensions)
);

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Internships table
CREATE TABLE internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    must_have_skills TEXT[] NOT NULL,
    good_to_have_skills TEXT[] NOT NULL,
    plugins JSONB NOT NULL,  -- [{name: "github", priority: 1}, ...]
    deadline TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Accolade knowledge base
CREATE TABLE accolade_knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accolade_name VARCHAR(255) NOT NULL,
    global_value INTEGER NOT NULL,
    primary_sector VARCHAR(100),
    validation_state INTEGER NOT NULL DEFAULT 0 CHECK (validation_state IN (-1, 0, 1))
);

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    internship_id UUID REFERENCES internships(id),
    plugin_data JSONB,  -- {github: {url: "...", score: 0.85}, pdf: {...}}
    score JSONB,  -- {proficiency: 0.8, potential: 0.7, ...}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected'))
);
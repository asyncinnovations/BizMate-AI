CREATE TABLE compliance_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    company_id UUID,
    reminder_id UUID NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'uploaded',
    ai_summary TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (reminder_id) REFERENCES compliance_reminders(id)
);
CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    company_id UUID,
    reminder_id UUID,
    document_id UUID,
    question TEXT NOT NULL,
    answer TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    created_by UUID,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (reminder_id) REFERENCES compliance_reminders(id),
    FOREIGN KEY (document_id) REFERENCES compliance_documents(id)
);
CREATE TABLE compliance_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    company_id UUID,
    reminder_id UUID,
    document_id UUID,
    action_type VARCHAR(50) NOT NULL,
    action_details TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    created_by UUID,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (reminder_id) REFERENCES compliance_reminders(id),
    FOREIGN KEY (document_id) REFERENCES compliance_documents(id)
);
How It Works in Workflow

User creates reminder:

Record added: action_type = "reminder_created"

action_details = "VAT Filing Q3 2024 created"

AI chat:

Record added: action_type = "ai_asked" or "ai_answered"

Store question/answer in action_details.

Document uploaded:

Record added: action_type = "document_uploaded"

Store file name/path in action_details.

Reminder completed:

Record added: action_type = "reminder_completed"

Link to reminder and optionally document ID.

Audits / History page:

Fetch from this table to show a timeline of all compliance actions.
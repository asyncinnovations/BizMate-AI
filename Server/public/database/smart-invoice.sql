CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE,
  user_id VARCHAR(255) NULL,
  invoice_number VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_address TEXT,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  payment_terms VARCHAR(100),
  subtotal NUMERIC(12,2) DEFAULT 0,
  vat NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  custom_fields JSONB DEFAULT '[]', -- Dynamic fields live here
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE,
  invoice_id INT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INT DEFAULT 1,
  price NUMERIC(12,2) DEFAULT 0,
  amount NUMERIC(12,2) GENERATED ALWAYS AS (quantity * price) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO invoices (
  invoice_number,
  customer_name,
  invoice_date,
  due_date,
  total,
  custom_fields
) VALUES (
  'INV-920',
  'Hasan Khan',
  '2025-11-04',
  '2025-11-19',
  7560,
  '[{"label": "Project ID", "value": "PR-10023"}, {"label": "Manager", "value": "John Doe"}, {"label": "Department", "value": "IT"}]'
);



CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE,
  user_id INT, -- optional
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE invoice_audit_logs (
  id SERIAL PRIMARY KEY,
  invoice_id INT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  performed_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO invoices
(invoice_number, customer_name, invoice_date, due_date, payment_terms, subtotal, vat, total, notes, status)
VALUES
('INV-920', 'hasan khan', '2025-11-04', '2025-11-19', 'Net 45', 7200, 360, 7560, 'how are you', 'saved');

INSERT INTO invoice_items
(invoice_id, name, description, quantity, price)
VALUES
(1, 'battle', 'no description', 24, 300);
{
    "id": "1761641385386",
    "invoiceNumber": "INV-920",
    "customerName": "hasan khan",
    "customerEmail": "",
    "customerAddress": "",
    "invoiceDate": "2025-11-04",
    "dueDate": "2025-11-19",
    "paymentTerms": "Net 45",
    "items": [
        {
            "id": "1",
            "name": "battle",
            "description": "no description",
            "quantity": 24,
            "price": 300,
            "amount": 7200
        }
    ],
    "subtotal": 7200,
    "vat": 360,
    "total": 7560,
    "notes": "how areyou",
    "status": "saved",
    "createdAt": "2025-10-28T08:47:23.461Z"
}


--  INVOCIE CUSTOM FIELD IS INDUSTRY STANDARD
CREATE TABLE invoice_custom_fields (
  id SERIAL PRIMARY KEY,
  invoice_id INT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  field_value TEXT
);

SELECT * FROM invoices
WHERE custom_fields @> '[{"label": "Project Code", "value": "PRJ-88"}]';
-- 
@Column({ type: 'jsonb', default: [] })
custom_fields: { label: string; value: string }[];

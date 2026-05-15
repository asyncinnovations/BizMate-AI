CREATE TABLE employee_payroll (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    emirates_id VARCHAR(21) UNIQUE, -- Format: 784-XXXX-XXXXXXX-X
    
    -- Employment Details
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    joining_date DATE NOT NULL,
    contract_type ENUM('Full Time', 'Part Time', 'Contract', 'Internship') DEFAULT 'Full Time',
    
    -- Salary Breakdown (using DECIMAL for financial precision)
    basic_salary DECIMAL(15, 2) DEFAULT 0.00,
    housing_allowance DECIMAL(15, 2) DEFAULT 0.00,
    transport_allowance DECIMAL(15, 2) DEFAULT 0.00,
    other_allowance DECIMAL(15, 2) DEFAULT 0.00,
    
    -- Banking Details (WPS)
    bank_name VARCHAR(150),
    iban VARCHAR(23) UNIQUE, -- UAE IBANs are exactly 23 characters
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TYPE payroll_status AS ENUM ('draft', 'processed', 'paid', 'cancelled');

CREATE TABLE payroll_runs (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id UUID NOT NULL, -- The Admin/HR who created the run
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    status payroll_status DEFAULT 'draft',
    total_basic DECIMAL(15, 2) DEFAULT 0.00,
    total_allowances DECIMAL(15, 2) DEFAULT 0.00,
    total_net DECIMAL(15, 2) DEFAULT 0.00,
    processed_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE payroll_run_items (
    id SERIAL AUTO_INCREMENT,
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    payroll_run_id UUID ,
    employee_payroll_id UUID,
    
    -- Snapshotted values (Important: do not just reference the employee table)
    full_name VARCHAR(255),
    designation VARCHAR(100),
    bank_name VARCHAR(150),
    iban VARCHAR(23),
    
    -- Financials for this specific month
    basic_salary DECIMAL(15, 2) NOT NULL,
    housing_allowance DECIMAL(15, 2) DEFAULT 0.00,
    transport_allowance DECIMAL(15, 2) DEFAULT 0.00,
    other_allowance DECIMAL(15, 2) DEFAULT 0.00,
    
    -- Adjustments (Bonuses/Deductions)
    total_adjustments DECIMAL(15, 2) DEFAULT 0.00,
    
    -- Final Calculation
    net_salary DECIMAL(15, 2) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- npx sequelize-cli migration:generate --name invoice_schedule-table
CREATE TABLE payroll_adjustments (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    payroll_run_id UUID ,
    employee_payroll_id UUID ,
    
    -- Adjustment Details
    amount DECIMAL(15, 2) NOT NULL, -- Positive for Bonus, Negative for Deduction
    reason VARCHAR(255) NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup when generating payslips
CREATE INDEX idx_adj_run_employee ON payroll_adjustments(run_uuid, employee_uuid);
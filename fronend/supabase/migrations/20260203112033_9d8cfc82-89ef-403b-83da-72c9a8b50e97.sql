-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  expense_date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Since this is a single-user app without auth, allow all operations
CREATE POLICY "Allow all operations for expenses" 
ON public.expenses 
FOR ALL 
USING (true)
WITH CHECK (true);
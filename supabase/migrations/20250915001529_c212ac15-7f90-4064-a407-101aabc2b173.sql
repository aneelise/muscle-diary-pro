-- Create cardio table for tracking cardio exercises per day
CREATE TABLE public.cardio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_id UUID NOT NULL,
  cardio_type TEXT NOT NULL CHECK (cardio_type IN ('esteira', 'escada', 'bike', 'eliptico')),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cardio ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own cardio" 
ON public.cardio 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cardio" 
ON public.cardio 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cardio" 
ON public.cardio 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cardio" 
ON public.cardio 
FOR DELETE 
USING (auth.uid() = user_id);
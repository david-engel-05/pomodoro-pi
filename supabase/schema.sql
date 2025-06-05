-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#e85d5d',
  icon TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pomodoro_sessions table
CREATE TABLE public.pomodoro_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('work', 'short_break', 'long_break')) NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE public.user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  work_duration INTEGER DEFAULT 1500, -- 25 minutes in seconds
  short_break_duration INTEGER DEFAULT 300, -- 5 minutes in seconds
  long_break_duration INTEGER DEFAULT 900, -- 15 minutes in seconds
  auto_start_breaks BOOLEAN DEFAULT FALSE,
  auto_start_pomodoros BOOLEAN DEFAULT FALSE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_pomodoro_sessions_user_id ON public.pomodoro_sessions(user_id);
CREATE INDEX idx_pomodoro_sessions_category_id ON public.pomodoro_sessions(category_id);
CREATE INDEX idx_pomodoro_sessions_started_at ON public.pomodoro_sessions(started_at);
CREATE INDEX idx_categories_user_id ON public.categories(user_id);

-- Insert default categories
INSERT INTO public.categories (name, color, icon, user_id) VALUES
  ('Work', '#e85d5d', '💼', NULL),
  ('Study', '#3b82f6', '📚', NULL),
  ('Coding', '#10b981', '💻', NULL),
  ('Writing', '#8b5cf6', '✍️', NULL),
  ('Reading', '#f59e0b', '📖', NULL),
  ('Exercise', '#ef4444', '🏃', NULL);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON public.users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own categories and public categories" ON public.categories
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON public.categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON public.categories
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON public.pomodoro_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own settings" ON public.user_settings
  FOR ALL USING (auth.uid() = user_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pomodoro_sessions_updated_at BEFORE UPDATE ON public.pomodoro_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
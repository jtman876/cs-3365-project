
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://krjjfaendpntpjocgdbl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyampmYWVuZHBudHBqb2NnZGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDMwNDAsImV4cCI6MjA3NTQ3OTA0MH0.5YtJH_grLZRzapwH7aJEJ2yHUgCGEry28iMGuu_X1ls'
const supabase = createClient(supabaseUrl, supabaseKey)

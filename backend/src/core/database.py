from supabase import create_client, Client
from src.core.config import settings

# Instancia única del cliente de Supabase
supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
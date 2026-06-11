from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # Lee automáticamente el archivo .env desde la raíz del proyecto
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    # Define the configuration variables that you want to read from the .env file. For example, if you have a variable named DB_CONNECTION in your .env file, you can define it here as follows:
    DB_CONNECTION:str
    # SECRET_KEY:str
    # ALGORITHM:str
    # EXP_TIME_MINUTES:int

    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False


settings = Settings() #here settings object will be created and can be imported in other modules to access the configuration values. The DB_CONNECTION value will be read from the .env file.
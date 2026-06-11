from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from src.utils.settings import settings

# SMTP Configuration
conf = ConnectionConfig(
    MAIL_USERNAME = settings.MAIL_USERNAME,
    MAIL_PASSWORD = settings.MAIL_PASSWORD,
    MAIL_FROM = settings.MAIL_FROM,
    MAIL_PORT = settings.MAIL_PORT,
    MAIL_SERVER = settings.MAIL_SERVER,
    MAIL_STARTTLS = settings.MAIL_STARTTLS,
    MAIL_SSL_TLS = settings.MAIL_SSL_TLS,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = False
)

async def send_welcome_email(email: str, name: str, role: str):
    """
    Sends an English welcome email using await.
    """
    subject = "Welcome to NeedNourish!"
    
    html = f"""
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #16a34a; border-radius: 12px; max-width: 600px;">
        <h2 style="color: #16a34a;">NeedNourish</h2>
        <p>Hello <strong>{name}</strong>,</p>
        <p>Thank you for joining our platform as a <strong>{role}</strong>. Your contribution helps us fight food waste and nourish the community!</p>
        <div style="margin-top: 30px; padding: 15px; background-color: #f0fdf4; border-radius: 8px; text-align: center;">
            <p style="color: #166534; font-weight: bold;">Together, we nourish the world.</p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="color: #999; font-size: 11px;">This is an automated message from the NeedNourish Platform.</p>
    </div>
    """

    message = MessageSchema(
        subject=subject,
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)
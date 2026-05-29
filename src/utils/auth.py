from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from src.utils.db import get_db
from src.utils.helper import SECRET_KEY, ALGORITHM
from src.supplier.models import Supplier
from src.needy.models import Needy

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login") # Placeholder

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

def get_current_supplier(payload=Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.get("role") != "supplier":
        raise HTTPException(status_code=403, detail="Supplier access required")
    user = db.query(Supplier).filter(Supplier.id == int(payload.get("sub"))).first()
    if not user: raise HTTPException(status_code=404, detail="Supplier not found")
    return user

def get_current_needy(payload=Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.get("role") != "needy":
        raise HTTPException(status_code=403, detail="Receiver access required")
    user = db.query(Needy).filter(Needy.id == int(payload.get("sub"))).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    return user
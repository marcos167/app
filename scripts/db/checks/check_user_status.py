
from sqlmodel import Session, select
from server.db import engine
from server.models import User

def check_user():
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == "m22338294@gmail.com")).first()
        if user:
            print(f"User Found: {user.email}")
            print(f"Role: {user.role}")
            print(f"Disabled: {user.disabled}")
            print(f"Verified: {user.email_verified}")
        else:
            print("User NOT found")

if __name__ == "__main__":
    check_user()

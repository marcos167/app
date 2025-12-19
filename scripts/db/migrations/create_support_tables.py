from sqlmodel import SQLModel
from server.db import engine
from server.models import SupportTicket, SupportMessage

def create_tables():
    print("Creating Support tables...")
    SQLModel.metadata.create_all(engine)
    print("Done!")

if __name__ == "__main__":
    create_tables()

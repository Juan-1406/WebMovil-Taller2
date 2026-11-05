from typing import Optional
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))

    problems: Mapped[list["Problem"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )


class Problem(Base):
    __tablename__ = "problems"

    id: Mapped[int] = mapped_column(primary_key=True)
    titulo: Mapped[str] = mapped_column(String(150))
    plataforma: Mapped[str] = mapped_column(String(50))
    dificultad: Mapped[Optional[int]] = mapped_column(nullable=True)
    estado: Mapped[str] = mapped_column(String(20), default="Pendiente")
    url: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    tag: Mapped[Optional[str]] = mapped_column(String(50), index=True, nullable=True)

    owner: Mapped["User"] = relationship(back_populates="problems")
from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict

Estado = Literal["Pendiente", "Intentando", "Resuelto"]


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str


class ProblemBase(BaseModel):
    titulo: str = Field(min_length=1, max_length=150)
    plataforma: str = Field(min_length=1, max_length=50)
    dificultad: Optional[int] = Field(default=None, ge=0, le=4000)
    estado: Estado = "Pendiente"
    url: Optional[str] = Field(default=None, max_length=300)
    tag: Optional[str] = Field(default=None, max_length=50)


class ProblemCreate(ProblemBase):
    pass


class ProblemUpdate(ProblemBase):
    pass


class ProblemOut(ProblemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
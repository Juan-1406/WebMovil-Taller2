from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.models import Problem, User
from app.schemas.schemas import ProblemCreate, ProblemUpdate, ProblemOut
from app.services.security import get_current_user

router = APIRouter(prefix="/problems", tags=["problems"])


def get_own_problem(db: Session, problem_id: int, user: User) -> Problem:
    problem = db.get(Problem, problem_id)
    if not problem or problem.user_id != user.id:
        raise HTTPException(status_code=404, detail="Problema no encontrado")
    return problem


@router.get("", response_model=list[ProblemOut])
def list_problems(
    plataforma: Optional[str] = None,
    estado: Optional[str] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = db.query(Problem).filter(Problem.user_id == user.id)
    if plataforma:
        query = query.filter(Problem.plataforma == plataforma)
    if estado:
        query = query.filter(Problem.estado == estado)
    return query.order_by(Problem.id.desc()).all()


@router.get("/{problem_id}", response_model=ProblemOut)
def get_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_own_problem(db, problem_id, user)


@router.post("", response_model=ProblemOut, status_code=201)
def create_problem(
    data: ProblemCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    problem = Problem(**data.model_dump(), user_id=user.id)
    db.add(problem)
    db.commit()
    db.refresh(problem)
    return problem


@router.put("/{problem_id}", response_model=ProblemOut)
def update_problem(
    problem_id: int,
    data: ProblemUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    problem = get_own_problem(db, problem_id, user)
    for key, value in data.model_dump().items():
        setattr(problem, key, value)
    db.commit()
    db.refresh(problem)
    return problem


@router.delete("/{problem_id}", status_code=204)
def delete_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    problem = get_own_problem(db, problem_id, user)
    db.delete(problem)
    db.commit()
    return Response(status_code=204)